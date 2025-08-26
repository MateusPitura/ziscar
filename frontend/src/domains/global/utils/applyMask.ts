import { Mask } from "../types";

export function applyMask(
  value: string | number | undefined,
  mask: Mask
): string | undefined {
  const valueString = String(value);

  if (!valueString) return valueString;

  switch (mask) {
    case "cpf":
      return applyCpfMask(valueString);
    case "phone":
      return applyPhoneMask(valueString);
    case "cep":
      return applyCepMask(valueString);
    case "cnpj":
      return applyCnpjMask(valueString);
    case "money":
      return applyMoneyMask(valueString);
    case "plateNumber":
      return applyPlateNumberMask(valueString);
    case "chassi":
      return applyChassiMask(valueString);
    case "number":
      return applyNumberMask(valueString);
    default:
      return valueString;
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

function applyPlateNumberMask(value: string): string {
  const chars = value.replace(/[^A-Z0-9]/gi, "").toUpperCase();

  if (/^[A-Z]{0,3}\d{0,4}$/.test(chars)) {
    if (chars.length <= 3) {
      return chars;
    } else {
      return chars.slice(0, 3) + "-" + chars.slice(3, 7);
    }
  }

  if (/^[A-Z]{0,3}\d{0,1}[A-Z]{0,1}\d{0,2}$/.test(chars)) {
    let masked = "";
    if (chars.length <= 3) {
      masked = chars;
    } else if (chars.length <= 4) {
      masked = chars.slice(0, 3) + chars.slice(3);
    } else if (chars.length <= 5) {
      masked = chars.slice(0, 3) + chars.slice(3, 4) + chars.slice(4);
    } else if (chars.length <= 7) {
      masked = chars.slice(0, 3) + chars.slice(3, 4) + chars.slice(4);
    }
    return masked;
  }

  return chars;
}

function applyChassiMask(value: string): string {
  const chars = value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, "");

  return chars.slice(0, 17);
}

function applyNumberMask(value: string): string {
  let digits = value.replace(/\D/g, "");
  if (digits.length > 1) {
    digits = digits.replace(/^0+/, "");
    if (digits === "") digits = "0";
  }
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
