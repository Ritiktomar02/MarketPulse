import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const AUTH = {
  REGISTER: "/api/user/register",
  LOGIN: "/api/user/login",
  GOOGLE_LOGIN: "/api/user/google",
  LOGOUT: "/api/user/logout",
};

export const PROFILE = {
  GET: "/api/profile/get",
  UPDATE: "/api/profile/update",
  UPDATE_PASSWORD: "/api/profile/update-password",
  UPDATE_PICTURE: "/api/profile/update-picture",
};

export const MARKET = {
  ALL_COINS: "/api/market/coins",

  COIN: (symbol) =>
    `/api/market/${symbol}`,

  COIN_HISTORY: (symbol) =>
    `/api/market/${symbol}/history`,
};

export const WEATHER = {
  GET: "/api/weather",
};

export default api;