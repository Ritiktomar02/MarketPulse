import { useEffect, useState } from "react";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import api, { MARKET } from "../services/api";

const Coins = () => {
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [history, setHistory] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadCoins = async () => {
      try {
        const response = await api.get(
          MARKET.ALL_COINS
        );

        setCoins(response.data.coins || []);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load coins"
        );
      } finally {
        setLoading(false);
      }
    };

    loadCoins();
  }, []);

  const selectCoin = async (symbol) => {
    setDetailLoading(true);
    setError("");

    try {
      const [coinResponse, historyResponse] =
        await Promise.all([
          api.get(MARKET.COIN(symbol)),
          api.get(MARKET.COIN_HISTORY(symbol), {
            params: {
              interval: "1h",
              limit: 24,
            },
          }),
        ]);

      setSelectedCoin(coinResponse.data);

      setHistory(
        historyResponse.data.history || []
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load coin details"
      );
    } finally {
      setDetailLoading(false);
    }
  };

  const filteredCoins = coins.filter((coin) =>
    coin.symbol
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Cryptocurrency Market
        </h1>

        <p className="mt-2 text-slate-400">
          Select a coin to view its current status
          and price history.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <input
            type="text"
            placeholder="Search coin..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-500"
          />

          {loading ? (
            <div className="py-10 text-center text-slate-400">
              Loading coins...
            </div>
          ) : (
            <div className="max-h-150 space-y-2 overflow-y-auto">
              {filteredCoins.map((coin) => (
                <button
                  key={coin.symbol}
                  onClick={() =>
                    selectCoin(coin.symbol)
                  }
                  className={`w-full rounded-lg border p-4 text-left transition ${
                    selectedCoin?.symbol ===
                    coin.symbol
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-slate-800 bg-slate-950 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">
                      {coin.symbol}
                    </span>

                    <span
                      className={
                        coin.changePercent >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {coin.changePercent >= 0
                        ? "+"
                        : ""}
                      {coin.changePercent.toFixed(2)}%
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-400">
                    ${coin.price}
                  </p>
                </button>
              ))}

              {filteredCoins.length === 0 && (
                <p className="py-8 text-center text-slate-500">
                  No coins found.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {!selectedCoin && !detailLoading && (
            <div className="flex min-h-125 items-center justify-center rounded-xl border border-slate-800 bg-slate-900">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-white">
                  Select a coin
                </h2>

                <p className="mt-2 text-slate-400">
                  Choose a coin from the list.
                </p>
              </div>
            </div>
          )}

          {detailLoading && (
            <div className="flex min-h-125 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400">
              Loading coin details...
            </div>
          )}

          {selectedCoin && !detailLoading && (
            <div className="space-y-6">
              {/* Coin Status */}
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-500">
                      Selected Coin
                    </p>

                    <h2 className="mt-1 text-3xl font-bold text-white">
                      {selectedCoin.symbol}
                    </h2>
                  </div>

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      selectedCoin.trend === "up"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {selectedCoin.trend === "up"
                      ? "↑ Up"
                      : "↓ Down"}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg bg-slate-800 p-4">
                    <p className="text-sm text-slate-500">
                      Last Price
                    </p>

                    <p className="mt-1 text-xl font-bold text-white">
                      ${selectedCoin.lastPrice}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4">
                    <p className="text-sm text-slate-500">
                      24h Change
                    </p>

                    <p
                      className={`mt-1 text-xl font-bold ${
                        selectedCoin.changePercent >=
                        0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {selectedCoin.changePercent >=
                      0
                        ? "+"
                        : ""}
                      {selectedCoin.changePercent.toFixed(
                        2
                      )}
                      %
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4">
                    <p className="text-sm text-slate-500">
                      24h High
                    </p>

                    <p className="mt-1 text-xl font-bold text-white">
                      ${selectedCoin.highPrice}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-lg bg-slate-800 p-4">
                  <p className="text-sm text-slate-500">
                    24h Low
                  </p>

                  <p className="mt-1 text-xl font-bold text-white">
                    ${selectedCoin.lowPrice}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="mb-6 text-xl font-bold text-white">
                  Price History
                </h2>

                <div className="h-100">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <LineChart data={history}>
                      <XAxis
                        dataKey="time"
                        tickFormatter={(value) =>
                          new Date(
                            value
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        }
                        stroke="#64748b"
                      />

                      <YAxis
                        domain={["auto", "auto"]}
                        stroke="#64748b"
                      />

                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          border:
                            "1px solid #334155",
                          borderRadius: "8px",
                        }}
                        labelFormatter={(value) =>
                          new Date(
                            value
                          ).toLocaleString()
                        }
                        formatter={(value) => [
                          `$${Number(
                            value
                          ).toFixed(4)}`,
                          "Price",
                        ]}
                      />

                      <Line
                        type="monotone"
                        dataKey="close"
                        stroke="#34d399"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Coins;