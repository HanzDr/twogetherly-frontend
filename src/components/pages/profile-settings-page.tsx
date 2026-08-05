import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Settings } from "lucide-react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";

import { ProfileSettingsForm } from "@/components/ui/profile-settings-form";
import {
  profileSettingsFormSchema,
  type ProfileSettingsFormValues,
} from "@/schemas/profile-settings-schema";

export function ProfileSettingsPage() {
  const [successMessage, setSuccessMessage] = useState("");
  const form = useForm<ProfileSettingsFormValues>({
    resolver: zodResolver(profileSettingsFormSchema),
    defaultValues: {
      fullName: "Hanz Regalado",
      displayName: "Hanziboo",
      email: "taylor@example.com",
      bio: "Dreaming, planning, and building a beautiful life together.",
      partnerName: "Freiz",
    },
  });

  const handleSaveProfile: SubmitHandler<ProfileSettingsFormValues> = (
    values,
  ) => {
    setSuccessMessage("");

    // Replace this with the application's profile update API call.
    console.info("Profile settings submitted", values);
    form.reset(values);
    setSuccessMessage("Your profile settings have been saved.");
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-rose-50 to-white px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-rose-600 hover:text-rose-700"
        >
          <ArrowLeft className="size-4" aria-hidden="true" /> Back to dashboard
        </Link>
        <header className="mb-7">
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-rose-500">
            <Settings className="size-4" aria-hidden="true" /> Settings
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-rose-950 sm:text-4xl">
            Your profile
          </h1>
          <p className="mt-2 text-rose-950/55">
            Manage how you appear across Twogetherly.
          </p>
        </header>

        <ProfileSettingsForm
          form={form}
          onSubmit={handleSaveProfile}
          successMessage={successMessage}
        />
      </div>
    </main>
  );
}
