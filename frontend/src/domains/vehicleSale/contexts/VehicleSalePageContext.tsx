import { Childrenable } from "@/domains/global/types";
import { Customer } from "@/domains/global/types/model";
import { createContext, useMemo, useState } from "react";

interface VehicleSalePageContextValues {
  customer: Customer | null;
  handleCustomer: (customer: Customer | null) => void;
}

const VehicleSalePageContext =
  createContext<VehicleSalePageContextValues | null>(null);

function VehicleSalePageProvider({ children }: Childrenable) {
  const [customer, setCustomer] = useState<Customer | null>(null);

  function handleCustomer(customer: Customer | null) {
    setCustomer(customer);
  }

  const valuesMemoized = useMemo(
    () => ({
      customer,
      handleCustomer,
    }),
    [customer]
  );

  return (
    <VehicleSalePageContext.Provider value={valuesMemoized}>
      {children}
    </VehicleSalePageContext.Provider>
  );
}

export { VehicleSalePageContext, VehicleSalePageProvider };
