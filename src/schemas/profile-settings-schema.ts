import { z } from "zod";

export const profileSettingsFormSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),
  displayName: z
    .string()
    .trim()
    .min(2, "Display name must be at least 2 characters")
    .max(30, "Display name must be 30 characters or fewer"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  bio: z.string().trim().max(160, "Bio must be 160 characters or fewer"),
  partnerName: z.string().trim().max(50, "Partner name must be 50 characters or fewer"),
});

export type ProfileSettingsFormValues = z.infer<typeof profileSettingsFormSchema>;
