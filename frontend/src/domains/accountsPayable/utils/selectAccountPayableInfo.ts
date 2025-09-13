import { FetchAccountPayable } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";

export default function selectAccountPayableInfo(
  payload: FetchAccountPayable
): FetchAccountPayable {
  return {
    ...payload,
    totalValue: applyMask(payload.totalValue, "money") ?? "",
  };
}
