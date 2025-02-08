import type { ReactElement } from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage(): ReactElement {
  return (
    <div className="flex flex-col gap-4 justify-center items-center h-full">
      <span className="text-light-primary text-display-large">404</span>
      <span className="text-light-onSurface text-headline-large">
        A página que você procura não foi encontrada
      </span>
      <Link to="/sign">
        <span className="text-light-onSurface text-headline-large">
          Vá para o <span className="text-light-primary underline">login</span>
        </span>
      </Link>
    </div>
  );
}
