import { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { routes } from "@/domains/global/constants/routes";
import PageLayout from "@/domains/global/components/PageLayout";
import Snackbar from "./design-system/Snackbar";

export default function App() {
  return (
    <Router>
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
      <Snackbar />
    </Router>
  );
}
