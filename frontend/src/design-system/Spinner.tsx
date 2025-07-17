import type { ReactElement } from "react";

export default function Spinner(): ReactElement {
  return (
    <div
      className="w-10 h-10 border-4 border-slate-800 border-solid rounded-full animate-spin border-t-transparent"
      role="status"
      aria-label="Loading"
    />
  );
}
