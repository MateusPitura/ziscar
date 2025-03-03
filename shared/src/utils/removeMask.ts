export function removeMask(value: string): string {
  return value.replace(/\D/g, "");
}
