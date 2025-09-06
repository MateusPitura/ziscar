import DataField from "@/domains/global/components/DataField";
import { FetchCustomer } from "@/domains/global/types/model";
import type { ReactNode } from "react";

interface CustomerDataProps {
  customerData: FetchCustomer | null;
}

export default function CustomerData({
  customerData: customer,
}: CustomerDataProps): ReactNode {
  return (
    <>
      <DataField label="Nome" value={customer?.fullName} />
      <DataField label="CPF" value={customer?.cpf} />
      <DataField label="Email" value={customer?.email} />
      <DataField label="Celular" value={customer?.phone} />
    </>
  );
}
