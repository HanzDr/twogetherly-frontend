import axios from "axios";

import { api } from "./auth";

interface CreateSpacePayload {
  name: string;
  partnerEmail: string;
}

interface CreateSpaceResponse {
  message: string;
  inviteCode?: string;
}

interface CreateSpaceErrorResponse {
  message: string;
}

export async function createSpaceClient(payload: CreateSpacePayload) {
  try {
    const response = await api.post<CreateSpaceResponse>("/space/", payload, {
      withCredentials: true,
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError<CreateSpaceErrorResponse>(error) && error.response) {
      const { message } = error.response.data;
      throw new Error(message);
    }

    throw error;
  }
}

interface GetSpaceStatusResponse {
  hasSpace: boolean;
}

export async function getSpaceStatusClient() {
  const response = await api.get<GetSpaceStatusResponse>(`/space/status`, {
    withCredentials: true,
  });

  return response.data;
}

interface RedeemInvitationPayload {
  message: string;
  code: string;
}

interface RedeemInvitationResponse {
  message: string;
  spaceId: string;
}

export async function redeemInvitationClient(payload: RedeemInvitationPayload) {
  try {
    const response = await api.post<RedeemInvitationResponse>(
      "/space/invitations/redeem",
      payload,
      { withCredentials: true },
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError<CreateSpaceErrorResponse>(error) && error.response) {
      const { message } = error.response.data;
      throw new Error(message);
    }

    throw error;
  }
}

interface CreateInvitationPayload {
  spaceId: string;
}

interface CreateInvitationResponse {
  code: string;
  expiresAt: Date;
  expiresInSeconds: number;
}
export async function createInvitationClient(payload: CreateInvitationPayload) {
  try {
    const response = await api.post<CreateInvitationResponse>(
      `/space/${payload}/invitations`,
      { withCredentials: true },
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError<CreateSpaceErrorResponse>(error) && error.response) {
      const { message } = error.response.data;
      throw new Error(message);
    }
  }
}
