import Tag from "@/domains/global/components/Tag";
import { VehicleStatus } from "@shared/enums";
import type { ReactNode } from "react";
import { VehicleStatusText } from "../constants";

interface VehicleStatusTagProperties {
  status: VehicleStatus;
  isActive: boolean;
}

export default function VehicleStatusTag({
  status,
  isActive,
}: VehicleStatusTagProperties): ReactNode {
  return (
    <Tag
      className={{
        "bg-blue-100 text-blue-800 border-blue-800":
          status === VehicleStatus.PURCHASED && isActive,
        "bg-green-100 text-green-800 border-green-800":
          status === VehicleStatus.IN_STOCK && isActive,
        "bg-orange-100 text-orange-800 border-orange-800":
          status === VehicleStatus.MAINTENANCE && isActive,
        "bg-gray-100 text-gray-800 border-gray-800":
          status === VehicleStatus.SOLD && isActive,
        "bg-red-100 text-red-800 border-red-800": !isActive,
      }}
      content={isActive ? VehicleStatusText[status] : "Inativo"}
    />
  );
}
