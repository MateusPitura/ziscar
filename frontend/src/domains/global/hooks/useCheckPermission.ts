import useGlobalContext from "./useGlobalContext";
import { Action, Resource } from "../types/user";

export default function useCheckPermission(
  resource?: Resource,
  action?: Action
): boolean {
  const { userLogged } = useGlobalContext();

  if (!resource || !action) return true;

  if (userLogged?.permissions[resource][action]) {
    return true;
  }

  return false;
}
