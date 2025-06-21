import http from "k6/http";
import { sleep } from "k6";
import {
  defaultDuration,
  defaultHeaders,
  defaultRequestsPerVU,
  defaultUrl,
} from "/test/load/utils/constants.js";
import { signIn } from "/test/load/utils/signIn.js";
import { getToken } from "/test/load/utils/getToken.js";
import { checkResponse } from "/test/load/utils/checkResponse.js";
import { JWT_COOKIE_NAME } from "/shared/src/constants.ts";

const VUS = 150;

export const options = {
  vus: VUS,
  iterations: VUS * defaultRequestsPerVU,
  duration: defaultDuration,
};

export function setup() {
  return signIn()
}

export default function (data) {
  const url = `${defaultUrl}/profile`;

  const params = {
    ...defaultHeaders,
    cookies: {
      [JWT_COOKIE_NAME]: getToken(data),
    },
  };

  const response = http.get(url, params);

  checkResponse(response, 200)

  sleep(1);
}
