import { api } from "./auth";

interface GetSpaceStatusResponse {
  hasSpace: boolean;
}

export async function getSpaceStatus() {
  const response = await api.get<GetSpaceStatusResponse>(`/space/status`, {
    withCredentials: true,
  });

  return response.data;
}
