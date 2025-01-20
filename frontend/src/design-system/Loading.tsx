import {
    type ReactElement,
    type ReactNode
} from "react";
import { Skeleton } from "@/components/ui/skeleton";
import classNames from "classnames";

interface LoadingProperties {
  children: ReactNode;
  isLoading: boolean;
  className: string;
}

export default function Loading({
  children,
  isLoading,
  className,
}: LoadingProperties): ReactElement {
  return isLoading ? (
    <Skeleton className={classNames("bg-neutral-300", className)}>
      <div className="invisible">Loading</div>
    </Skeleton>
  ) : (
    <div className={className}>{children}</div>
  );
}
