import bcrypt from "bcryptjs";
import User from "../models/user-model.js";
import { generateToken, cookieOptions } from "../utils/generateTokenAndSetCookies.js";
import { oauth2Client } from "../config/google-connection.js";
import { google } from "googleapis";

const sendUserResponse = (user) => {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    picture: user.picture,
    bio: user.bio,
    phone: user.phone,
    authProvider: user.authProvider,
  };
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: username.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      authProvider: "local",
    });

    const token = generateToken(user._id);

    res.cookie("authToken", token, cookieOptions);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: sendUserResponse(user),
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Register error:", error);
    }

    return res.status(500).json({
      message: "Registration failed",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (user.authProvider === "google") {
      return res.status(400).json({
        message: "This account uses Google login",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    res.cookie("authToken", token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: sendUserResponse(user),
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Login error:", error);
    }

    return res.status(500).json({
      message: "Login failed",
    });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        message: "Google authorization code is required",
      });
    }

    const { tokens } = await oauth2Client.getToken({
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    });

    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    const { data } = await oauth2.userinfo.get();

    const { email, name, picture } = data;

    if (!email) {
      return res.status(400).json({
        message: "Google account email not available",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    let user = await User.findOne({
      email: normalizedEmail,
    });

    if (user && user.authProvider === "local") {
      return res.status(400).json({
        message:
          "This account uses email and password. Please login with email and password.",
      });
    }

    if (!user) {
      user = await User.create({
        username: name || normalizedEmail.split("@")[0],
        email: normalizedEmail,
        picture: picture || "",
        authProvider: "google",
      });
    } else {
      if (!user.picture && picture) {
        user.picture = picture;
        await user.save();
      }
    }

    const token = generateToken(user._id);

    res.cookie("authToken", token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Google login successful",
      user: sendUserResponse(user),
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Google login error:", error);
    }

    return res.status(500).json({
      message: "Google authentication failed",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("authToken", cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Logout error:", error);
    }

    return res.status(500).json({
      message: "Logout failed",
    });
  }
};
