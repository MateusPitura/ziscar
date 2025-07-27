import { UserFormInputs } from "@/domains/users/types";
import { Address } from "../types/model";
import { applyMask } from "./applyMask";

export default function selectAddressInfo(
  address?: Address
): UserFormInputs["address"] {
  if (!address) return [];

  return [
    {
      cep: applyMask(address?.cep, "cep") ?? "",
      number: address?.number ?? "",
      street: address?.street ?? "",
      neighborhood: address?.neighborhood ?? "",
      cityIbgeCode: address?.city?.ibgeCode.toString() ?? "",
      state: address?.city?.state ?? "",
    },
  ];
}
