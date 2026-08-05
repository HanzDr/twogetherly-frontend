import { z } from "zod";

export const createGoalFormSchema = z
  .object({
    name: z.string().trim().min(2, "Goal name must be at least 2 characters"),
    description: z.string().trim().max(160, "Keep the description under 160 characters"),
    targetAmount: z
      .number({ invalid_type_error: "Enter a valid target amount" })
      .positive("Target amount must be greater than zero"),
    startDate: z
      .string()
      .refine((value) => !value || !Number.isNaN(Date.parse(value)), "Enter a valid start date")
      .optional(),
    deadline: z
      .string()
      .refine((value) => !value || !Number.isNaN(Date.parse(value)), "Enter a valid deadline")
      .optional(),
  })
  .refine(
    (values) => !values.startDate || !values.deadline || values.startDate <= values.deadline,
    { message: "Deadline must be on or after the start date", path: ["deadline"] },
  );

export type createGoalFormValues = z.infer<typeof createGoalFormSchema>;

export const editGoalFormSchema = z
  .object({
    name: z.string().trim().min(2, "Goal name must be at least 2 characters"),
    description: z.string().trim().max(160, "Keep the description under 160 characters"),
    targetAmount: z
      .number({ invalid_type_error: "Enter a valid target amount" })
      .positive("Target amount must be greater than zero"),
    startDate: z
      .string()
      .refine((value) => !value || !Number.isNaN(Date.parse(value)), "Enter a valid start date")
      .optional(),
    deadline: z
      .string()
      .refine((value) => !value || !Number.isNaN(Date.parse(value)), "Enter a valid deadline")
      .optional(),
  })
  .refine(
    (values) => !values.startDate || !values.deadline || values.startDate <= values.deadline,
    { message: "Deadline must be on or after the start date", path: ["deadline"] },
  );

export type editGoalFormValues = z.infer<typeof editGoalFormSchema>;

export const addContributionFormSchema = z.object({
  amount: z
    .number({ invalid_type_error: "Enter a valid contribution amount" })
    .positive("Contribution must be greater than zero"),
  note: z.string().trim().max(120, "Keep your note under 120 characters"),
  photo: z
    .custom<File>((value) => value instanceof File, "Please choose a valid image file")
    .refine((file) => file.type.startsWith("image/"), "Only image files are allowed")
    .refine((file) => file.size <= 5 * 1024 * 1024, "Photo must be smaller than 5 MB")
    .optional(),
});

export type addContributionFormValues = z.infer<typeof addContributionFormSchema>;
