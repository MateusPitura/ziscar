import { Mask } from "../types";

export function removeMask(
  value: string | undefined,
  mask: Mask
): string | undefined {
  if (!value) return value;

  switch (mask) {
    case "cpf":
    case "cellphone":
    case "cep":
    case "cnpj":
      return removeNonDigit(value);
    default:
      return value;
  }
}

function removeNonDigit(value: string): string {
  return value.replace(/\D/g, "");
}
