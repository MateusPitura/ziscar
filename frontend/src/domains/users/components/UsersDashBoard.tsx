import DashBoard from "@/domains/global/components/DashBoard";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { DashBoardProps } from "@/domains/global/types";

export default function UsersDashBoard(): ReactNode {
  async function getDashBoardInfo(): Promise<DashBoardProps[]> {
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
      resource="USERS"
      action="READ"
    >
      {dashBoardInfo?.map((item) => (
        <DashBoard.Card key={item.id} label={item.label} value={item.value} />
      ))}
    </DashBoard>
  );
}
