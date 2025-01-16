import type { ReactElement } from "react";

export default function LoadingSpinner(): ReactElement {
  return (
    <div
      className="w-10 h-10 border-4 border-light-primary border-solid rounded-full animate-spin border-t-transparent"
      role="status"
      aria-label="Loading"
    />
  );
}
