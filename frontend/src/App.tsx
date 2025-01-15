import { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { routes } from "@/utils/constants/routes";
import PageLayout from "./components/PageLayout";

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
    </Router>
  );
}
