import { useCallback } from "react";
import useSnackbar from "./useSnackbar";
import { formatDeniedMessage } from "@shared/utils/formatDeniedMessage";
import checkPermission from "../utils/checkPermission";
import { Action, Resource } from "@shared/types";
import usePermissions from "./usePermissions";

interface Request {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  resource?: Resource;
  action?: Action;
  enableCookie?: boolean;
  isExport?: boolean;
}

export default function useSafeFetch() {
  const { userPermissions } = usePermissions();
  const { showErrorSnackbar } = useSnackbar();

  const safeFetch = useCallback(
    async (
      path: string,
      {
        method = "GET",
        body,
        resource,
        action,
        enableCookie = true,
        isExport = false,
      }: Request = {}
    ) => {
      try {
        const hasPermission = checkPermission(
          userPermissions,
          resource,
          action
        );
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
          },
          body: method !== "GET" ? JSON.stringify(body) : undefined,
          credentials: enableCookie ? "include" : "omit",
        });

        let content
        if (isExport && response.ok) {
          content = response;
        } else {
          content = await response.json();
        }

        if (!response.ok) {
          throw new Error(content.message || "Falha ao realizar a requisição");
        }
        return content;
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
    [showErrorSnackbar, userPermissions]
  );

  return { safeFetch };
}
