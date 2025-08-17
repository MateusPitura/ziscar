import type { ReactNode } from "react";
import { InstallmentStatusType } from "@shared/enums";

interface AccountStatusProperties {
  status: InstallmentStatusType;
}

export default function AccountStatus({
  status,
}: AccountStatusProperties): ReactNode {
  return status === "PAID" ? (
    <div className="p-1 px-2 text-body-medium rounded-md w-fit h-fit bg-green-600 text-white border border-green-700">
      Pago
    </div>
  ) : (
    <div className="p-1 px-2 text-body-medium rounded-md w-fit h-fit bg-amber-500 text-white border border-amber-600">
      Pendente
    </div>
  );
}
