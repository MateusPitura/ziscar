import useGlobalContext from "./useGlobalContext";
import { useMemo } from "react";
import checkPermission from "../utils/checkPermission";
import { Action, Resource } from "@shared/types";

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
