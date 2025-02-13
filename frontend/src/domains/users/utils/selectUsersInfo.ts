import { User } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";

export default function selectUsersInfo(data: User[]): User[] {
  const itemsFiltered = [];

  for (const user of data) {
    itemsFiltered.push({
      ...user,
      cellphone: applyMask(user?.cellphone, "cellphone"),
    });
  }

  return itemsFiltered;
}
