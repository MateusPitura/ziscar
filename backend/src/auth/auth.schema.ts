import { s } from '@shared/safeZod';

export const SchemaPassword = s.object({
  password: s.password(),
});

export const SchemaResetPasswordInDto = SchemaPassword.extend({
  email: s.email(),
});

export const SchemaAuthSigInInDto = s.object({
  email: s.email(),
  password: s.string(),
});

export const SchemaAuthForgetPasswordInDto = s.object({
  email: s.email(),
});

export const SchemaAuthSignUpInDto = s.object({
  email: s.email(),
  fullName: s.fullName(),
  name: s.string(),
  cnpj: s.cnpj(),
});

export type PasswordInputs = s.infer<typeof SchemaPassword>;
export type AuthSignInInDtoInputs = s.infer<typeof SchemaAuthSigInInDto>;
export type AuthForgetPasswordInDtoInputs = s.infer<
  typeof SchemaAuthForgetPasswordInDto
>;
export type AuthSignUpInDtoInputs = s.infer<typeof SchemaAuthSignUpInDto>;
export type AuthResetPasswordInDtoInputs = s.infer<
  typeof SchemaResetPasswordInDto
>;
