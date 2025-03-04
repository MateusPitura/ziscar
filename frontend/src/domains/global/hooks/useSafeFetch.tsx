import { useCallback } from "react";
import useSnackbar from "./useSnackbar";
import formatDeniedMessage from "../utils/formatDeniedMessage";
import useGlobalContext from "./useGlobalContext";
import checkPermission from "../utils/checkPermission";
import { Resource, Action } from "../types/model";

interface Request {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  resource?: Resource;
  action?: Action;
}

export default function useSafeFetch() {
  const { userLogged } = useGlobalContext();
  const { showErrorSnackbar } = useSnackbar();

  const safeFetch = useCallback(
    async (
      path: string,
      { method = "GET", body, resource, action }: Request = {}
    ) => {
      try {
        const hasPermission = checkPermission(userLogged, resource, action);
        if (!hasPermission) {
          if (method !== "GET") {
            throw new Error(formatDeniedMessage({ resource, action }));
          }
          return null;
        }

        const response = await fetch(path, {
          method,
          headers: {
            "Content-Type": "application/json",
            // "User-Logged": JSON.stringify(userLogged), // TODO: não enviar informações sensíveis no header, é barrado pelo viaCep. Colocar no JWT
            // "Client-Logged": JSON.stringify(clientLogged),
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
    [showErrorSnackbar, userLogged]
  );

  return { safeFetch };
}
