import { Mask } from "../types/mask";

export function removeMask(
  value: string | undefined,
  mask: Mask
): string | undefined {
  if (!value) return value;

  switch (mask) {
    case "CPF":
    case "CELLPHONE":
    case "CEP":
    case "CNPJ":
      return removeNonDigit(value);
    default:
      return value;
  }
}

function removeNonDigit(value: string): string {
  return value.replace(/\D/g, "");
}
