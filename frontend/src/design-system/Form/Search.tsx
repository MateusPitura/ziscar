import { useMemo, type ReactElement } from "react";
import { FieldValues, Path } from "react-hook-form";
import Select from "./Select";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys, UnwrapArray } from "@/domains/global/types";
import { useDebounce } from "@/domains/global/hooks/useDebounce";

interface SearchProperties<T, K extends Record<string, unknown>[]> {
  fetchCallback: (search?: string) => Promise<K>;
  name: Path<T>;
  label: string;
  queryKey: QueryKeys;
  onChange?: (selectedData?: UnwrapArray<K>) => void;
  valueKey: keyof UnwrapArray<K>;
  labelKey: keyof UnwrapArray<K>;
}

export default function Search<
  T extends FieldValues,
  K extends Record<string, unknown>[]
>({
  fetchCallback,
  name,
  label,
  queryKey,
  onChange,
  labelKey,
  valueKey,
}: SearchProperties<T, K>): ReactElement {
  const { value, setValue } = useDebounce();

  const { data, isLoading } = useQuery({
    queryKey: [queryKey, value],
    queryFn: ({ queryKey }) => fetchCallback(queryKey[1] as string),
  });

  const dataFormatted = useMemo(() => {
    if (!data) return [];

    return data?.map((item) => ({
      label: String(item[labelKey as string]),
      value: String(item[valueKey as string]),
    }));
  }, [data, labelKey, valueKey]);

  return (
    <Select
      name={name}
      onSearchChange={setValue}
      label={label}
      options={dataFormatted}
      shouldFilter={false}
      loading={isLoading}
      onChange={(selectedValue) => {
        const selectedData = data?.find(
          (item) => String(item[valueKey as string]) === selectedValue
        ) as UnwrapArray<K> | undefined;

        onChange?.(selectedData);
      }}
    />
  );
}
