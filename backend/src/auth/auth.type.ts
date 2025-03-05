export interface AuthSignin {
  userId: number;
  clientId: number;
}

export interface AuthResetPassword {
  email: string;
}

export interface AuthRequest extends Request {
  authToken: AuthSignin;
}

export interface AuthRequestBodyToken extends Request {
  authToken: AuthResetPassword;
}
