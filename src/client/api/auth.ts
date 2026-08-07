import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export async function loginClient(
  payload: LoginPayload,
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", payload, {
    withCredentials: true,
  });

  return response.data;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export async function refreshTokenClient(): Promise<RefreshTokenResponse> {
  const response = await api.post<RefreshTokenResponse>(
    "/auth/refresh",
    undefined,
    { withCredentials: true },
  );

  return response.data;
}

export interface SignUpPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface SignUpResponse {
  message: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    createdAt: string;
  };
}

export async function signUpClient(payload: SignUpPayload) {
  const response = await api.post<SignUpResponse>("/auth/sign-up", payload);

  return response.data;
}

export interface VerifyAccountResponse {
  mesage: string;
}

export async function verifyAccountClient(token: string) {
  const response = await api.get<VerifyAccountResponse>("/auth/verify-email", {
    params: { token },
    withCredentials: true,
  });

  return response.data;
}
