import { Route, Routes, BrowserRouter } from "react-router-dom";
import { routes } from "@/domains/global/constants/routes";
import PageLayout from "@/domains/global/components/PageLayout";
import { GlobalProvider } from "./domains/global/contexts/GlobalContext";
import SuspensePage from "./domains/global/components/SuspensePage";
import Snackbar from "./design-system/Snackbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import GlobalErrorBoundary from "./ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export default function App() {
  return (
    <>
      <Snackbar />
      <GlobalErrorBoundary>
        <BrowserRouter>
          <GlobalProvider>
            <QueryClientProvider client={queryClient}>
              <Routes>
                <Route element={<PageLayout />}>
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
                </Route>
              </Routes>
              <ReactQueryDevtools />
            </QueryClientProvider>
          </GlobalProvider>
        </BrowserRouter>
      </GlobalErrorBoundary>
    </>
  );
}
