import Table from "@/design-system/Table";
import ExportButton from "@/domains/pdf/components/ExportButton";
import { useMemo, useState, type ReactNode } from "react";
import { DisableStore, StoresFilterFormInputs } from "../types";
import useDialog from "@/domains/global/hooks/useDialog";
import DisableStoreModal from "./DisableStoreModal";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useGlobalContext from "@/domains/global/hooks/useGlobalContext";
import formatFilters from "@/domains/global/utils/formatFilters";
import { PageablePayload } from "@/domains/global/types";
import { BACKEND_URL } from "@/domains/global/constants";
import { useQuery } from "@tanstack/react-query";
import { FetchStore } from "@/domains/global/types/model";
import selectStoresInfo from "../utils";
import StoresTableActions from "./StoresTableActions";
import StoresFilterForm from "../forms/StoresFilterForm";

export default function StoresTable(): ReactNode {
  const [disableStoreInfo, setDisableStoreInfo] = useState<DisableStore>({
    storeName: "",
    storeId: "",
  });

  const dialog = useDialog();
  const { safeFetch } = useSafeFetch();
  const { storesFilter, handleStoresFilter } = useGlobalContext();

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
    return await safeFetch(`${BACKEND_URL}/store?${filter}`, {
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
        <ExportButton<FetchStore, StoresFilterFormInputs>
          fileName="Relatório Lojas"
          resource="STORES"
          queryKey={["stores", filterFormatted]}
          queryFn={getStoresInfo}
          formatFilters={{
            name: "Nome completo",
            orderBy: "Ordenar por",
            status: "Status",
          }}
          formatFiltersValues={{
            orderBy: {
              email: "Email",
              name: "Nome",
            },
            status: {
              active: "Ativo",
              inactive: "Inativo",
            },
          }}
          formatColumns={{
            id: "ID",
            name: "Nome",
            email: "Email",
            phone: "Celular",
            archivedAt: "Ativo",
          }}
        />
        <Table.Filter form={<StoresFilterForm />} />
      </div>
      <Table>
        <Table.Header>
          <Table.Head label="ID" />
          <Table.Head label="Nome" />
          <Table.Head label="Email" />
          <Table.Head label="Celular" />
          <Table.Head label="Status" />
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
              <Table.Cell label={String(store.id)} />
              <Table.Cell label={store.name} />
              <Table.Cell label={store.email} />
              <Table.Cell label={store.phone} />
              <Table.Cell label={store.archivedAt ? "Inativo" : "Ativo"} />
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
