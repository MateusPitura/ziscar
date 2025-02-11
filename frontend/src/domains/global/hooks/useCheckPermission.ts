import useGlobalContext from "./useGlobalContext";
import { Action, Resource } from "../types/user";

export default function useCheckPermission(resource: Resource, action: Action): boolean {
  const { userLogged } = useGlobalContext();

  if (userLogged?.permissions[resource][action]) {
    return true;
  }

  return false;
}
