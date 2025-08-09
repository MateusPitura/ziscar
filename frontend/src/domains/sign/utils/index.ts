export function verifyNewPasswordRoute(searchParams: URLSearchParams) {
  if (searchParams.has("token")) {
    return searchParams.get("token");
  }
}
