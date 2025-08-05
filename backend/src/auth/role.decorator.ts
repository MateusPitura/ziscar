import { SetMetadata } from '@nestjs/common';
import { Resource, Action } from '@shared/types';

export const ROLE_KEY = 'roles';

export const Role = (resource: Resource, action: Action) =>
  SetMetadata(ROLE_KEY, { resource, action });
