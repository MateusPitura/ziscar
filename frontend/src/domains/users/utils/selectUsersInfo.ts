import { PageablePayload } from "@/domains/global/types";
import { User } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";

export default function selectUsersInfo(payload: PageablePayload<User>): PageablePayload<User> {
  const itemsFiltered = [];

  for (const user of payload.data) {
    itemsFiltered.push({
      ...user,
      cellphone: applyMask(user?.cellPhone, "cellphone"),
    });
  }

  return {
    total: payload.total,
    data: itemsFiltered
  };
}
