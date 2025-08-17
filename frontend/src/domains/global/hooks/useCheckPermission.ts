import { useMemo } from "react";
import checkPermission from "../utils/checkPermission";
import usePermissions from "./usePermissions";
import { ActionsType, ResourcesType } from "@shared/enums";

export default function useCheckPermission(
  resource?: ResourcesType,
  action?: ActionsType
): boolean {
  const { userPermissions } = usePermissions();

  const hasPermission = useMemo(() => {
    return checkPermission(userPermissions, resource, action);
  }, [userPermissions, resource, action]);

  return hasPermission;
}
