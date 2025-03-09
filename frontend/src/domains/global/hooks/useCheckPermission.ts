import { useMemo } from "react";
import checkPermission from "../utils/checkPermission";
import { Action, Resource } from "@shared/types";
import usePermissions from "./usePermissions";

export default function useCheckPermission(
  resource?: Resource,
  action?: Action
): boolean {
  const { userPermissions } = usePermissions();

  const hasPermission = useMemo(() => {
    return checkPermission(userPermissions, resource, action);
  }, [userPermissions, resource, action]);

  return hasPermission;
}
