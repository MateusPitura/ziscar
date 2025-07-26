import { RouterProvider } from "react-router-dom";
import { GlobalProvider } from "./domains/global/contexts/GlobalContext";
import Snackbar from "./design-system/Snackbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ErrorBoundary from "./ErrorBoundary";
import { QueryKeys } from "./domains/global/types";
import { router } from "./router";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

declare module "@tanstack/react-query" {
  interface Register {
    queryKey: [QueryKeys, ...ReadonlyArray<unknown>];
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <GlobalProvider>
        <QueryClientProvider client={queryClient}>
          <Snackbar />
          <RouterProvider router={router} />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </GlobalProvider>
    </ErrorBoundary>
  );
}
