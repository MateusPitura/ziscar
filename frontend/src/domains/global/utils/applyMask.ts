import { Mask } from "../types/Mask";

export function applyMask(
  value: string | undefined,
  mask: Mask
): string | undefined {
  switch (mask) {
    case "CPF":
      return applyCpfMask(value);
    case "CELLPHONE":
      return applyCellphoneMask(value);
    case "CEP":
      return applyCepMask(value);
    default:
      return value;
  }
}

function applyCpfMask(value?: string): string | undefined {
  if (!value) return value;

  const digits = value.replace(/\D/g, "");

  if (digits.length <= 3) {
    return digits;
  } else if (digits.length <= 6) {
    return digits.replace(/(\d{3})(\d{1,3})/, "$1.$2");
  } else if (digits.length <= 9) {
    return digits.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
  } else {
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2}).*/, "$1.$2.$3-$4");
  }
}

function applyCellphoneMask(value?: string): string | undefined {
  if (!value) return value;

  const digits = value.replace(/\D/g, "");

  if (digits.length === 0) {
    return digits;
  } else if (digits.length <= 2) {
    return digits.replace(/^(\d{0,2}).*/, "($1");
  } else if (digits.length <= 7) {
    return digits.replace(/^(\d{2})(\d{0,5}).*/, "($1) $2");
  } else {
    return digits.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
  }
}

function applyCepMask(value?: string): string | undefined {
  const digits = value?.replace(/\D/g, "");

  return digits?.replace(/(\d{5})(\d{1,3}).*/, "$1-$2");
}
