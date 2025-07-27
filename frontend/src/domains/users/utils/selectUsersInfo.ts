import { PageablePayload } from "@/domains/global/types";
import { FetchUser } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";

export default function selectUsersInfo(payload: PageablePayload<FetchUser>): PageablePayload<FetchUser> {
  const itemsFiltered = [];

  for (const user of payload.data) {
    itemsFiltered.push({
      ...user,
      phone: applyMask(user?.phone, "phone"),
    });
  }

  return {
    total: payload.total,
    data: itemsFiltered
  };
}
