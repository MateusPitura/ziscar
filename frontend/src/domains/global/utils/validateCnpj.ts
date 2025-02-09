function calcDigit(cnpj: string, weight: number[]) {
  let sum = 0;
  for (let i = 0; i < weight.length; i++) {
    sum += Number(cnpj[i]) * weight[i];
  }
  const rest = sum % 11;
  return rest < 2 ? 0 : 11 - rest;
}

export function validateCnpj(cnpj: string) {
  const cleanedCNPJ = cnpj.replace(/\D/g, "");

  if (cleanedCNPJ.length !== 14 || /^(\d)\1+$/.test(cleanedCNPJ)) return false;

  const firstCnpjWeights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const secondCnpjWeights = [6, ...firstCnpjWeights];

  const firstCnpjDigit = calcDigit(cleanedCNPJ, firstCnpjWeights);
  const secondCnpjDigit = calcDigit(
    cleanedCNPJ + firstCnpjDigit,
    secondCnpjWeights
  );

  return cleanedCNPJ.endsWith(
    firstCnpjDigit.toString() + secondCnpjDigit.toString()
  );
}
