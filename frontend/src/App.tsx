import { Route, Routes, HashRouter } from "react-router-dom";
import { routes } from "@/domains/global/constants/routes";
import PageLayout from "@/domains/global/components/PageLayout";
import Snackbar from "./design-system/Snackbar";
import { GlobalProvider } from "./domains/global/contexts/GlobalContext";
import LoadingSpinner from "./domains/global/components/LoadingSpinner";
import { Suspense } from "react";

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
                      <Suspense
                        key={route.path}
                        fallback={
                          <div className="flex justify-center items-center h-full">
                            <LoadingSpinner />
                          </div>
                        }
                      >
                        {route.entryPage}
                      </Suspense>
                    }
                  />
                ))
              )}
            </Routes>
          </PageLayout>
        </GlobalProvider>
      </HashRouter>
      <Snackbar />
    </>
  );
}
