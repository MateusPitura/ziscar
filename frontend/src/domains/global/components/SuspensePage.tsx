import { Suspense, type ReactElement } from "react";
import Spinner from "@/design-system/Spinner";
import { Childrenable } from "../types";

export default function SuspensePage({ children }: Childrenable): ReactElement {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-full w-full">
          <Spinner />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
