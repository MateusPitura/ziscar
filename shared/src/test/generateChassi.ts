export function generateChassi() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let chassi = "";
  for (let i = 0; i < 17; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    chassi += chars[randomIndex];
  }
  return chassi;
}
