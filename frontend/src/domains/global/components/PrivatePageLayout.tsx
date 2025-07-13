import { useEffect, type ReactElement } from "react";
import PageSideBar from "./PageSideBar";
import { Outlet, useMatches, useNavigate } from "react-router-dom";
import Spinner from "@/design-system/Spinner";
import useSafeFetch from "../hooks/useSafeFetch";
import { BACKEND_URL, DEFAULT_ROUTE } from "../constants";
import { useQuery } from "@tanstack/react-query";
import { Action, Permissions, Resource } from "@shared/types";
import useSnackbar from "../hooks/useSnackbar";
import { formatDeniedMessage } from "@shared/utils/formatDeniedMessage";

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
      resource?: Resource;
      action?: Action;
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
        <div className="bg-neutral-50 p-4 w-full overflow-y-auto">
          <div className="w-full p-4 rounded-md shadow-md h-full overflow-y-auto flex">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
