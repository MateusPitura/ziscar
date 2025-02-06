import DashBoard from "@/domains/global/components/DashBoard";
import { baseUrl } from "@/domains/global/constants/requests";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { DashBoard as DashBoardProps } from "@/domains/global/types/dashBoard";
import { queryKeys } from "@/domains/global/types/queryKeys";

export default function UsersDashBoard(): ReactNode {
  const { safeFetch } = useSafeFetch();

  async function getDashBoardInfo(): Promise<DashBoardProps[]> {
    return await safeFetch({ path: `${baseUrl}/usersDashboard` });
  }

  const { data: dashBoardInfo, isFetching: isFetchingDatashBoardInfo } =
    useQuery({
      queryKey: [queryKeys.USERS_DASHBOARD],
      queryFn: getDashBoardInfo,
    });

  return (
    <DashBoard isLoading={isFetchingDatashBoardInfo}>
      {dashBoardInfo?.map((item) => (
        <DashBoard.Card key={item.id} label={item.label} value={item.value} />
      ))}
    </DashBoard>
  );
}
