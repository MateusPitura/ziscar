import { OrganizationCreateInDto } from 'src/organization/organization.dto';
import { UserCreateInDto } from 'src/user/user.dto';

export class AuthSigninInDto {
  email: string;
  password: string;
}

export class AuthSigninOutDto {
  token: string;
}

export type AuthSignupInDto = Omit<UserCreateInDto, 'clientId' | 'roleId'> &
  OrganizationCreateInDto;
