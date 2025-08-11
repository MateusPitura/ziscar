import Table from "@/design-system/Table";
import { BACKEND_URL } from "@/domains/global/constants";
import useDialog from "@/domains/global/hooks/useDialog";
import useFilterContext from "@/domains/global/hooks/useFilterContext";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { PageablePayload } from "@/domains/global/types";
import formatFilters from "@/domains/global/utils/formatFilters";
import ExportButton from "@/domains/pdf/components/ExportButton";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, type ReactNode } from "react";
import { CustomersFilterFormInputs, DisableCustomer } from "../types";
import { FetchCustomer } from "@/domains/global/types/model";
import selectCustomersInfo from "../utils/selectCustomersInfo";
import DisableCustomerModal from "./DisableCustomerModal";
import CustomersFilterForm from "./CustomersFilterForm";
import CustomersTableActions from "./CustomersTableActions";

const enableReport = true;

export default function CustomersTable(): ReactNode {
  const [disableCustomerInfo, setDisableCustomerInfo] = useState<DisableCustomer>({
    customerFullName: "",
    customerId: "",
  });

  const dialog = useDialog();
  const { safeFetch } = useSafeFetch();
  const { customersFilter, handleCustomersFilter } = useFilterContext();

  function handleDisableCustomerInfo(customer: DisableCustomer) {
    dialog.openDialog();
    setDisableCustomerInfo(customer);
  }

  function handleChangePage(page: number) {
    handleCustomersFilter({ page });
  }

  const filterFormatted = useMemo(() => {
    if (customersFilter) {
      return formatFilters(customersFilter);
    }
    return "";
  }, [customersFilter]);

  async function getCustomersInfo(
    filter?: string
  ): Promise<PageablePayload<FetchCustomer>> {
    return await safeFetch(`${BACKEND_URL}/customer?${filter}`, {
      resource: "CUSTOMERS",
      action: "READ",
    });
  }

  const { data: customersInfo, isFetching: isFetchingCustomersInfo } = useQuery({
    queryKey: ["customers", filterFormatted],
    queryFn: ({ queryKey }) => getCustomersInfo(queryKey[1]),
    select: selectCustomersInfo,
  });

  return (
    <>
      <DisableCustomerModal {...disableCustomerInfo} {...dialog} />
      <div className="flex gap-4 justify-end">
        {enableReport && (
          <ExportButton<FetchCustomer, CustomersFilterFormInputs>
            fileName="Relatório Clientes"
            resource="CUSTOMERS"
            queryKey={["customers", filterFormatted]}
            queryFn={getCustomersInfo}
            formatFilters={{
              fullName: "Nome completo",
              orderBy: "Ordenar por",
              status: "Status",
              endDate: "Data final",
              startDate: "Data inicial",
            }}
            formatFiltersValues={{
              orderBy: {
                email: "Email",
                fullName: "Nome completo",
              },
              status: {
                active: "Ativo",
                inactive: "Inativo",
              },
            }}
            formatColumns={{
              id: "ID",
              fullName: "Nome completo",
              email: "Email",
              phone: "Celular",
              archivedAt: "Ativo",
            }}
          />
        )}
        <Table.Filter form={<CustomersFilterForm />} />
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
          isLoading={isFetchingCustomersInfo}
          isEmpty={!customersInfo?.total}
          resource="CUSTOMERS"
          action="READ"
        >
          {customersInfo?.data.map((customer) => (
            <Table.Row key={customer.id}>
              <Table.Cell label={String(customer.id)} />
              <Table.Cell label={customer.fullName} />
              <Table.Cell label={customer.email} />
              <Table.Cell label={customer.phone} />
              <Table.Cell label={customer.archivedAt ? "Inativo" : "Ativo"} />
              <Table.Action>
                <CustomersTableActions
                  isActive={!customer.archivedAt}
                  customerId={String(customer.id)}
                  fullName={customer.fullName}
                  handleDisableCustomerInfo={handleDisableCustomerInfo}
                />
              </Table.Action>
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer
          currentStartItem={customersFilter?.page}
          totalItems={customersInfo?.total}
          onClickNavigateBtn={handleChangePage}
          isLoading={isFetchingCustomersInfo}
        />
      </Table>
    </>
  );
}
