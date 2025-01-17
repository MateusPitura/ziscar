import { Route, Routes, HashRouter } from "react-router-dom";
import { routes } from "@/domains/global/constants/routes";
import PageLayout from "@/domains/global/components/PageLayout";
import { GlobalProvider } from "./domains/global/contexts/GlobalContext";
import SuspensePage from "./domains/global/components/SuspensePage";
import Snackbar from "./design-system/Snackbar";

export default function App() {
  return (
    <>
      <Snackbar />
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
            </Routes>
          </PageLayout>
        </GlobalProvider>
      </HashRouter>
    </>
  );
}
