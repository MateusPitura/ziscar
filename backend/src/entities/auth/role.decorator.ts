import { SetMetadata } from '@nestjs/common';
import { Actions, Resources } from '@prisma/client';

export const ROLE_KEY = 'roles';

export const Role = (resource: Resources, action: Actions) =>
  SetMetadata(ROLE_KEY, { resource, action });
