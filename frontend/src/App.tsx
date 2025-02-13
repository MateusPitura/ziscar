import { Route, Routes, BrowserRouter } from "react-router-dom";
import { closeRoutes, openRoutes } from "@/domains/global/constants/routes";
import ClosePageLayout from "@/domains/global/components/ClosePageLayout";
import { GlobalProvider } from "./domains/global/contexts/GlobalContext";
import SuspensePage from "./domains/global/components/SuspensePage";
import Snackbar from "./design-system/Snackbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import GlobalErrorBoundary from "./ErrorBoundary";
import OpenPageLayout from "./domains/global/components/OpenPageLayout";
import { QueryKeys } from "./domains/global/types";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

declare module '@tanstack/react-query' {
  interface Register {
    queryKey: QueryKeys
  }
}

export default function App() {
  return (
    <GlobalErrorBoundary>
      <BrowserRouter>
        <GlobalProvider>
          <QueryClientProvider client={queryClient}>
            <Snackbar />
            <Routes>
              <Route element={<OpenPageLayout />}>
                {openRoutes.map((group) =>
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
              </Route>
              <Route element={<ClosePageLayout />}>
                {closeRoutes.map((group) =>
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
              </Route>
            </Routes>
            <ReactQueryDevtools />
          </QueryClientProvider>
        </GlobalProvider>
      </BrowserRouter>
    </GlobalErrorBoundary>
  );
}
