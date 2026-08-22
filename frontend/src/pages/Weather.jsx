import { useEffect, useState } from "react";

import api, { WEATHER } from "../services/api";

const Weather = () => {
  const [places, setPlaces] = useState([]);
  const [timestamp, setTimestamp] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadWeather = async () => {
      try {
        const response = await api.get(
          WEATHER.GET
        );

        const { metadata, items } =
          response.data;

        const stations =
          metadata?.stations || [];

        const readings =
          items?.[0]?.readings || [];

        const stationMap = new Map(
          stations.map((station) => [
            station.id ||
              station.station_id,
            station,
          ])
        );

        const result = readings.map(
          (reading) => {
            const station =
              stationMap.get(
                reading.station_id
              );

            return {
              id: reading.station_id,
              name:
                station?.name ||
                reading.station_id,
              temperature: reading.value,
            };
          }
        );

        setPlaces(result);

        setTimestamp(
          items?.[0]?.timestamp || ""
        );
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load weather data"
        );
      } finally {
        setLoading(false);
      }
    };

    loadWeather();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Weather
        </h1>

        <p className="mt-2 text-slate-400">
          Current temperature by location.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
          Loading weather data...
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 p-5">
            <h2 className="text-xl font-bold text-white">
              Places
            </h2>

            {timestamp && (
              <span className="text-sm text-slate-500">
                Updated:{" "}
                {new Date(
                  timestamp
                ).toLocaleString()}
              </span>
            )}
          </div>

          <div className="divide-y divide-slate-800">
            {places.map((place) => (
              <div
                key={place.id}
                className="flex items-center justify-between p-5 transition hover:bg-slate-800/50"
              >
                <div>
                  <p className="font-semibold text-white">
                    {place.name}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Station: {place.id}
                  </p>
                </div>

                <p className="text-xl font-bold text-emerald-400">
                  {place.temperature}°C
                </p>
              </div>
            ))}

            {places.length === 0 && (
              <p className="p-8 text-center text-slate-500">
                No weather data available.
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default Weather;