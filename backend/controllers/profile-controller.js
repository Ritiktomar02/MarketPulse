import bcrypt from "bcryptjs";
import User from "../models/user-model.js";

import { deleteImage, uploadImage } from "../config/imagekit-connection.js";

const userResponse = (user) => {
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

export const getProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: userResponse(req.user),
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Profile error:", error);
    }

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username, bio, phone, email, picture } = req.body;

    const user = req.user;

    if (email !== undefined && email.trim().toLowerCase() !== user.email) {
      const normalizedEmail = email.trim().toLowerCase();

      const emailTaken = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id },
      });

      if (emailTaken) {
        return res.status(409).json({
          message: "Email is already in use",
        });
      }

      user.email = normalizedEmail;
    }

    if (username !== undefined) {
      if (!username.trim()) {
        return res.status(400).json({
          message: "Username cannot be empty",
        });
      }

      user.username = username.trim();
    }

    if (bio !== undefined) {
      if (bio.length > 300) {
        return res.status(400).json({
          message: "Bio cannot exceed 300 characters",
        });
      }

      user.bio = bio.trim();
    }

    if (phone !== undefined) {
      user.phone = phone.trim();
    }

    if (picture !== undefined) {
      if (picture === "") {
        user.picture = "";
        user.pictureFileId = "";
      } else {
        try {
          new URL(picture);
        } catch {
          return res.status(400).json({
            message: "Invalid image URL",
          });
        }

        const oldPictureFileId = user.pictureFileId;

        user.picture = picture;
        user.pictureFileId = "";

        await user.save();

        if (oldPictureFileId) {
          try {
            await deleteImage(oldPictureFileId);
          } catch (error) {
            if (process.env.NODE_ENV === "development") {
              console.error("Old image deletion failed:", error);
            }
          }
        }

        return res.status(200).json({
          success: true,
          message: "Profile updated successfully",
          user: userResponse(user),
        });
      }
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: userResponse(user),
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Update profile error:", error);
    }

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Profile picture is required",
      });
    }

    const user = req.user;

    const oldPictureFileId = user.pictureFileId;

    const result = await uploadImage(
      req.file.buffer,
      req.file.originalname,
      "/profile-photos",
    );

    user.picture = result.url;
    user.pictureFileId = result.fileId;

    await user.save();

    if (oldPictureFileId) {
      try {
        await deleteImage(oldPictureFileId);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Old image deletion failed:", error);
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      picture: user.picture,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Upload profile picture error:", error);
    }

    return res.status(500).json({
      message: "Profile picture upload failed",
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.authProvider === "google") {
      return res.status(400).json({
        message: "Google accounts do not have a password",
      });
    }

    const valid = await bcrypt.compare(currentPassword, user.password);

    if (!valid) {
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Update password error:", error);
    }

    return res.status(500).json({
      message: "Password update failed",
    });
  }
};
