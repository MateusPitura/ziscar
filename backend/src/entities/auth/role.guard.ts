import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role as Role, ROLE_KEY } from './role.decorator';
import { AuthRequest } from './auth.type';
import { formatDeniedMessage } from '@shared/utils/formatDeniedMessage';
import { Actions, Resources } from '@prisma/client';
import {
  Actions as SharedActions,
  Resources as SharedResources,
} from '@shared/enums';

interface Role {
  resource: Resources;
  action: Actions;
}

@Injectable()
class RoleGuardHandler implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const { action, resource } = this.reflector.getAllAndOverride<Role>(
      ROLE_KEY,
      [context.getHandler()],
    );

    const request = context.switchToHttp().getRequest<AuthRequest>();
    const { permissions } = request.authToken;

    const hasPermission = permissions[resource][action];

    if (!hasPermission) {
      throw new ForbiddenException(
        formatDeniedMessage({
          resource: resource as SharedResources,
          action: action as SharedActions,
        }),
      );
    }

    return true;
  }
}

export function RoleGuard(resource: Resources, action: Actions) {
  return applyDecorators(Role(resource, action), UseGuards(RoleGuardHandler));
}
