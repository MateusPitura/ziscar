import { z } from "zod";
import { validateCpf } from "../utils/validateCpf";
import { validateCnpj } from "../utils/validateCnpj";
import { removeMask } from "../utils/removeMask";

export type infer<T extends z.ZodTypeAny> = z.infer<T>;

export const radio = z.enum;

export function checkbox<T extends string>(values: readonly T[]) {
  return z.array(z.enum(values as [T, ...T[]]));
}

export const array = <T extends z.ZodTypeAny>(schema: T, maxItems?: number) => {
  const arraySchema = z.array(schema);
  return maxItems
    ? arraySchema.max(maxItems, {
        message: `Limite de ${maxItems} excedido`,
      })
    : arraySchema;
};

export const boolean = z.boolean;

export const object = <T extends z.ZodRawShape>(shape: T) =>
  z.object(shape).strict();

export const empty = () => z.literal("");

export function string(maxChars: number = 128) {
  return z
    .string({ required_error: "Campo obrigatório" })
    .max(maxChars, { message: `Máximo de ${maxChars} caracteres` })
    .nonempty({ message: "Campo obrigatório" });
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
  string().regex(/^[^0-9]+$/, {
    message: "Nome completo inválido",
  });

export const cep = () =>
  string(9)
    .transform((cep) => removeMask(cep))
    .refine((cep) => /^\d{8}$/.test(cep), "CEP inválido");

export const birthDate = () =>
  date()
    .min(new Date("1900-01-01"), { message: "Data de nascimento inválida" })
    .max(new Date(), { message: "Data de nascimento inválida" })
    .transform((date) => date.toISOString().split("T")[0]);

export const cpf = () =>
  string(14)
    .transform((cpf) => removeMask(cpf))
    .refine((cpf) => validateCpf(cpf), { message: "CPF inválido" });

export const cnpj = () =>
  string(18)
    .transform((cnpj) => removeMask(cnpj))
    .refine((cnpj) => validateCnpj(cnpj), { message: "CNPJ inválido" });

export const cellphone = () =>
  string(15)
    .transform((cellphone) => removeMask(cellphone))
    .refine((cep) => /^\d{11}$/.test(cep), "Celular inválido");

export const password = () =>
  string()
    .min(11, { message: "Ao menos 11 caracteres" })
    .regex(/[a-z]/, { message: "Ao menos uma letra minúscula" })
    .regex(/[A-Z]/, { message: "Ao menos uma letra maiúscula" })
    .regex(/\d/, { message: "Ao menos um número" })
    .regex(/[@$!%*?&]/, {
      message: "Ao menos um caractere especial",
    });

export const color = () =>
  string(7).regex(/^#[0-9A-Fa-f]{6}$/, { message: "Cor inválida" });

export const money = () =>
  string()
    .transform((money) => money.replace(/\D/g, ""))
    .refine((money) => parseInt(money, 10) > 0, {
      message: "Valor monetário inválido",
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
});
