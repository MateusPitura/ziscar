import { useMemo, type ReactElement } from "react";
import { FieldValues, Path, PathValue } from "react-hook-form";
import Select from "./Select";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys, UnwrapArray } from "@/domains/global/types";
import { useDebounce } from "@/domains/global/hooks/useDebounce";
import Button from "../Button";

interface SearchProperties<T, K extends Record<string, unknown>[]> {
  fetchCallback: (search?: string) => Promise<K>;
  name: Path<T>;
  label: string;
  queryKey: QueryKeys;
  onChange?: (selectedData?: UnwrapArray<K>) => void;
  required?: boolean;
  valueKey: keyof UnwrapArray<K>;
  labelKey: keyof UnwrapArray<K>;
  descriptionKey?: keyof UnwrapArray<K>;
  onClickNotFound?: (_: string) => void;
  select?: (item: K) => K;
  formatSearch: (search: string) => string | undefined;
  formatNotFound?: (search: string) => string;
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
  required,
  labelKey,
  valueKey,
  descriptionKey,
  select,
  onClickNotFound,
  formatSearch,
  formatNotFound,
}: SearchProperties<T, K>): ReactElement {
  const { value, setValue } = useDebounce();

  const { data, isLoading } = useQuery({
    queryKey: [queryKey, value],
    queryFn: ({ queryKey }) => fetchCallback(queryKey[1] as string),
    select,
  });

  const dataFormatted = useMemo(() => {
    if (!data) return [];

    return data?.map((item) => ({
      label: String(item[labelKey as string]),
      value: String(item[valueKey as string]) as UnwrapArray<
        PathValue<T, Path<T>>
      >,
      description: String(item[descriptionKey as string]),
    }));
  }, [data, labelKey, valueKey, descriptionKey]);

  const formattedNotFound = useMemo(() => {
    if (formatNotFound) {
      return formatNotFound(value);
    }
  }, [value]);

  return (
    <Select
      name={name}
      onSearchChange={(value) => {
        const formattedValue = formatSearch(value);
        if (!formattedValue) return;
        setValue(formattedValue);
      }}
      label={label}
      options={dataFormatted}
      shouldFilter={false}
      loading={isLoading}
      required={required}
      onChange={(selectedValue) => {
        const selectedItem = data?.find(
          (item) => String(item[valueKey as string]) === selectedValue
        ) as UnwrapArray<K> | undefined;

        onChange?.(selectedItem);
      }}
      notFound={
        formattedNotFound &&
        onClickNotFound && (
          <Button
            label={`Cadastrar "${formattedNotFound}"`}
            variant="quaternary"
            onClick={() => onClickNotFound(formattedNotFound)}
          />
        )
      }
    />
  );
}
