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
import selectCustomersInfoForReport from "../utils/selectCustomersInfoForReport";
import { CUSTOMERS_TABLE } from "../constants";

const enableReport = false;

export default function CustomersTable(): ReactNode {
  const [disableCustomerInfo, setDisableCustomerInfo] =
    useState<DisableCustomer>({
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
    return await safeFetch(
      `${BACKEND_URL}/customer?${filter}&orderBy=fullName`,
      {
        resource: "CUSTOMERS",
        action: "READ",
      }
    );
  }

  const { data: customersInfo, isFetching: isFetchingCustomersInfo } = useQuery(
    {
      queryKey: ["customers", filterFormatted],
      queryFn: ({ queryKey }) => getCustomersInfo(queryKey[1]),
      select: selectCustomersInfo,
    }
  );

  return (
    <>
      <DisableCustomerModal {...disableCustomerInfo} {...dialog} />
      <div className="flex gap-4 justify-end">
        {enableReport && (
          <ExportButton<FetchCustomer, CustomersFilterFormInputs>
            fileName="Relatório Clientes"
            queryKey={["customers", filterFormatted]}
            queryFn={getCustomersInfo}
            selectQueryFn={selectCustomersInfoForReport}
            formatFilters={{
              fullName: "Nome completo",
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
              cpf: "CPF",
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
          <Table.Head label={CUSTOMERS_TABLE.name.label} />
          <Table.Head label={CUSTOMERS_TABLE.cpf.label} />
          <Table.Head label={CUSTOMERS_TABLE.email.label} />
          <Table.Head label={CUSTOMERS_TABLE.phone.label} />
          <Table.Head label={CUSTOMERS_TABLE.status.label} />
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
              <Table.Cell
                label={customer.fullName}
                columnLabel={CUSTOMERS_TABLE.name.label}
              />
              <Table.Cell
                label={customer.cpf}
                columnLabel={CUSTOMERS_TABLE.cpf.label}
              />
              <Table.Cell
                label={customer.email}
                columnLabel={CUSTOMERS_TABLE.email.label}
              />
              <Table.Cell
                label={customer.phone}
                columnLabel={CUSTOMERS_TABLE.phone.label}
              />
              <Table.Cell
                label={customer.archivedAt ? "Inativo" : "Ativo"}
                columnLabel={CUSTOMERS_TABLE.status.label}
              />
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
