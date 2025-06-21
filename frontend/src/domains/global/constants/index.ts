import { BACKEND_PROD_URL } from "@shared/constants";

export const BLANK = " ";

export const BASE_URL = import.meta.env.PROD // 🌠 trocar para backend_url
  ? BACKEND_PROD_URL
  : "http://localhost:3000";

export const AUTH_CHANNEL = {
  SIGNIN: "SIGN_IN",
  SIGNOUT: "SIGN_OUT",
};
