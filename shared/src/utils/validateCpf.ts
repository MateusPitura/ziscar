import { removeMask } from "./removeMask";

export function validateCpf(cpf: string) {
  // Remove non-numeric characters
  const cleanedCPF = removeMask(cpf);

  // Check if the CPF has 11 digits
  if (cleanedCPF.length !== 11) return false;

  // Prevent CPFs with all digits equal (e.g., 111.111.111-11)
  if (/^(\d)\1+$/.test(cleanedCPF)) return false;

  // Validate CPF checksum
  const calcDigit = (factor: number) => {
    let sum = 0;
    for (let i = 0; i < factor - 1; i++) {
      sum += parseInt(cleanedCPF[i]) * (factor - i);
    }
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  const digit1 = calcDigit(10);
  const digit2 = calcDigit(11);

  return (
    digit1 === parseInt(cleanedCPF[9]) && digit2 === parseInt(cleanedCPF[10])
  );
}
