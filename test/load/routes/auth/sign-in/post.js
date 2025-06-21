import http from "k6/http";
import { sleep } from "k6";
import { defaultDuration, defaultHeaders, defaultRequestsPerVU, defaultUrl } from "/test/load/utils/constants.js";
import { checkResponse } from "/test/load/utils/checkResponse.js";

const VUS = 5

export const options = {
  vus: VUS,
  iterations: VUS * defaultRequestsPerVU,
  duration: defaultDuration,
};

export default function () {
  const url = `${defaultUrl}/auth/sign-in`;

  const params = {
    ...defaultHeaders
  };

  const payload = {
    password: __ENV.PASSWORD,
    email: __ENV.EMAIL
  }

  const response = http.post(url, JSON.stringify(payload), params);

  checkResponse(response, 200)

  sleep(1);
}
