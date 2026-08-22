import express from "express";

import {
  getCoins,
  getCoin,
  getCoinHistory,
} from "../controllers/market-controller.js";

const router = express.Router();

router.get("/coins", getCoins);

router.get("/:symbol", getCoin);

router.get("/:symbol/history", getCoinHistory);

export default router;
