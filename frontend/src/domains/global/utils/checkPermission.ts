import { ActionsType, ResourcesType } from "@shared/enums";
import { Permissions } from "@shared/types";

export default function checkPermission(
  userPermissions?: Permissions,
  resource?: ResourcesType,
  action?: ActionsType
): boolean {
  if (!resource || !action) return true;

  return !!userPermissions?.[resource][action];
}
