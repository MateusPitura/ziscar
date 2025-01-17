import { useCallback } from "react";
import { baseUrl } from "../constants/requests";
import useSnackbar from "./useSnackbar";

interface Request {
  path: string;
}

export default function useFetch() {
  const { showErrorSnackbar } = useSnackbar();

  const request = useCallback(
    async ({ path }: Request) => {
      try {
        const response = await fetch(`${baseUrl}${path}`);
        const data = await response.json();
        return data;
      } catch (error) {
        if (error instanceof Error) {
          showErrorSnackbar({
            title: "Ocorreu um erro",
            description: error.message,
          });
          return;
        }
        showErrorSnackbar({
          title: "Ocorreu um erro",
        });
      }
    },
    [showErrorSnackbar]
  );

  return { request };
}
