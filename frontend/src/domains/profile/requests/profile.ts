import { baseUrl } from "@/domains/global/constants/requests";
import { User } from "@/domains/global/types/User";

interface GetProfileInfoProps {
  id: string;
}

type GetProfileInfoOutput = User;

export async function GetProfileInfo({
  id,
}: GetProfileInfoProps): Promise<GetProfileInfoOutput> {
  const response = await fetch(`${baseUrl}users/${id}`);
  const data = await response.json();
  return data;
}
