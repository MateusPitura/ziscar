export function generatePlateNumber(mask: boolean = false) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";

  const pick = (source: string, length: number) =>
    Array.from(
      { length },
      () => source[Math.floor(Math.random() * source.length)]
    ).join("");

  if (Math.random() < 0.5) {
    return [pick(letters, 3), pick(digits, 4)].join(mask ? "-" : "");
  } else {
    return `${pick(letters, 3)}${pick(digits, 1)}${pick(letters, 1)}${pick(
      digits,
      2
    )}`;
  }
}
