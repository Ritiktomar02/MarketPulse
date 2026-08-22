import express from "express";

import {
  getProfile,
  updateProfile,
  updatePassword,
  uploadProfilePicture,
} from "../controllers/profile-controller.js";

import { protect } from "../middlewares/user-middleware.js";

import upload from "../middlewares/upload-middleware.js";

const router = express.Router();

router.get("/get", protect, getProfile);

router.patch("/update", protect, updateProfile);

router.patch(
  "/update-picture",
  protect,
  upload.single("picture"),
  uploadProfilePicture,
);

router.patch("/update-password", protect, updatePassword);

export default router;
