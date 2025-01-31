import { Mask } from "../types/mask";

export function removeMask(
  value: string | undefined,
  mask: Mask
): string | undefined {
  if (!value) return value;

  switch (mask) {
    case "CPF":
      return removeCpfMask(value);
    case "CELLPHONE":
      return removeCellphoneMask(value);
    case "CEP":
      return removeCepMask(value);
    default:
      return value;
  }
}

function removeCpfMask(value: string): string {
  return value.replace(/\D/g, '');
}

function removeCellphoneMask(value: string): string {
  return value.replace(/\D/g, '');
}

function removeCepMask(value: string): string {
  return value.replace(/\D/g, '');
}