import PageHeader from "@/domains/global/components/PageHeader";
import type { ReactElement } from "react";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import { useNavigate } from "react-router-dom";
import DashBoard from "./DashBoard";
import { useQuery } from "@tanstack/react-query";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { baseUrl } from "@/domains/global/constants/requests";
import { DashBoard as DashBoardProps } from "@/domains/global/types/DashBoard";

export default function UsersContainer(): ReactElement {
  const navigate = useNavigate();

  const { safeFetch } = useSafeFetch();

  async function getDashBoardInfo(): Promise<DashBoardProps[]> {
    return await safeFetch({ path: `${baseUrl}/dashboard` });
  }

  const { data: dashBoardInfo, isFetching: isFetchingDatashBoardInfo } =
    useQuery({
      queryKey: ["user-dashboard"],
      queryFn: getDashBoardInfo,
    });

  return (
    <div>
      <PageHeader
        title="Usuários"
        primaryButtonLabel="Adicionar usuário"
        onClickPrimaryBtn={() => navigate("/users/create")}
        primaryBtnIconRigth={<PersonAddOutlinedIcon />}
      />
      <DashBoard isLoading={isFetchingDatashBoardInfo}>
        {dashBoardInfo?.map((item) => (
          <DashBoard.Card key={item.id} label={item.label} value={item.value} />
        ))}
      </DashBoard>
    </div>
  );
}
