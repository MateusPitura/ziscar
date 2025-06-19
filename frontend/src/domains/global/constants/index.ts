export const BLANK = " ";

export const BASE_URL = import.meta.env.PROD
  ? "https://api.ziscar.me"
  : "http://localhost:3000";

export const AUTH_CHANNEL = {
  SIGNIN: "SIGN_IN",
  SIGNOUT: "SIGN_OUT",
}