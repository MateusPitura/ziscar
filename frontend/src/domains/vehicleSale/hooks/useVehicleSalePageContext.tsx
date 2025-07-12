import { useContext } from "react";
import { VehicleSalePageContext } from "../contexts/VehicleSalePageContext";

export default function useVehicleSalePageContext() {
  const context = useContext(VehicleSalePageContext);

  if (!context) {
    throw new Error(
      "useVehicleSalePageContext must be used within a VehicleSalePageProvider"
    );
  }

  return context;
}
