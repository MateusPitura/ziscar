import useGlobalContext from "./useGlobalContext";
import { Action, Resource } from "../types/user";
import { useMemo } from "react";
import checkPermission from "../utils/checkPermission";

export default function useCheckPermission(
  resource?: Resource,
  action?: Action
): boolean {
  const { userLogged } = useGlobalContext();

  const hasPermission = useMemo(() => {
    return checkPermission(userLogged, resource, action);
  }, [userLogged, resource, action]);

  return hasPermission;
}
