import { BrowserRouter } from "react-router-dom";
import { GlobalProvider } from "./domains/global/contexts/GlobalContext";
import Snackbar from "./design-system/Snackbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import GlobalErrorBoundary from "./ErrorBoundary";
import { QueryKeys } from "./domains/global/types";
import RoutesContainer from "./RoutesContainer";

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
    queryKey: QueryKeys;
  }
}

export default function App() {
  return (
    <GlobalErrorBoundary>
      <BrowserRouter>
        <GlobalProvider>
          <QueryClientProvider client={queryClient}>
            <Snackbar />
            <RoutesContainer />
            <ReactQueryDevtools />
          </QueryClientProvider>
        </GlobalProvider>
      </BrowserRouter>
    </GlobalErrorBoundary>
  );
}
