export interface AuthSigninOutDto {
  userId: number;
  clientId: number;
}

export interface AuthResetPasswordOutDto {
  email: string;
}

export interface AuthRequest extends Request {
  authToken: AuthSigninOutDto | AuthResetPasswordOutDto;
}
