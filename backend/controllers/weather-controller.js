export const getWeather = async (req, res) => {
  try {
    const response = await fetch(
      process.env.WEATHER_API_URL
    );

    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const data = await response.json();

    return res.status(200).json({
      success: true,
      metadata: data.metadata,
      items: data.items,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Get weather error:", error);
    }

    return res.status(500).json({
      message: "Failed to get weather data",
    });
  }
};