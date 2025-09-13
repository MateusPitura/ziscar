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
      appliedFilters[formattedKey] = formatFilterValue(value, key);
    }
  }
  return appliedFilters;
}

function formatFilterValue(value: string, key: string): string {
  if (
    key.toLowerCase().includes("price") ||
    key.toLowerCase().includes("value")
  ) {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      return `R$ ${(numValue / 100).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
  }

  if (key.toLowerCase().includes("date")) {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString("pt-BR");
    }
  }

  return value;
}

export function isNumericColumn(columnKey: string): boolean {
  const monetaryPatterns = [
    /price/i,
    /value/i,
    /amount/i,
    /cost/i,
    /total/i,
    /^r\$/i,
  ];

  return monetaryPatterns.some((pattern) => pattern.test(columnKey));
}
