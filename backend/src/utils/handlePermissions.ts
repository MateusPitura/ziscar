import { NotFoundException } from '@nestjs/common';
import { Permissions } from '@shared/types';
import { DEFAULT_PERMISSIONS } from 'src/user/user.constant';
import { Role } from 'src/user/user.type';

interface HandlePermissionsProperties {
  role?: Role;
}

export default function handlePermissions({
  role,
}: HandlePermissionsProperties): Permissions {
  if (!role?.permissions) {
    throw new NotFoundException('Permissões não encontradas');
  }

  const permissionsFormatted = structuredClone(DEFAULT_PERMISSIONS);
  for (const permission of role.permissions) {
    permissionsFormatted[permission.resource][permission.action] = true;
  }

  return permissionsFormatted;
}
