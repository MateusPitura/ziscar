import { Suspense } from "react";
import { Route, Routes, HashRouter } from "react-router-dom";
import { routes } from "@/domains/global/constants/routes";
import PageLayout from "@/domains/global/components/PageLayout";
import Snackbar from "./design-system/Snackbar";
import { GlobalProvider } from "./domains/global/contexts/GlobalContext";

export default function App() {
  return (
    <>
      <HashRouter>
        <GlobalProvider>
          <PageLayout>
            <Suspense fallback={null}>
              <Routes>
                {routes.map((group) =>
                  group.routes.map((route) => (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={route.entryPage}
                    />
                  ))
                )}
              </Routes>
            </Suspense>
          </PageLayout>
        </GlobalProvider>
      </HashRouter>
      <Snackbar />
    </>
  );
}
