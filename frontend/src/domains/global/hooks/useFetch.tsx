import { useCallback } from "react";
import { baseUrl } from "../constants/requests";
import useSnackbar from "./useSnackbar";
import useGlobalContext from "./useGlobalContext";

interface Request {
  path: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: object;
}

export default function useFetch() {
  const { userLogged, clientLogged } = useGlobalContext();

  const { showErrorSnackbar } = useSnackbar();

  const request = useCallback(
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
          throw new Error("Erro ao realizar a requisição"); // TODO: exibir a mensagem de erro
        }
        return await response.json();
      } catch (error) {
        if (error instanceof Error) {
          showErrorSnackbar({
            title: "Ocorreu um erro",
            description: error.message,
          });
        } else {
          showErrorSnackbar({
            title: "Ocorreu um erro",
          });
        }
        return null; // TODO: uma request que deu certo também poderia retornar null, melhorar isso
      }
    },
    [showErrorSnackbar, userLogged, clientLogged]
  );

  return { request };
}
