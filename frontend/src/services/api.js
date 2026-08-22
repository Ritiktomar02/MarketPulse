const BASE_URL = import.meta.env.VITE_BASE_URL || "/api";

export const AUTH = {
  REGISTER: `${BASE_URL}/user/register`,
  LOGIN: `${BASE_URL}/user/login`,
  GOOGLE_LOGIN: `${BASE_URL}/user/google-login`,
  LOGOUT: `${BASE_URL}/user/logout`,
  REFRESH: `${BASE_URL}/user/refresh`,
  PROFILE: `${BASE_URL}/user/profile`,
  UPLOAD_PHOTO: `${BASE_URL}/user/profile/photo`,
};

export const MARKET = {
  ALL_COINS: `${BASE_URL}/market/coins`,
  COIN: (symbol) => `${BASE_URL}/market/coins/${symbol}`,
  COIN_GRAPH: (symbol) => `${BASE_URL}/market/coins/${symbol}/graph`,
};

export const WEATHER = {
  AIR_TEMPERATURE: `${BASE_URL}/weather/air-temperature`,
};
