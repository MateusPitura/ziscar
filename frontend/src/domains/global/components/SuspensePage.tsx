import { Suspense, type ReactElement } from "react";
import { Childrenable } from "../types/Components";
import Spinner from "@/design-system/Spinner";

export default function SuspensePage({ children }: Childrenable): ReactElement {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-full">
          <Spinner />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
