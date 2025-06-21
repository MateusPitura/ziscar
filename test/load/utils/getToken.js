import { JWT_COOKIE_NAME } from "/shared/src/constants.ts";

export function getToken(data) {
  return data.cookies[JWT_COOKIE_NAME][0].Value;
}
