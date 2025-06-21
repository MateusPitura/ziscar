import { BACKEND_PORT, API_URL } from "@shared/constants";

export const BLANK = " ";

export const BASE_URL = import.meta.env.PROD // 🌠 trocar para backend_url
  ? API_URL
  : `http://localhost:${BACKEND_PORT}`;

export const AUTH_CHANNEL = {
  SIGNIN: "SIGN_IN",
  SIGNOUT: "SIGN_OUT",
};
