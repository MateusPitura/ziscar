import { z } from "zod";
import { validateCpf } from "../utils/validateCpf";

// BASE SCHEMAS

export const object = z.object;

export type infer<T extends z.ZodTypeAny> = z.infer<T>;

// string signatures
export function string(
  maxChars?: "default" | number,
  required?: "required"
): z.ZodString;
export function string(
  maxChars?: "default" | number,
  required?: "optional"
): z.ZodOptional<z.ZodString>;

// string implementation
export function string(
  maxChars: "default" | number = "default",
  required: "required" | "optional" = "required"
) {
  let maxCharsAux = 128;
  if (typeof maxChars === "number") {
    maxCharsAux = maxChars;
  }

  if (required === "required") {
    return z
      .string()
      .max(maxCharsAux, { message: `Máximo de ${maxCharsAux} caracteres` })
      .nonempty({ message: "Campo obrigatório" }) as z.ZodString;
  }
  return z
    .string()
    .max(maxCharsAux, { message: `Máximo de ${maxCharsAux} caracteres` })
    .optional() as z.ZodOptional<z.ZodString>;
}

export const date = () =>
  z.coerce.date({
    errorMap: (issue, { defaultError }) => ({
      message: issue.code === "invalid_date" ? "Data inválida" : defaultError,
    }),
  });

// SCHEMAS ITSELF

export const email = () => string().email({ message: "Email inválido" });

export const password = () =>
  string()
    .min(11, { message: "Ao menos 11 caracteres" })
    .regex(/[a-z]/, { message: "Ao menos uma letra minúscula" })
    .regex(/[A-Z]/, { message: "Ao menos uma letra maiúscula" })
    .regex(/\d/, { message: "Ao menos um número" })
    .regex(/[@$!%*?&]/, {
      message: "Ao menos um caractere especial",
    });

export const passwordSchema = object({
  newPassword: password(),
  confirmPassword: string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não são iguais",
  path: ["confirmPassword"],
});

export const fullName = () =>
  string().regex(/^[a-zA-Z\s]+$/, {
    message: "Nome completo inválido",
  });

export const cep = () => string(9).regex(/^\d{5}-?\d{3}$/, "CEP inválido");

export const addressSchema = () =>
  object({
    cep: cep(),
    street: string("default", "optional"),
    number: string(),
    neighborhood: string("default", "optional"),
    city: string("default", "optional"),
    state: string("default", "optional"),
    complement: string("default", "optional"),
  });

export const birthDate = () =>
  date()
    .min(new Date("1900-01-01"), { message: "Data de nascimento inválida" })
    .max(new Date(), { message: "Data de nascimento inválida" });

export const cpf = () =>
  string(14).refine((cpf) => validateCpf(cpf), { message: "CPF inválido" });

export const cellphone = () =>
  string(15).regex(/^\(?\d{2}\)?\s?\d{5}-\d{4}$/, "Celular inválido");
