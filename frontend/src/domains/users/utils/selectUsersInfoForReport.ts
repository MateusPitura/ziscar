import { PageablePayload } from "@/domains/global/types";
import { FetchUser } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";

export default function selectUsersInfoForReport(payload: PageablePayload<FetchUser>): Record<string, unknown>[] {
  const itemsFiltered = [];

  for (const user of payload.data) {
    itemsFiltered.push({
      ...user,
      phone: applyMask(user?.phone, "phone"),
    });
  }

  return itemsFiltered;
}
