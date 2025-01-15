import { useState, type ReactElement, type ReactNode } from "react";
import PageHeader from "./PageHeader";
import PageSideMenu from "./PageSideMenu";

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
      <PageHeader onToggleSideMenu={handleToggleSideMenu} />
      <div className="flex flex-1 overflow-hidden">
        <PageSideMenu isOpen={isSideMenuOpen} />
        <div className="bg-light-surface h-full p-4 rounded-tl-md w-full overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
