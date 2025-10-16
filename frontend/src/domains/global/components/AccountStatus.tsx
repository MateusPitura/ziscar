import { InstallmentStatusType } from "@shared/enums";
import type { ReactNode } from "react";
import Tag from "./Tag";

interface AccountStatusProperties {
  status: InstallmentStatusType;
}

export default function AccountStatus({
  status,
}: AccountStatusProperties): ReactNode {
  return (
    <Tag
      className={{
        "bg-green-100 text-green-800 border-green-800": status === "PAID",
        "bg-orange-100 text-orange-800 border-orange-800": status === "PENDING",
      }}
      content={status === "PAID" ? "Pago" : "Pendente"}
    />
  );
}
