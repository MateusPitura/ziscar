import { Action, Permissions, Resource } from "@shared/types";

export default function checkPermission(
  userPermissions?: Permissions,
  resource?: Resource,
  action?: Action
): boolean {
  if (!resource || !action) return true;

  return !!userPermissions?.[resource][action];
}
