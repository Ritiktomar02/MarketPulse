const BINANCE_URL =
  process.env.BINANCE_BASE_URL ||
  "https://api.binance.com";

export const getCoins = async (req, res) => {
  try {
    const response = await fetch(
      `${BINANCE_URL}/api/v3/ticker/24hr`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Binance data");
    }

    const data = await response.json();

    const coins = data.map((coin) => ({
      symbol: coin.symbol,
      price: Number(coin.lastPrice),
      changePercent: Number(coin.priceChangePercent),
      trend:
        Number(coin.priceChangePercent) >= 0
          ? "up"
          : "down",
    }));

    return res.status(200).json({
      success: true,
      coins,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Get coins error:", error);
    }

    return res.status(500).json({
      message: "Failed to get coin data",
    });
  }
};

export const getCoin = async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();

    const response = await fetch(
      `${BINANCE_URL}/api/v3/ticker/24hr?symbol=${symbol}`
    );

    if (!response.ok) {
      return res.status(404).json({
        message: "Coin not found",
      });
    }

    const coin = await response.json();

    const changePercent =
      Number(coin.priceChangePercent);

    return res.status(200).json({
      success: true,
      symbol: coin.symbol,
      lastPrice: Number(coin.lastPrice),
      changePercent,
      trend:
        changePercent >= 0
          ? "up"
          : "down",
      highPrice: Number(coin.highPrice),
      lowPrice: Number(coin.lowPrice),
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Get coin error:", error);
    }

    return res.status(500).json({
      message: "Failed to get coin",
    });
  }
};

export const getCoinHistory = async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();

    const interval =
      req.query.interval || "1h";

    const limit =
      Number(req.query.limit) || 24;

    const allowedIntervals = [
      "1m",
      "5m",
      "15m",
      "30m",
      "1h",
      "4h",
      "1d",
    ];

    if (!allowedIntervals.includes(interval)) {
      return res.status(400).json({
        message: "Invalid interval",
      });
    }

    if (limit < 1 || limit > 1000) {
      return res.status(400).json({
        message: "Limit must be between 1 and 1000",
      });
    }

    const response = await fetch(
      `${BINANCE_URL}/api/v3/klines` +
        `?symbol=${symbol}` +
        `&interval=${interval}` +
        `&limit=${limit}`
    );

    if (!response.ok) {
      return res.status(404).json({
        message: "Coin history not found",
      });
    }

    const data = await response.json();

    const history = data.map((candle) => ({
      time: candle[0],
      open: Number(candle[1]),
      high: Number(candle[2]),
      low: Number(candle[3]),
      close: Number(candle[4]),
    }));

    return res.status(200).json({
      success: true,
      symbol,
      interval,
      history,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Get coin history error:", error);
    }

    return res.status(500).json({
      message: "Failed to get coin history",
    });
  }
};