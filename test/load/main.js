import http from "k6/http";
import { sleep, check } from "k6";

const VUS = parseInt(__ENV.VUS);
const AVERAGE_REQUESTS_PER_SESSION = 100;

export const options = {
  vus: VUS,
  iterations: VUS * AVERAGE_REQUESTS_PER_SESSION,
  duration: "15m",
};

export function setup() {
  const loginResponse = http.post(`${__ENV.BASE_URL}/auth/sign-in`, {
    email: __ENV.EMAIL,
    password: __ENV.PASSWORD,
  });

  check(loginResponse, {
    "login": (r) => {
      if (r.status === 200) {
        return true;
      } else {
        console.log("login failed: ", JSON.stringify(r.body));
        return false;
      }
    },
  });

  sleep(1);

  const cookies = loginResponse.cookies;

  return { cookies };
}

export default function (data) {
  const url = `${__ENV.BASE_URL}/${__ENV.ENDPOINT}`;

  const token = data.cookies['jwt'][0].Value; // TODO: usar 'jwt' da variável global

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
    cookies: {
      jwt: token,
    },
  };

  let response = null;
  switch (__ENV.METHOD) {
    case '"GET"':
      response = http.get(url, params);
      break;
    case '"POST"':
      response = http.post(url, __ENV.PAYLOAD, params);
      break;
    default:
      break;
  }

  check(response, {
    "check": (r) => {
      if (r.status === parseInt(__ENV.STATUS_CODE)) {
        return true;
      } else {
        console.log("error: ", JSON.stringify(r.body));
        return false;
      }
    },
  });

  sleep(1);
}
