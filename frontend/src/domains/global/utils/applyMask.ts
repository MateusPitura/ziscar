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

  // Remove any non-digit characters
  const digits = value.replace(/\D/g, "");

  // Apply the partial mask based on the length of the input
  if (digits.length <= 3) {
    return digits; // Just return the digits if they are 3 or fewer
  } else if (digits.length <= 6) {
    return digits.replace(/(\d{3})(\d{1,3})/, "$1.$2");
  } else if (digits.length <= 9) {
    return digits.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
  } else {
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
  }
}

function applyCellphoneMask(value?: string): string | undefined {
  // Remove any non-digit characters
  const digits = value?.replace(/\D/g, "");
  // Format the cellphone number ((##) #####-####)
  return digits?.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
}

function applyCepMask(value?: string): string | undefined {
  // Remove any non-digit characters
  const digits = value?.replace(/\D/g, "");
  // Format the CEP (#####-###)
  return digits?.replace(/(\d{5})(\d)/, "$1-$2");
}
