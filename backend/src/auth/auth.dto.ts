import { OrganizationCreateInDto } from 'src/organization/organization.dto';
import { UserCreateInDto } from 'src/user/user.dto';

export class AuthSigninInDto {
  email: string;
  password: string;
}

export class AuthSigninOutDto {
  userId: string;
  clinicId: string;
}

export type AuthVerifyAccountInDto = Omit<
  UserCreateInDto,
  'clientId' | 'roleId' | 'password'
> &
  OrganizationCreateInDto;

export type AuthVerifyAccountOutDto = AuthVerifyAccountInDto;

export type AuthSignupInDto = Omit<
  Omit<UserCreateInDto, 'roleId'> & OrganizationCreateInDto,
  'clientId'
>;

export interface AuthRequest extends Request {
  authToken: AuthSigninOutDto | AuthVerifyAccountInDto;
}
