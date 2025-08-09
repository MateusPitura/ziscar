import Button from "@/design-system/Button";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { PageablePayload } from "@/domains/global/types";
import { pdf } from "@react-pdf/renderer";
import { ITEMS_PER_PAGE } from "@shared/constants";
import { Resource } from "@shared/types";
import { QueryKey, useIsFetching, useQueryClient } from "@tanstack/react-query";
import { type ReactElement } from "react";
import Report from "./Report";
import safeFormat from "@/domains/global/utils/safeFormat";
import { FieldValues, Path, PathValue } from "react-hook-form";
import { formatAppliedFilters } from "../utils";

type ExportButtonProperties<T, U extends FieldValues> = {
  [K in Path<U>]: {
    fileName: string;
    resource: Resource;
    queryKey: QueryKey;
    queryFn: (filter?: string) => Promise<PageablePayload<T>>;
    formatColumns: Partial<Record<keyof T, string>>;
    formatFilters: Record<Path<U>, string>;
    formatFiltersValues: Partial<Record<K, Record<PathValue<U, K>, string>>>;
  };
}[Path<U>];

export default function ExportButton<T, U extends FieldValues>({
  fileName,
  resource,
  queryKey,
  queryFn: customQueryFn,
  formatColumns,
  formatFilters,
  formatFiltersValues,
}: ExportButtonProperties<T, U>): ReactElement {
  const queryClient = useQueryClient();
  const { showErrorSnackbar, showSuccessSnackbar } = useSnackbar();
  const isFetching = useIsFetching({ queryKey: [queryKey[0]] });

  async function fetchAll() {
    if (!queryKey) throw new Error();

    const cachedData = queryClient.getQueryData<PageablePayload<T>>(queryKey);

    if (!cachedData) throw new Error();

    const totalPages = Math.ceil(cachedData?.total / ITEMS_PER_PAGE);

    const fetchPromises = [];
    for (let i = 1; i <= totalPages; i++) {
      const filter = queryKey[1] as string;
      const regex = /page=\d+/;
      const filterFormatted = filter?.replace(regex, `page=${i}`);

      fetchPromises.push(
        queryClient.fetchQuery({
          queryKey: [queryKey[0], filterFormatted],
          queryFn: ({ queryKey }) => customQueryFn(queryKey[1]),
        })
      );
    }

    const results = await Promise.all(fetchPromises);
    return results.flatMap((result) => result.data);
  }

  return (
    <Button
      variant="primary"
      color="darkBlue"
      label="Gerar relatório PDF"
      iconRight="FileDownload"
      state={isFetching ? "loading" : undefined}
      resource={resource}
      action="READ"
      data-cy="export-button"
      onClick={async () => {
        showSuccessSnackbar({
          title: "O PDF está sendo gerado",
          actionBtnAction: "READ",
          actionBtnResource: resource,
        });

        try {
          const itemsFlat = await fetchAll();

          const appliedFilters = formatAppliedFilters({
            queryKey,
            formatFilters,
            formatFiltersValues,
          });

          const blob = await pdf(
            <Report
              data={itemsFlat}
              formatColumns={formatColumns}
              title={fileName}
              appliedFilters={appliedFilters}
            />
          ).toBlob();

          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;

          const fileNameFormatted = `${fileName} ${safeFormat({
            date: new Date(),
            format: "dd-MM-yyyy",
          })} ${safeFormat({
            date: new Date(),
            format: "HH-mm",
          })}.pdf`;

          link.download = fileNameFormatted;
          link.click();
          URL.revokeObjectURL(url);
        } catch {
          showErrorSnackbar({
            description: "Ocorreu um erro ao gerar o PDF",
          });
        }
      }}
    />
  );
}
