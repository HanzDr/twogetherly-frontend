import { zodResolver } from "@hookform/resolvers/zod";
import { Heart, Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { signUpClient } from "@/client/api/auth";
import { SignUpForm } from "@/components/ui/sign-up-form";
import { signUpSchema, type signUpFormValues } from "@/schemas/auth-schema";

export function SignUpPage() {
  const [successMessage, setSuccessMessage] = useState("");
  const form = useForm<signUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const handleSignUp: SubmitHandler<signUpFormValues> = async (values) => {
    setSuccessMessage("");
    form.clearErrors("root");

    try {
      await signUpClient({
        fullName: values.name,
        email: values.email,
        password: values.password,
      });

      setSuccessMessage(
        `Account created! We sent a verification email to ${values.email}. Please check your inbox and verify your account before signing in.`,
      );
      sessionStorage.removeItem("twogetherly:partner-linked");
    } catch {
      form.setError("root", {
        message: "Unable to create your account. Please try again.",
      });
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-pink-100 via-white to-rose-100 px-5 py-10 sm:px-8">
      <div className="pointer-events-none absolute -left-28 -top-28 size-80 rounded-full bg-pink-300/35 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-36 -right-24 size-96 rounded-full bg-rose-300/40 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="hidden max-w-lg lg:block">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/70 px-4 py-2 text-sm font-medium text-rose-700 shadow-sm">
            <Sparkles className="size-4" aria-hidden="true" />
            Your people are waiting
          </div>
          <h1 className="text-6xl font-semibold leading-[1.05] tracking-[-0.05em] text-rose-950">
            Start making memories
            <span className="text-rose-500"> together.</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-rose-950/60">
            One account, one welcoming space, and countless ways to stay
            connected.
          </p>
          <Heart
            className="mt-10 size-12 fill-rose-400 text-rose-400"
            aria-hidden="true"
          />
        </section>

        <section
          className="flex justify-center lg:justify-end"
          aria-label="Create an account"
        >
          <SignUpForm
            form={form}
            onSubmit={handleSignUp}
            successMessage={successMessage}
          />
        </section>
      </div>
    </main>
  );
}
