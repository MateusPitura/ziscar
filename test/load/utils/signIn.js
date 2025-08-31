import http from "k6/http";
import { sleep } from "k6";
import { checkResponse } from "./checkResponse.js";
import { API_URL } from "/shared/src/constants.ts";

export function signIn() {
  const response = http.post(`${API_URL}/auth/sign-in`, {
    email: __ENV.K6_EMAIL,
    password: __ENV.K6_PASSWORD,
  });

  checkResponse(response, 200);

  sleep(1);

  const cookies = response.cookies;

  return { cookies };
}
