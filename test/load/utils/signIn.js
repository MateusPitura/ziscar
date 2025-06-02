import http from "k6/http";
import { sleep } from "k6";
import { defaultUrl } from "./constants.js";
import { checkResponse } from "./checkResponse.js";

export function signIn() {
  const response = http.post(`${defaultUrl}/auth/sign-in`, {
    email: __ENV.EMAIL,
    password: __ENV.PASSWORD,
  });

  checkResponse(response, 200);

  sleep(1);

  const cookies = response.cookies;

  return { cookies };
}
