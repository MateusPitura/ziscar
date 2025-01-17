import { useContext } from "react";
import { VehiclesPageContext } from "../contexts/VehiclesPageContext";

export default function useVehiclesPageContext() {
  const context = useContext(VehiclesPageContext);

  if (!context) {
    throw new Error(
      "useVehiclesPageContext must be used within a VehiclesPageProvider"
    );
  }

  return context;
}
