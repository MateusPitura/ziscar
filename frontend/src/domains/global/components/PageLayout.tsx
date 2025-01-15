import { useState, type ReactElement, type ReactNode } from "react";
import PageTopBar from "./PageTopBar";
import PageSideBar from "./PageSideBar";

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({
  children,
}: PageLayoutProps): ReactElement {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(true);

  function handleToggleSideMenu() {
    setIsSideMenuOpen((prev) => !prev);
  }

  return (
    <div className="bg-light-surfaceContainerLowest w-full h-screen flex flex-col">
      <PageTopBar onToggleSideMenu={handleToggleSideMenu} />
      <div className="flex flex-1 overflow-hidden">
        <PageSideBar isOpen={isSideMenuOpen} />
        <div className="bg-light-surface h-full p-4 rounded-tl-md w-full overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
