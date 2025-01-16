export function applyMask(
  value: string | undefined,
  mask: "CELLPHONE" | "CPF"
): string | undefined {
  switch (mask) {
    case "CPF":
      return applyCpfMask(value);
    case "CELLPHONE":
      return applyCellphoneMask(value);
    default:
      return value;
  }
}

function applyCpfMask(value?: string): string | undefined {
  // Remove any non-digit characters
  const digits = value?.replace(/\D/g, "");
  // Format the CPF (###.###.###-##)
  return digits?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function applyCellphoneMask(value?: string): string | undefined {
  // Remove any non-digit characters
  const digits = value?.replace(/\D/g, "");
  // Format the cellphone number ((##) #####-####)
  return digits?.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
}
