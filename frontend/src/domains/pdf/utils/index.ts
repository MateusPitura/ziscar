import { QueryKey } from "@tanstack/react-query";

interface FormatAppliedFiltersProperties {
  queryKey: QueryKey;
  formatFilters: Record<string, string>;
  formatFiltersValues: Partial<Record<string, Record<string, string>>>;
}

export function formatAppliedFilters({
  formatFilters,
  formatFiltersValues,
  queryKey,
}: FormatAppliedFiltersProperties): Record<string, string> {
  const appliedFilters: Record<string, string> = {};
  for (const param of (queryKey[1] as string).split("&")) {
    const [key, value] = param.split("=");
    if (key === "page") continue;
    const formattedKey = formatFilters[key];
    const formattedValue = formatFiltersValues[key];
    if (formattedValue) {
      appliedFilters[formattedKey] = formattedValue[value];
    } else {
      appliedFilters[formattedKey] = value;
    }
  }
  return appliedFilters;
}
