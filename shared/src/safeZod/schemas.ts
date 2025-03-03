import { z } from "zod";
import { validateCpf } from "../utils/validateCpf";
import { validateCnpj } from "../utils/validateCnpj";

export type infer<T extends z.ZodTypeAny> = z.infer<T>;

export const object = <T extends z.ZodRawShape>(shape: T) =>
  z.object(shape).strict();
export const list = z.enum;
export const boolean = z.boolean;

export function string(maxChars: number = 128) {
  return z
    .string({ required_error: "Campo obrigatório" })
    .max(maxChars, { message: `Máximo de ${maxChars} caracteres` });
}

export const number = () =>
  z.coerce
    .number({
      required_error: "Campo obrigatório",
      message: "Número inválido",
    })
    .int({ message: "Número inválido" })
    .positive({ message: "Número inválido" });

export const date = () =>
  z.coerce.date({
    errorMap: (issue, { defaultError }) => ({
      message: issue.code === "invalid_date" ? "Data inválida" : defaultError,
    }),
  });

export const id = () => number();

export const email = () => string().email({ message: "Email inválido" });

export const fullName = () =>
  string().regex(/^[a-zA-Z\s]+$/, {
    message: "Nome completo inválido",
  });

export const cep = () => string(9).regex(/^\d{5}-?\d{3}$/, "CEP inválido");

export const birthDate = () =>
  date()
    .min(new Date("1900-01-01"), { message: "Data de nascimento inválida" })
    .max(new Date(), { message: "Data de nascimento inválida" });

export const cpf = () =>
  string(14).refine((cpf) => validateCpf(cpf), { message: "CPF inválido" });

export const cnpj = () =>
  string(18).refine((cnpj) => validateCnpj(cnpj), { message: "CNPJ inválido" });

export const cellphone = () =>
  string(15).regex(/^\(?\d{2}\)?\s?\d{5}-\d{4}$/, "Celular inválido");

export const password = () =>
  string()
    .min(11, { message: "Ao menos 11 caracteres" })
    .regex(/[a-z]/, { message: "Ao menos uma letra minúscula" })
    .regex(/[A-Z]/, { message: "Ao menos uma letra maiúscula" })
    .regex(/\d/, { message: "Ao menos um número" })
    .regex(/[@$!%*?&]/, {
      message: "Ao menos um caractere especial",
    });

export const SchemaPassword = object({
  newPassword: password(),
  confirmPassword: string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não são iguais",
  path: ["confirmPassword"],
});

export const SchemaAddress = object({
  cep: cep(),
  number: string(),
  street: string().optional(),
  neighborhood: string().optional(),
  city: string().optional(),
  state: string().optional(),
  complement: string().optional(),
});
