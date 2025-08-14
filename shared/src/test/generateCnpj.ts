import { faker } from "@faker-js/faker";

export function generateCnpj() {
  const n = () => faker.number.int({ min: 0, max: 9 });

  let numbers = Array.from({ length: 12 }, n);

  let calc1 = numbers
    .map((num, i) => num * (i < 4 ? 5 - i : 13 - i))
    .reduce((a, b) => a + b, 0);
  let d1 = calc1 % 11 < 2 ? 0 : 11 - (calc1 % 11);

  let calc2 = [...numbers, d1]
    .map((num, i) => num * (i < 5 ? 6 - i : 14 - i))
    .reduce((a, b) => a + b, 0);
  let d2 = calc2 % 11 < 2 ? 0 : 11 - (calc2 % 11);

  const cnpj = [...numbers, d1, d2].join("");

  return cnpj;
}
