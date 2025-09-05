import Table from "@/design-system/Table";
import ExportButton from "@/domains/pdf/components/ExportButton";
import { useMemo, useState, type ReactNode } from "react";
import { DisableStore, StoresFilterFormInputs } from "../types";
import useDialog from "@/domains/global/hooks/useDialog";
import DisableStoreModal from "./DisableStoreModal";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import formatFilters from "@/domains/global/utils/formatFilters";
import { PageablePayload } from "@/domains/global/types";
import { useQuery } from "@tanstack/react-query";
import { FetchStore } from "@/domains/global/types/model";
import selectStoresInfo from "../utils/selectStoresInfo";
import StoresTableActions from "./StoresTableActions";
import StoresFilterForm from "../forms/StoresFilterForm";
import useFilterContext from "@/domains/global/hooks/useFilterContext";
import { BACKEND_URL } from "@/domains/global/constants";
import selectStoresInfoForReport from "../utils/selectStoresInfoForReport";
import { STORES_TABLE } from "../constants";

const enableReport = false;

export default function StoresTable(): ReactNode {
  const [disableStoreInfo, setDisableStoreInfo] = useState<DisableStore>({
    storeName: "",
    storeId: "",
  });

  const dialog = useDialog();
  const { safeFetch } = useSafeFetch();
  const { storesFilter, handleStoresFilter } = useFilterContext();

  function handleDisableStoreInfo(store: DisableStore) {
    dialog.openDialog();
    setDisableStoreInfo(store);
  }

  function handleChangePage(page: number) {
    handleStoresFilter({ page });
  }

  const filterFormatted = useMemo(() => {
    if (storesFilter) {
      return formatFilters(storesFilter);
    }
    return "";
  }, [storesFilter]);

  async function getStoresInfo(
    filter?: string
  ): Promise<PageablePayload<FetchStore>> {
    return await safeFetch(`${BACKEND_URL}/store?${filter}&orderBy=name`, {
      resource: "STORES",
      action: "READ",
    });
  }

  const { data: storesInfo, isFetching: isFetchingStoresInfo } = useQuery({
    queryKey: ["stores", filterFormatted],
    queryFn: ({ queryKey }) => getStoresInfo(queryKey[1]),
    select: selectStoresInfo,
  });

  return (
    <>
      <DisableStoreModal {...disableStoreInfo} {...dialog} />
      <div className="flex gap-4 justify-end">
        {enableReport && (
          <ExportButton<FetchStore, StoresFilterFormInputs>
            fileName="Relatório Lojas"
            queryKey={["stores", filterFormatted]}
            queryFn={getStoresInfo}
            selectQueryFn={selectStoresInfoForReport}
            formatFilters={{
              name: "Nome completo",
              status: "Status",
              endDate: "Data final",
              startDate: "Data inicial",
            }}
            formatFiltersValues={{
              status: {
                active: "Ativo",
                inactive: "Inativo",
              },
            }}
            formatColumns={{
              cnpj: "CNPJ",
              name: "Nome",
              email: "Email",
              phone: "Celular",
              archivedAt: "Ativo",
            }}
          />
        )}
        <Table.Filter form={<StoresFilterForm />} />
      </div>
      <Table>
        <Table.Header>
          <Table.Head label={STORES_TABLE.name.label} />
          <Table.Head label={STORES_TABLE.cnpj.label} />
          <Table.Head label={STORES_TABLE.email.label} />
          <Table.Head label={STORES_TABLE.phone.label} />
          <Table.Head label={STORES_TABLE.status.label} />
          <Table.Head action />
        </Table.Header>
        <Table.Body
          isLoading={isFetchingStoresInfo}
          isEmpty={!storesInfo?.total}
          resource="STORES"
          action="READ"
        >
          {storesInfo?.data.map((store) => (
            <Table.Row key={store.id}>
              <Table.Cell
                label={store.name}
                columnLabel={STORES_TABLE.name.label}
              />
              <Table.Cell
                label={store.cnpj}
                columnLabel={STORES_TABLE.cnpj.label}
              />
              <Table.Cell
                label={store.email}
                columnLabel={STORES_TABLE.email.label}
              />
              <Table.Cell
                label={store.phone}
                columnLabel={STORES_TABLE.phone.label}
              />
              <Table.Cell
                label={store.archivedAt ? "Inativo" : "Ativo"}
                columnLabel={STORES_TABLE.status.label}
              />
              <Table.Action>
                <StoresTableActions
                  isActive={!store.archivedAt}
                  storeId={String(store.id)}
                  name={store.name}
                  handleDisableStoreInfo={handleDisableStoreInfo}
                />
              </Table.Action>
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer
          currentStartItem={storesFilter?.page}
          totalItems={storesInfo?.total}
          onClickNavigateBtn={handleChangePage}
          isLoading={isFetchingStoresInfo}
        />
      </Table>
    </>
  );
}
