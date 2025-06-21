import http from "k6/http";
import { sleep } from "k6";
import { checkResponse } from "./checkResponse.js";
import { BACKEND_PROD_URL } from "/shared/src/constants.ts";

export function signIn() {
  const response = http.post(`${BACKEND_PROD_URL}/auth/sign-in`, {
    email: __ENV.EMAIL,
    password: __ENV.PASSWORD,
  });

  checkResponse(response, 200);

  sleep(1);

  const cookies = response.cookies;

  return { cookies };
}
