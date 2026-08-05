import { z } from "zod";

export const invitePartnerFormSchema = z.discriminatedUnion("mode", [
  z.object({
    mode: z.literal("email"),
    email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
    inviteCode: z.string(),
  }),
  z.object({
    mode: z.literal("code"),
    email: z.string(),
    inviteCode: z
      .string()
      .trim()
      .min(1, "Invite code is required")
      .regex(/^[A-Z0-9-]{6,12}$/i, "Enter a valid invite code, such as LOVE-2847"),
  }),
]);

export type InvitePartnerFormValues = z.infer<typeof invitePartnerFormSchema>;
