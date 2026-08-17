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

interface SpaceErrorResponse {
  message: string;
}

export async function createSpaceClient(payload: CreateSpacePayload) {
  try {
    const response = await api.post<CreateSpaceResponse>("/space/", payload, {
      withCredentials: true,
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError<SpaceErrorResponse>(error) && error.response) {
      const { message } = error.response.data;
      throw new Error(message);
    }

    throw error;
  }
}

interface GetSpaceStatusResponse {
  hasSpace: boolean;
  spaceId?: string;
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
    if (axios.isAxiosError<SpaceErrorResponse>(error) && error.response) {
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
      `/space/${payload.spaceId}/invitations`,
      undefined,
      { withCredentials: true },
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError<SpaceErrorResponse>(error) && error.response) {
      const { message } = error.response.data;
      throw new Error(message);
    }

    throw error;
  }
}

export interface GetSpaceDetailsPayload {
  spaceId: string;
}

export interface GetSpaceDetailsResponse {
  id: string;
  name: string;
  invitedPartnerEmail: string | null;
  createdAt: string;
  updatedAt: string;
  users: {
    joinedAt: string;
    user: {
      email: string;
      id: string;
      fullName: string;
      emailVerifiedAt: string | null;
    };
  }[];
}

export async function getSpaceDetailsClient(payload: GetSpaceDetailsPayload) {
  try {
    const response = await api.get<GetSpaceDetailsResponse | null>(
      `/space/${payload.spaceId}`,
      { withCredentials: true },
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError<SpaceErrorResponse>(error) && error.response) {
      const { message } = error.response.data;
      throw new Error(message);
    }

    throw error;
  }
}
