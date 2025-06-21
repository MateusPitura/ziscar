import { check } from "k6";

export function checkResponse(response, statusCode) {
  check(response, {
    check: (r) => {
      if (r.status === statusCode) {
        return true;
      } else {
        console.error("❌", JSON.stringify(r.body));
        return false;
      }
    },
  });
}
