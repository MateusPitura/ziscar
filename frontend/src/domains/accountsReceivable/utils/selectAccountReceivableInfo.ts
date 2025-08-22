import { FetchAccountReceivable } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";

export default function selectAccountReceivableInfo(
  payload: FetchAccountReceivable
): FetchAccountReceivable {
  return {
    ...payload,
    totalValue: applyMask(payload.totalValue, "money") ?? "",
  };
}
