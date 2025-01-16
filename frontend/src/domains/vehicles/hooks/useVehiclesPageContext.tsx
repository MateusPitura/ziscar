import { useContext } from "react";
import { VehiclesPageContext } from "../contexts/VehiclesPageContext";

export default function useVehiclesPageContext() {
  return useContext(VehiclesPageContext);
}
