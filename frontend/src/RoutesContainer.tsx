import type { ReactNode } from "react";
import PublicPageLayout from "./domains/global/components/PublicPageLayout";
import { Route, Routes } from "react-router-dom";
import { privateRoutes, publicRoutes } from "./domains/global/constants/routes";
import SuspensePage from "./domains/global/components/SuspensePage";
import PrivatePageLayout from "./domains/global/components/PrivatePageLayout";

export default function RoutesContainer(): ReactNode {
  return (
    <Routes>
      <Route element={<PrivatePageLayout />}>
        {privateRoutes.map((group) =>
          group.routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <SuspensePage key={route.path}>{route.entryPage}</SuspensePage>
              }
            />
          ))
        )}
      </Route>
      <Route element={<PublicPageLayout />}>
        {publicRoutes.map((group) =>
          group.routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <SuspensePage key={route.path}>{route.entryPage}</SuspensePage>
              }
            />
          ))
        )}
      </Route>
    </Routes>
  );
}
