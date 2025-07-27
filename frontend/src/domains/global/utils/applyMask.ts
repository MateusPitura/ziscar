import { Mask } from "../types";

export function applyMask(
  value: string | undefined,
  mask: Mask
): string | undefined {
  if (!value) return value;

  switch (mask) {
    case "cpf":
      return applyCpfMask(value);
    case "phone":
      return applyPhoneMask(value);
    case "cep":
      return applyCepMask(value);
    case "cnpj":
      return applyCnpjMask(value);
    case "money":
      return applyMoneyMask(value);
    default:
      return value;
  }
}

function applyCpfMask(value: string): string {
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

function applyPhoneMask(value: string): string {
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

function applyCepMask(value: string): string {
  const digits = value.replace(/\D/g, "");

  return digits?.replace(/(\d{5})(\d{1,3}).*/, "$1-$2");
}

function applyCnpjMask(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (digits.length <= 2) {
    return digits;
  } else if (digits.length <= 5) {
    return digits.replace(/(\d{2})(\d{1,3})/, "$1.$2");
  } else if (digits.length <= 8) {
    return digits.replace(/(\d{2})(\d{3})(\d{1,3})/, "$1.$2.$3");
  } else if (digits.length <= 12) {
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{1,4})/, "$1.$2.$3/$4");
  } else {
    return digits.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2}).*/,
      "$1.$2.$3/$4-$5"
    );
  }
}

function applyMoneyMask(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 0) {
    return "R$ 0,00";
  }

  const numericValue = parseInt(digits, 10);
  const formattedValue = (numericValue / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `R$ ${formattedValue}`;
}
