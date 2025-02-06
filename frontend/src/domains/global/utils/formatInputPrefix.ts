export default function formatInputPrefix(
  name: string,
  prefix?: string
): string {
  if (prefix) {
    return `${prefix}.${name}`;
  }
  return name;
}
