import { ContextHelperable } from "@/domains/contextHelpers/types";
import { VehicleSalePageProvider } from "../contexts/VehicleSalePageContext";
import VehicleSaleContainer from "./VehicleSaleContainer";

export default function VehicleSalePage({ contextHelper }: ContextHelperable) {
  return (
    <VehicleSalePageProvider>
      <VehicleSaleContainer contextHelper={contextHelper} />
    </VehicleSalePageProvider>
  );
}
