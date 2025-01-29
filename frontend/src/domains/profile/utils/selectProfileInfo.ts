import { User } from "@/domains/global/types/user";
import { applyMask } from "@/domains/global/utils/applyMask";

export default function selectProfileInfo(data: User): User {
  const baseData = {
    ...data,
    cpf: applyMask(data?.cpf, "CPF"),
    cellphone: applyMask(data?.cellphone, "CELLPHONE"),
  };

  if (!data?.address) {
    return baseData;
  }

  const cep = applyMask(data?.address?.cep, "CEP");

  if (!cep) {
    return baseData;
  }

  return {
    ...baseData,
    address: {
      ...data?.address,
      cep,
    },
  };
}
