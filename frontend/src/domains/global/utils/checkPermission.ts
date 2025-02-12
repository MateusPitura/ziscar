import { Action, Resource, UserLogged } from "../types/user";

export default function checkPermission(
  userLogged?: UserLogged,
  resource?: Resource,
  action?: Action
): boolean {
  if (!resource || !action) return true;

  return !!userLogged?.permissions[resource][action];
}
