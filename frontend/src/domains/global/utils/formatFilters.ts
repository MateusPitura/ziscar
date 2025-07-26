type FormatFiltersProps = Record<
  string,
  string | string[] | undefined | number | boolean
>;

export default function formatFilters(value: object): string {
  const data = value as FormatFiltersProps;
  const filters = [];

  for (const key in data) {
    if (data[key]) {
      if (Array.isArray(data[key]) && data[key].length) {
        filters.push(`${key}=${data[key].join(",")}`);
      } else {
        filters.push(`${key}=${data[key]}`);
      }
    }
  }

  const filterFormatted = filters.join("&");

  return filterFormatted;
}
