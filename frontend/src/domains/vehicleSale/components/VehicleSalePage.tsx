import { VehicleSalePageProvider } from "../contexts/VehicleSalePageContext";
import VehicleSaleContainer from "./VehicleSaleContainer";

export default function VehicleSalePage() {
  return (
    <VehicleSalePageProvider>
      <VehicleSaleContainer />
    </VehicleSalePageProvider>
  );
}
