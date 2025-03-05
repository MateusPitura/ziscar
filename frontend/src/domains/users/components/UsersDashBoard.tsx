import DashBoard from "@/domains/global/components/DashBoard";
// import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
// import { BASE_URL } from "@/domains/global/constants";
import { DashBoardProps } from "@/domains/global/types";

export default function UsersDashBoard(): ReactNode {
  // const { safeFetch } = useSafeFetch();

  async function getDashBoardInfo(): Promise<DashBoardProps[]> {
    // return await safeFetch(`${BASE_URL}/usersDashboard`, { // TODO: implementar no backend
    //   resource: "users",
    //   action: "read",
    // });
    return [
      {
        id: "1",
        label: "Total de usuários",
        value: "24",
      },
      {
        id: "2",
        label: "Total de vendas",
        value: "R$100.000,00",
      },
    ];
  }

  const { data: dashBoardInfo, isFetching: isFetchingDatashBoardInfo } =
    useQuery({
      queryKey: ["usersDashboard"],
      queryFn: getDashBoardInfo,
    });

  return (
    <DashBoard
      isLoading={isFetchingDatashBoardInfo}
      resource="users"
      action="read"
    >
      {dashBoardInfo?.map((item) => (
        <DashBoard.Card key={item.id} label={item.label} value={item.value} />
      ))}
    </DashBoard>
  );
}
