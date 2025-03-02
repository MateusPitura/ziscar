import { OrganizationCreateInDto } from '../organization/organization.dto';
import { UserCreateInDto, UserPasswordInDto } from '../user/user.dto';

export type AuthSigninInDto = Pick<UserCreateInDto, 'email'> &
  UserPasswordInDto;

export class AuthSigninOutDto {
  userId: string;
  clientId: number;
}

export type AuthCreateAccountInDto = Omit<
  Pick<UserCreateInDto, 'email' | 'fullName'> & OrganizationCreateInDto,
  'clientId'
>;

export type AuthVerifyResetPasswordInDto = Pick<UserCreateInDto, 'email'>;

export type AuthVerifyResetPasswordOutDto = AuthVerifyResetPasswordInDto;

export type AuthResetPasswordInDto = AuthSigninInDto;

export interface AuthRequest extends Request {
  authToken: AuthSigninOutDto | AuthVerifyResetPasswordOutDto;
}
