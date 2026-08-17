import { useMutation } from "@tanstack/react-query";

import {
  createInvitationClient,
  createSpaceClient,
  redeemInvitationClient,
} from "@/client/api/space";

export function useCreateSpaceMutation() {
  return useMutation({ mutationFn: createSpaceClient });
}

export function useRedeemInvitationMutation() {
  return useMutation({ mutationFn: redeemInvitationClient });
}

export function useCreateInviteMutation() {
  return useMutation({ mutationFn: createInvitationClient });
}
