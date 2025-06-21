import { useEffect, useState, type ReactElement } from "react";
import PageTopBar from "./PageTopBar";
import PageSideBar from "./PageSideBar";
import { Outlet, useMatches, useNavigate } from "react-router-dom";
import Spinner from "@/design-system/Spinner";
import useSafeFetch from "../hooks/useSafeFetch";
import { BACKEND_URL } from "../constants";
import { useQuery } from "@tanstack/react-query";
import { Action, Permissions, Resource } from "@shared/types";
import useSnackbar from "../hooks/useSnackbar";
import { formatDeniedMessage } from "@shared/utils/formatDeniedMessage";

export default function PrivatePageLayout(): ReactElement {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(true);
  const matches = useMatches();
  const { showErrorSnackbar } = useSnackbar();

  function handleToggleSideMenu() {
    setIsSideMenuOpen((prev) => !prev);
  }

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
      navigate("/profile");
    }
  }, [isLoading, userPermissions, matches]);

  if (!userPermissions) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-light-surfaceContainerLowest w-full h-screen flex flex-col">
      <PageTopBar onToggleSideMenu={handleToggleSideMenu} />
      <div className="flex flex-1 overflow-hidden">
        <PageSideBar isOpen={isSideMenuOpen} />
        <div className="bg-light-surface p-4 rounded-tl-md w-full overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
