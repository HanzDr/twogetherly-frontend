import { Heart, Save, UserRound } from "lucide-react";
import type { SubmitHandler, UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ProfileSettingsFormValues } from "@/schemas/profile-settings-schema";

type ProfileSettingsFormProps = {
  form: UseFormReturn<ProfileSettingsFormValues>;
  onSubmit: SubmitHandler<ProfileSettingsFormValues>;
  successMessage?: string;
};

const inputClassName = "h-11 w-full rounded-xl border border-rose-100 bg-rose-50/40 px-3 text-rose-950 outline-none transition placeholder:text-rose-950/30 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 aria-invalid:border-red-500 aria-invalid:ring-red-100";

export function ProfileSettingsForm({ form, onSubmit, successMessage }: ProfileSettingsFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = form;
  const displayName = watch("displayName");
  const initials = displayName
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase() || "T";

  return (
    <Card className="w-full gap-7 border-rose-100 bg-white py-7 shadow-xl shadow-rose-950/5 ring-rose-100">
      <CardHeader className="gap-5 border-b border-rose-100 pb-6 sm:grid-cols-[auto_1fr] sm:items-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-linear-to-br from-rose-400 to-pink-600 text-2xl font-semibold text-white shadow-lg shadow-rose-200">
          {initials}
        </div>
        <div>
          <CardTitle className="flex items-center gap-2 text-2xl font-semibold text-rose-950">
            <UserRound className="size-5 text-rose-500" aria-hidden="true" />
            Profile details
          </CardTitle>
          <CardDescription className="mt-2 text-rose-950/55">
            Keep your personal details and Twogetherly profile up to date.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-rose-950" htmlFor="profile-full-name">Full name</label>
              <input id="profile-full-name" autoComplete="name" aria-invalid={Boolean(errors.fullName)} className={inputClassName} {...register("fullName")} />
              {errors.fullName && <p className="text-sm text-red-600" role="alert">{errors.fullName.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-rose-950" htmlFor="profile-display-name">Display name</label>
              <input id="profile-display-name" autoComplete="nickname" aria-invalid={Boolean(errors.displayName)} className={inputClassName} {...register("displayName")} />
              {errors.displayName && <p className="text-sm text-red-600" role="alert">{errors.displayName.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-rose-950" htmlFor="profile-email">Email address</label>
            <input id="profile-email" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} className={inputClassName} {...register("email")} />
            {errors.email && <p className="text-sm text-red-600" role="alert">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <label className="text-sm font-medium text-rose-950" htmlFor="profile-bio">Bio</label>
              <span className="text-xs text-rose-950/40">{watch("bio").length}/160</span>
            </div>
            <textarea id="profile-bio" rows={4} placeholder="A little about you..." aria-invalid={Boolean(errors.bio)} className={`${inputClassName} h-auto resize-none py-3`} {...register("bio")} />
            {errors.bio && <p className="text-sm text-red-600" role="alert">{errors.bio.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-rose-950" htmlFor="profile-partner">
              <Heart className="size-4 fill-rose-400 text-rose-400" aria-hidden="true" /> Partner's name
            </label>
            <input id="profile-partner" placeholder="Your goal partner" aria-invalid={Boolean(errors.partnerName)} className={inputClassName} {...register("partnerName")} />
            {errors.partnerName && <p className="text-sm text-red-600" role="alert">{errors.partnerName.message}</p>}
          </div>

          {successMessage && (
            <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700" role="status">{successMessage}</p>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-rose-100 pt-5 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" disabled={!isDirty || isSubmitting} onClick={() => reset()} className="border-rose-200">
              Discard changes
            </Button>
            <Button type="submit" disabled={!isDirty || isSubmitting} className="bg-rose-500 text-white hover:bg-rose-600">
              <Save aria-hidden="true" />
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
