import { Permissions } from "@shared/types";
import { useQueryClient } from "@tanstack/react-query";

interface UsePermissionsResponse {
  userPermissions: Permissions | undefined;
}

export default function usePermissions(): UsePermissionsResponse {
  const queryClient = useQueryClient();

  const cachedData = queryClient.getQueryData<Permissions | undefined>([
    "permissions",
  ]);

  return { userPermissions: cachedData };
}
