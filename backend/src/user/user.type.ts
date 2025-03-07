import { Permission } from '@prisma/client';

export interface Role {
  permissions?: Permission[];
}
