import { useCallback } from "react";
import { baseUrl } from "../constants/requests";
import useSnackbar from "./useSnackbar";
import useGlobalContext from "./useGlobalContext";

interface Request {
  path: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
}

export default function useSafeFetch() {
  const { userLogged, clientLogged } = useGlobalContext();

  const { showErrorSnackbar } = useSnackbar();

  const safeFetch = useCallback(
    async ({ path, method = "GET", body }: Request) => {
      try {
        const response = await fetch(`${baseUrl}${path}`, {
          method,
          headers: {
            "Content-Type": "application/json",
            "User-Logged": JSON.stringify(userLogged),
            "Client-Logged": JSON.stringify(clientLogged),
          },
          body: method != "GET" ? JSON.stringify(body) : undefined,
        });
        if (!response.ok) {
          const content = await response.text();
          throw new Error(content || "Erro ao realizar a requisição");
        }
        return await response.json();
      } catch (error) {
        let description = undefined;
        if (error instanceof Error) {
          description = error.message;
        }
        showErrorSnackbar({
          title: "Ocorreu um erro",
          description,
        });
        throw error;
      }
    },
    [showErrorSnackbar, userLogged, clientLogged]
  );

  return { safeFetch };
}
