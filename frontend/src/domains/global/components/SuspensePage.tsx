import { Suspense, type ReactElement, type ReactNode } from "react";
import LoadingSpinner from "./LoadingSpinner";

interface SuspensePageProperties {
  children: ReactNode;
}

export default function SuspensePage({
  children,
}: SuspensePageProperties): ReactElement {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-full">
          <LoadingSpinner />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
