import PublicPageLayout from "./domains/global/components/PublicPageLayout";
import { privateRoutes, publicRoutes } from "./domains/global/constants/routes";
import SuspensePage from "./domains/global/components/SuspensePage";
import PrivatePageLayout from "./domains/global/components/PrivatePageLayout";
import { createBrowserRouter } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";

const privateRouteElements = privateRoutes.flatMap((group) =>
  group.routes.map((route) => ({
    path: route.path,
    element: <SuspensePage key={route.path}>{route.entryPage}</SuspensePage>,
    handle: {
      resource: route.resource,
      action: route.action,
    },
  }))
);

const publicRouteElements = publicRoutes.flatMap((group) =>
  group.routes.map((route) => ({
    path: route.path,
    element: <SuspensePage key={route.path}>{route.entryPage}</SuspensePage>,
  }))
);

export const router = createBrowserRouter([
  {
    element: (
      <ErrorBoundary>
        <PrivatePageLayout />
      </ErrorBoundary>
    ),
    children: privateRouteElements,
  },
  {
    element: (
      <ErrorBoundary>
        <PublicPageLayout />
      </ErrorBoundary>
    ),
    children: publicRouteElements,
  },
]);
