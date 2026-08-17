import { queryOptions, useQuery } from "@tanstack/react-query";

import {
  getSpaceDetailsClient,
  getSpaceStatusClient,
} from "@/client/api/space";

export const spaceStatusQueryOptions = queryOptions({
  queryKey: ["space", "status"],
  queryFn: getSpaceStatusClient,
});

export function useSpaceStatusQuery() {
  return useQuery(spaceStatusQueryOptions);
}

export function spaceDetailsQueryOptions(spaceId: string) {
  return queryOptions({
    queryKey: ["space", "details", spaceId],
    queryFn: () => getSpaceDetailsClient({ spaceId }),
  });
}

export function useSpaceDetailsQuery(spaceId?: string) {
  return useQuery({
    ...spaceDetailsQueryOptions(spaceId ?? ""),
    enabled: Boolean(spaceId),
  });
}
