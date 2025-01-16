import { VehiclesPageProvider } from "../contexts/VehiclesPageContext";
import VehicleContainer from "./VehicleContainer";

export default function VehiclesPage() {
  return (
    <VehiclesPageProvider>
      <VehicleContainer />
    </VehiclesPageProvider>
  );
}
