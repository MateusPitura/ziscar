import { Childrenable } from "@/domains/global/types";
import { createContext, useMemo, useState } from "react";
import { CustomerForVehicleSale } from "../types";

interface VehicleSalePageContextValues {
  customer: CustomerForVehicleSale | null;
  handleCustomer: (customer: CustomerForVehicleSale | null) => void;
}

const VehicleSalePageContext =
  createContext<VehicleSalePageContextValues | null>(null);

function VehicleSalePageProvider({ children }: Childrenable) {
  const [customer, setCustomer] = useState<CustomerForVehicleSale | null>(null);

  function handleCustomer(customer: CustomerForVehicleSale | null) {
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
