export const BLANK = " ";

export const BASE_URL = import.meta.env.PROD
  ? "https://api.ziscar.me"
  : "http://localhost:3000";

export const AUTH_CHANNEL_SIGNIN = 'SIGN_IN'
export const AUTH_CHANNEL_SIGNOUT = 'SIGN_OUT'