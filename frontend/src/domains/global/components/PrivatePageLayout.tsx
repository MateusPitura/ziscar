import { useState, type ReactElement } from "react";
import PageTopBar from "./PageTopBar";
import PageSideBar from "./PageSideBar";
import { Outlet } from "react-router-dom";
import Spinner from "@/design-system/Spinner";
import useSafeFetch from "../hooks/useSafeFetch";
import { BASE_URL } from "../constants";
import { useQuery } from "@tanstack/react-query";

export default function PrivatePageLayout(): ReactElement {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(true);

  function handleToggleSideMenu() {
    setIsSideMenuOpen((prev) => !prev);
  }

  const { safeFetch } = useSafeFetch();

  async function getUserPermissions(): Promise<Permissions> {
    return await safeFetch(`${BASE_URL}/permissions`);
  }

  const { data: userPermissions } = useQuery({
    queryKey: ["permissions"],
    queryFn: getUserPermissions,
  });

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
