// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { Request } from 'express';
// import { UNAUTHORIZED, JWT_COOKIE_NAME } from '@shared/constants';
// import {
//   AuthResetPassword,
//   AuthSignin,
//   CustomizeValidationProperties,
// } from './auth.type';
// import { UserService } from 'src/entities/user/user.service';

// @Injectable()
// abstract class BaseAuthGuard implements CanActivate {
//   constructor(
//     private readonly jwtService: JwtService,
//     private readonly userService: UserService,
//   ) {}

//   abstract getToken(request: Request): string | undefined;
//   abstract customizeValidation(): CustomizeValidationProperties;

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest<Request>();

//     try {
//       const token = this.getToken(request);

//       if (!token) {
//         throw new UnauthorizedException(UNAUTHORIZED);
//       }

//       const customValidation = this.customizeValidation();

//       const payload = await this.jwtService.verifyAsync<
//         AuthSignin | AuthResetPassword
//       >(token, {
//         secret: process.env.JWT_SECRET,
//         ignoreExpiration: customValidation.shouldValidateExpirationTime,
//       });

//       if (customValidation.shouldValidateJit) {
//         const { enterpriseId, userId, jit } = payload as AuthSignin;

//         const user = await this.userService.findOne({
//           select: {
//             jit: true,
//           },
//           where: {
//             id: userId,
//           },
//           enterpriseId,
//         });

//         if (jit !== user?.jit) {
//           throw new UnauthorizedException(UNAUTHORIZED);
//         }
//       }

//       request['authToken'] = payload;
//     } catch {
//       throw new UnauthorizedException(UNAUTHORIZED);
//     }

//     return true;
//   }
// }

// @Injectable()
// export class AuthGuard extends BaseAuthGuard {
//   getToken(request: Request): string | undefined {
//     return request.cookies[JWT_COOKIE_NAME] as string;
//   }
//   customizeValidation(): CustomizeValidationProperties {
//     return {
//       shouldValidateJit: true,
//       shouldValidateExpirationTime: true,
//     };
//   }
// }

// @Injectable()
// export class AuthGuardSignOut extends BaseAuthGuard {
//   getToken(request: Request): string | undefined {
//     return request.cookies[JWT_COOKIE_NAME] as string;
//   }
//   customizeValidation(): CustomizeValidationProperties {
//     return {
//       shouldValidateJit: false,
//       shouldValidateExpirationTime: false,
//     };
//   }
// }

// @Injectable()
// export class AuthGuardResetPassword extends BaseAuthGuard {
//   getToken(request: Request): string | undefined {
//     const body = request.body as Record<string, string | undefined>;
//     const token = body?.token;
//     if (token) {
//       delete body.token;
//     }
//     return token;
//   }
//   customizeValidation(): CustomizeValidationProperties {
//     return {
//       shouldValidateJit: false,
//       shouldValidateExpirationTime: true,
//     };
//   }
// }
