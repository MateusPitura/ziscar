import { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { routes } from "@/utils/constants/routes";

export default function App() {
  return (
    <Router>
      <Suspense fallback={null}>
        <Routes>
          {routes.map((group) =>
            group.routes.map((route) => (
              <Route
                key={route.id}
                path={route.path}
                element={route.entryPage}
              />
            ))
          )}
        </Routes>
      </Suspense>
    </Router>
  );
}
