import { useState, type ReactElement } from "react";
import PageTopBar from "./PageTopBar";
import PageSideBar from "./PageSideBar";
import { Outlet } from "react-router-dom";

export default function ClosePageLayout(): ReactElement {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(true);

  function handleToggleSideMenu() {
    setIsSideMenuOpen((prev) => !prev);
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
