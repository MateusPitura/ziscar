import Search from "@/design-system/Form/Search";
import { BACKEND_URL } from "@/domains/global/constants";
import useDialog from "@/domains/global/hooks/useDialog";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { FetchCustomer } from "@/domains/global/types/model";
import { s } from "@shared/safeZod";
import { useState, type ReactElement } from "react";
import NewCustomerModal from "../components/NewCustomerModal";
import useVehicleSalePageContext from "../hooks/useVehicleSalePageContext";
import { VehicleSaleFormInputs } from "../types";
import selectCustomersInfo from "../utils/selectCustomersInfo";

export default function CustomerSearchForm(): ReactElement {
  const { safeFetch } = useSafeFetch();
  const dialog = useDialog();
  const [customerName, setCustomerName] = useState("");
  const { handleCustomer } = useVehicleSalePageContext();

  async function getCustomersInfo(filter?: string): Promise<FetchCustomer[]> {
    if (!filter) return [];

    const result = await safeFetch(
      `${BACKEND_URL}/customer?fullName=${filter}&orderBy=fullName`,
      {
        resource: "CUSTOMERS",
        action: "READ",
      }
    );

    return result.data;
  }

  return (
    <>
      <NewCustomerModal {...dialog} customerName={customerName} />
      <Search<VehicleSaleFormInputs, FetchCustomer[]>
        label="Nome"
        name="customer.id"
        fetchCallback={getCustomersInfo}
        queryKey="customers"
        onChange={(value) => {
          if (!value) {
            handleCustomer(null);
            return;
          }
          handleCustomer(value);
        }}
        labelKey="fullName"
        valueKey="id"
        descriptionKey="cpf"
        required
        select={selectCustomersInfo}
        onClickNotFound={(value) => {
          setCustomerName(value);
          dialog.openDialog();
        }}
        formatNotFound={(value) => value?.trim()}
        formatSearch={(search) => {
          const result = s.name().safeParse(search);
          if (result.success) {
            return result.data.trim();
          }
          return undefined;
        }}
      />
    </>
  );
}
