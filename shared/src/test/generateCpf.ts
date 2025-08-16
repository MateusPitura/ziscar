export function generateCpf() {
  const n = () => Math.floor(Math.random() * 10);

  let numbers = Array.from({ length: 9 }, n);

  let calc1 = numbers
    .map((num, i) => num * (10 - i))
    .reduce((a, b) => a + b, 0);
  let d1 = calc1 % 11 < 2 ? 0 : 11 - (calc1 % 11);

  let calc2 = [...numbers, d1]
    .map((num, i) => num * (11 - i))
    .reduce((a, b) => a + b, 0);
  let d2 = calc2 % 11 < 2 ? 0 : 11 - (calc2 % 11);

  const cpf = [...numbers, d1, d2].join("");

  return cpf;
}
