import { OrganizationCreateInDto } from 'src/organization/organization.dto';
import { UserCreateInDto } from 'src/user/user.dto';

export class AuthSigninInDto {
  email: string;
  password: string;
}

export class AuthSigninOutDto {
  userId: string;
  clientId: number;
}

export type AuthVerifyCreateAccountInDto = Omit<
  Omit<UserCreateInDto, 'roleId' | 'password'> & OrganizationCreateInDto,
  'clientId'
>;

export type AuthVerifyCreateAccountOutDto = AuthVerifyCreateAccountInDto;

export type AuthCreateAccountInDto = Omit<
  Omit<UserCreateInDto, 'roleId'> & OrganizationCreateInDto,
  'clientId'
>;

export type AuthVerifyResetPasswordInDto = Pick<UserCreateInDto, 'email'>;

export type AuthVerifyResetPasswordOutDto = AuthVerifyResetPasswordInDto;

export type AuthResetPasswordInDto = Pick<
  UserCreateInDto,
  'email' | 'password'
>;

export type AuthPasswordInDto = Pick<UserCreateInDto, 'password'>;

export interface AuthRequest extends Request {
  authToken:
    | AuthSigninOutDto
    | AuthVerifyCreateAccountInDto
    | AuthVerifyResetPasswordOutDto;
}
