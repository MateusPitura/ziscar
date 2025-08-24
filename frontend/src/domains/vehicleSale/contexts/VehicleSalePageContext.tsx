import { Childrenable } from "@/domains/global/types";
import { createContext, useMemo, useState } from "react";
import { CustomerForVehicleSale, VehicleForVehicleSale } from "../types";

interface VehicleSalePageContextValues {
  customer: CustomerForVehicleSale | null;
  handleCustomer: (customer: CustomerForVehicleSale | null) => void;
  vehicle: VehicleForVehicleSale | null;
  handleVehicle: (vehicle: VehicleForVehicleSale | null) => void;
}

const VehicleSalePageContext =
  createContext<VehicleSalePageContextValues | null>(null);

function VehicleSalePageProvider({ children }: Childrenable) {
  const [customer, setCustomer] = useState<CustomerForVehicleSale | null>(null);

  function handleCustomer(customer: CustomerForVehicleSale | null) {
    setCustomer(customer);
  }

  const [vehicle, setVehicle] = useState<VehicleForVehicleSale | null>(null);

  function handleVehicle(vehicle: VehicleForVehicleSale | null) {
    setVehicle(vehicle);
  }

  const valuesMemoized = useMemo(
    () => ({
      customer,
      handleCustomer,
      vehicle,
      handleVehicle,
    }),
    [customer, vehicle]
  );

  return (
    <VehicleSalePageContext.Provider value={valuesMemoized}>
      {children}
    </VehicleSalePageContext.Provider>
  );
}

export { VehicleSalePageContext, VehicleSalePageProvider };
