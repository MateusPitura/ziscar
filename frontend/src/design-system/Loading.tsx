import { type ReactElement } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import classNames from "classnames";
import { Childrenable } from "@/domains/global/types";

interface LoadingProperties extends Childrenable {
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
