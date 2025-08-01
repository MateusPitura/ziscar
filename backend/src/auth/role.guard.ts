// import {
//   applyDecorators,
//   CanActivate,
//   ExecutionContext,
//   ForbiddenException,
//   Injectable,
//   UseGuards,
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { Role as Role, ROLE_KEY } from './role.decorator';
// import { Action, Resource } from '@shared/types';
// import { AuthRequest } from './auth.type';
// import { formatDeniedMessage } from '@shared/utils/formatDeniedMessage';

// interface Role {
//   resource: Resource;
//   action: Action;
// }

// @Injectable()
// class RoleGuardHandler implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     const { action, resource } = this.reflector.getAllAndOverride<Role>(
//       ROLE_KEY,
//       [context.getHandler()],
//     );

//     const request = context.switchToHttp().getRequest<AuthRequest>();
//     const { permissions } = request.authToken;

//     const hasPermission = permissions[resource][action];

//     if (!hasPermission) {
//       throw new ForbiddenException(formatDeniedMessage({ resource, action }));
//     }

//     return true;
//   }
// }

// export function RoleGuard(resource: Resource, action: Action) {
//   return applyDecorators(Role(resource, action), UseGuards(RoleGuardHandler));
// }
