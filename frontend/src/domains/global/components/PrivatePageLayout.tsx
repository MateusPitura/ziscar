import Spinner from "@/design-system/Spinner";
import { ActionsType, ResourcesType } from "@shared/enums";
import { Permissions } from "@shared/types";
import { formatDeniedMessage } from "@shared/utils/formatDeniedMessage";
import { useQuery } from "@tanstack/react-query";
import { useEffect, type ReactElement } from "react";
import { Outlet, useMatches, useNavigate } from "react-router-dom";
import { BACKEND_URL, DEFAULT_ROUTE } from "../constants";
import useSafeFetch from "../hooks/useSafeFetch";
import useSnackbar from "../hooks/useSnackbar";
import PageSideBar from "./PageSideBar";

export default function PrivatePageLayout(): ReactElement {
  const matches = useMatches();
  const { showErrorSnackbar } = useSnackbar();

  const { safeFetch } = useSafeFetch();
  const navigate = useNavigate();

  async function getUserPermissions(): Promise<Permissions> {
    return await safeFetch(`${BACKEND_URL}/permissions`);
  }

  const { data: userPermissions, isLoading } = useQuery({
    queryKey: ["permissions"],
    queryFn: getUserPermissions,
  });

  useEffect(() => {
    if (!isLoading && !userPermissions) {
      navigate("/");
    }

    if (!userPermissions) return;

    const routeHandle = matches[matches.length - 1].handle as {
      resource?: ResourcesType;
      action?: ActionsType;
    };

    const resource = routeHandle?.["resource"];
    const action = routeHandle?.["action"];

    if (resource && action && !userPermissions[resource][action]) {
      showErrorSnackbar({
        description: formatDeniedMessage({ resource, action }),
      });
      navigate(DEFAULT_ROUTE);
    }
  }, [isLoading, userPermissions, matches, navigate, showErrorSnackbar]);

  if (!userPermissions) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 w-full h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <PageSideBar />
        <div className="w-full p-4 h-full overflow-y-auto flex">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
