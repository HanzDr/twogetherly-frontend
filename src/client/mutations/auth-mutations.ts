import { useMutation } from "@tanstack/react-query";

import {
  loginClient,
  refreshTokenClient,
  signUpClient,
  verifyAccountClient,
} from "@/client/api/auth";

export function useLoginMutation() {
  return useMutation({ mutationFn: loginClient });
}

export function useRefreshTokenMutation() {
  return useMutation({ mutationFn: refreshTokenClient });
}

export function useSignUpMutation() {
  return useMutation({ mutationFn: signUpClient });
}

export function useVerifyAccountMutation() {
  return useMutation({ mutationFn: verifyAccountClient });
}
