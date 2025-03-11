import { Request, Response } from 'express';
import {
  AuthForgetPasswordInDto,
  AuthResetPasswordInDto,
  AuthSignInInDto,
  AuthSignUpInDto,
} from './auth.schema';

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

export interface SiginInInput {
  authSignInInDto: AuthSignInInDto;
  res?: Response;
}

export interface SignOutInput {
  res?: Response;
}

export interface SignUpInput {
  authSignUpInDto: AuthSignUpInDto;
}

export interface ResetPasswordInput {
  authResetPasswordInDto: AuthResetPasswordInDto;
}

export interface ForgetPasswordInput {
  authForgetPasswordInDto: AuthForgetPasswordInDto;
}
