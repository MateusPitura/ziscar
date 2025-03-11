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
import { Action, Resource } from '@shared/types';
import { AuthRequest } from './auth.type';
import { UserService } from 'src/user/user.service';
import { formatDeniedMessage } from '@shared/utils/formatDeniedMessage';

interface Role {
  resource: Resource;
  action: Action;
}

@Injectable()
class RoleGuardHandler implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { action, resource } = this.reflector.getAllAndOverride<Role>(
      ROLE_KEY,
      [context.getHandler()],
    );

    const request = context.switchToHttp().getRequest<AuthRequest>();
    const { userId } = request.authToken;

    const user = await this.userService.findOne({
      where: {
        id: userId,
        role: {
          permissions: {
            some: {
              action,
              resource,
            },
          },
        },
      },
      select: {
        id: true,
      },
      showNotFoundError: false,
    });

    if (!user) {
      throw new ForbiddenException(formatDeniedMessage({ resource, action }));
    }

    return true;
  }
}

export function RoleGuard(resource: Resource, action: Action) {
  return applyDecorators(Role(resource, action), UseGuards(RoleGuardHandler));
}
