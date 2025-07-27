import { NotFoundException } from '@nestjs/common';
import { Permission } from '@prisma/client';
import { Permissions } from '@shared/types';
import { DEFAULT_PERMISSIONS } from 'src/entities/user/user.constant';

interface HandlePermissionsProperties {
  permissions?: Permission[];
}

export default function handlePermissions({
  permissions,
}: HandlePermissionsProperties): Permissions {
  if (!permissions) {
    throw new NotFoundException('Permissões não encontradas');
  }

  const permissionsFormatted = structuredClone(DEFAULT_PERMISSIONS);
  for (const permission of permissions) {
    permissionsFormatted[permission.resource][permission.action] = true;
  }

  return permissionsFormatted;
}
