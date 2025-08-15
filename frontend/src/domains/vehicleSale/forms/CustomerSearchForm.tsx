import Search from "@/design-system/Form/Search";
import { useState, type ReactElement } from "react";
import { FetchCustomer } from "@/domains/global/types/model";
import { BACKEND_URL } from "@/domains/global/constants";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { VehicleSaleFormInputs } from "../types";
import NewCustomerModal from "../components/NewCustomerModal";
import useDialog from "@/domains/global/hooks/useDialog";
import useVehicleSalePageContext from "../hooks/useVehicleSalePageContext";
import selectCustomersInfo from "../utils/selectCustomersInfo";
import { applyMask } from "@/domains/global/utils/applyMask";
import { cpfSearchSchema } from "../schemas";

export default function CustomerSearchForm(): ReactElement {
  const { safeFetch } = useSafeFetch();
  const dialog = useDialog();
  const [customerCpf, setCustomerCpf] = useState("");
  const { handleCustomer } = useVehicleSalePageContext();

  async function getCustomersInfo(filter?: string): Promise<FetchCustomer[]> {
    if (!filter) return [];

    const result = await safeFetch(`${BACKEND_URL}/customer?cpf=${filter}&orderBy=fullName`, {
      resource: "CUSTOMERS",
      action: "READ",
    });

    return result.data;
  }

  return (
    <>
      <NewCustomerModal {...dialog} customerCpf={customerCpf} />
      <Search<VehicleSaleFormInputs, FetchCustomer[]>
        label="CPF"
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
          setCustomerCpf(value);
          dialog.openDialog();
        }}
        formatNotFound={(value) => applyMask(value, "cpf") ?? ""}
        formatSearch={(search) => {
          const result = cpfSearchSchema.safeParse(search);
          if (result.success) {
            return result.data;
          }
          return undefined;
        }}
      />
    </>
  );
}
