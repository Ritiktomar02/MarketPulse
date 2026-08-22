import express from "express";

import {
  register,
  login,
  googleLogin,
  logout,
} from "../controllers/user-controller.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/google", googleLogin);

router.post("/logout", logout);

export default router;
