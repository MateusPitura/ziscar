import http from "k6/http";
import { sleep } from "k6";
import { defaultDuration, defaultHeaders, defaultRequestsPerVU } from "/test/load/utils/constants.js";
import { checkResponse } from "/test/load/utils/checkResponse.js";
import { API_URL } from "/shared/src/constants.ts";

const VUS = 5

export const options = {
  vus: VUS,
  iterations: VUS * defaultRequestsPerVU,
  duration: defaultDuration,
};

export default function () {
  const url = `${API_URL}/auth/sign-in`;

  const params = {
    ...defaultHeaders
  };

  const payload = {
    password: __ENV.K6_PASSWORD,
    email: __ENV.K6_EMAIL
  }

  const response = http.post(url, JSON.stringify(payload), params);

  checkResponse(response, 200)

  sleep(1);
}
