import type { ReactElement, ReactNode } from "react";
import PageHeader from "./PageHeader";
import PageSideMenu from "./PageSideMenu";

interface PageLayoutProperties {
  children: ReactNode;
}

export default function PageLayout({
  children,
}: PageLayoutProperties): ReactElement {
  return (
    <div className="bg-light-surfaceContainerLowest w-full h-screen flex flex-col">
      <PageHeader/>
      <div className="flex flex-1 overflow-hidden">
        <PageSideMenu/>
        <div className="bg-light-surface h-full p-4 rounded-tl-md w-full overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
