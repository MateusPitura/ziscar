import { useCallback } from "react";
import useSnackbar from "./useSnackbar";
import { Action, Resource } from "../types/user";
import formatDeniedMessage from "../utils/formatDeniedMessage";
import useGlobalContext from "./useGlobalContext";
import checkPermission from "../utils/checkPermission";

interface Request {
  method?: "get" | "post" | "put" | "patch" | "delete";
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
      { method = "get", body, resource, action }: Request
    ) => {
      try {
        const hasPermission = checkPermission(userLogged, resource, action);
        if (!hasPermission) {
          if (method !== "get") {
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
          body: method != "get" ? JSON.stringify(body) : undefined,
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
