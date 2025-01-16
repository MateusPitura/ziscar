import { Route, Routes, HashRouter } from "react-router-dom";
import { routes } from "@/domains/global/constants/routes";
import PageLayout from "@/domains/global/components/PageLayout";
import { GlobalProvider } from "./domains/global/contexts/GlobalContext";
import { lazy } from "react";
import SuspensePage from "./domains/global/components/SuspensePage";

const SnackbarLazy = lazy(() => import("./design-system/Snackbar"));
const NotFound = lazy(() => import("./domains/global/components/NotFoundPage"));

export default function App() {
  return (
    <>
      <HashRouter>
        <GlobalProvider>
          <PageLayout>
            <Routes>
              {routes.map((group) =>
                group.routes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      <SuspensePage key={route.path}>
                        {route.entryPage}
                      </SuspensePage>
                    }
                  />
                ))
              )}
              <Route
                path="*"
                element={
                  <SuspensePage key="not_found">
                    <NotFound />
                  </SuspensePage>
                }
              />
            </Routes>
          </PageLayout>
        </GlobalProvider>
      </HashRouter>
      <SnackbarLazy />
    </>
  );
}
