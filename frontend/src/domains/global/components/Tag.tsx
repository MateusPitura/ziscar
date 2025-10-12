import classNames from "classnames";
import type { ReactNode } from "react";

interface TagProperties {
  content: string;
  className?: classNames.Argument;
}

export default function Tag({ content, className }: TagProperties): ReactNode {
  return (
    <div className={classNames("rounded-lg border px-3 py-1 w-fit", className)}>
      {content}
    </div>
  );
}
