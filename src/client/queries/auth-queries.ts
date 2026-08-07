import { useQuery } from "@tanstack/react-query";

import { getCurrentUserClient } from "@/client/api/auth";

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: ["auth", "current-user"],
    queryFn: getCurrentUserClient,
  });
}
