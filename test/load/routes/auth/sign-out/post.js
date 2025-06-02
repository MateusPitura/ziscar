import http from "k6/http";
import { sleep } from "k6";
import {
  defaultDuration,
  defaultHeaders,
  defaultRequestsPerVU,
  defaultUrl,
} from "../../../utils/constants.js";
import { signIn } from "../../../utils/signIn.js";
import { getToken } from "../../../utils/getToken.js";
import { checkResponse } from "../../../utils/checkResponse.js";

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
  const url = `${defaultUrl}/auth/sign-out`;

  const params = {
    ...defaultHeaders,
    cookies: {
      jwt: getToken(data),
    },
  };

  const response = http.post(url, null, params);

  checkResponse(response, 200);

  sleep(1);
}
