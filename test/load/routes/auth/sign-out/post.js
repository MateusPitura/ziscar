import { sleep } from "k6";
import http from "k6/http";
import { API_URL } from "/shared/src/constants.ts";
import { checkResponse } from "/test/load/utils/checkResponse.js";
import {
  defaultDuration,
  defaultHeaders,
  defaultRequestsPerVU,
} from "/test/load/utils/constants.js";
import { signIn } from "/test/load/utils/signIn.js";

const VUS = 150;

export const options = {
  vus: VUS,
  iterations: VUS * defaultRequestsPerVU,
  duration: defaultDuration,
};

export function setup() {
  return signIn();
}

export default function (data) {
  const url = `${API_URL}/auth/sign-out`;

  const params = defaultHeaders;

  const response = http.post(url, null, params);

  checkResponse(response, 200);

  sleep(1);
}
