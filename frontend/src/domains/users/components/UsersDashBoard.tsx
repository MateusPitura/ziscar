import DashBoard from "@/domains/global/components/DashBoard";
import { baseUrl } from "@/domains/global/constants/requests";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { DashBoard as DashBoardProps } from "@/domains/global/types/dashBoard";
import { queryKeys } from "@/domains/global/types/queryKeys";
import formatDeniedMessage from "@/domains/global/utils/formatDeniedMessage";
import useCheckPermission from "@/domains/global/hooks/useCheckPermission";

export default function UsersDashBoard(): ReactNode {
  const { safeFetch } = useSafeFetch();
  const hasPermission = useCheckPermission("users", "read");

  async function getDashBoardInfo(): Promise<DashBoardProps[]> {
    return await safeFetch(`${baseUrl}/usersDashboard`, {
      resource: "users",
      action: "read",
    });
  }

  const { data: dashBoardInfo, isFetching: isFetchingDatashBoardInfo } =
    useQuery({
      queryKey: [queryKeys.USERS_DASHBOARD],
      queryFn: getDashBoardInfo,
    });

  return (
    <DashBoard isLoading={isFetchingDatashBoardInfo}>
      {!hasPermission && (
        <DashBoard.Card
          label={formatDeniedMessage({ resource: "users", action: "read" })}
          value={"-"}
        />
      )}
      {dashBoardInfo?.map((item) => (
        <DashBoard.Card key={item.id} label={item.label} value={item.value} />
      ))}
    </DashBoard>
  );
}
