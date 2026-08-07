import { queryOptions, useQuery } from "@tanstack/react-query";

import { getSpaceStatusClient } from "@/client/api/space";

export const spaceStatusQueryOptions = queryOptions({
  queryKey: ["space", "status"],
  queryFn: getSpaceStatusClient,
});

export function useSpaceStatusQuery() {
  return useQuery(spaceStatusQueryOptions);
}
