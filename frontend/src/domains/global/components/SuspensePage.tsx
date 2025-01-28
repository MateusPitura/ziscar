import { Suspense, type ReactElement } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { Childrenable } from "../types/Components";

export default function SuspensePage({ children }: Childrenable): ReactElement {
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
