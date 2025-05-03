import { listUsers, ListUsersParams } from "@/api";
import { useAccessToken } from "@/contexts";

import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

// =====================================================================================================================
// QUERIES
// =====================================================================================================================

export const useListUsers = (params: z.infer<typeof ListUsersParams>) => {
  const accessToken = useAccessToken();

  return useQuery({
    queryFn: () => listUsers(accessToken, params),
    queryKey: ["users", "list", params, accessToken],
  });
};
