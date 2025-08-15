import type { ReactNode } from "react";
import useVehicleSalePageContext from "../hooks/useVehicleSalePageContext";
import DataField from "@/domains/global/components/DataField";

export default function CustomerData(): ReactNode {
  const { customer } = useVehicleSalePageContext();

  return (
    <>
      <DataField label="Nome" value={customer?.fullName}/>
      <DataField label="CPF" value={customer?.cpf}/>
      <DataField label="Email" value={customer?.email}/>
      <DataField label="Celular" value={customer?.phone}/>
    </>
  );
}
