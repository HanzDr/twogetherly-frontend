import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Heart, Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useLoginMutation } from "@/client/mutations/auth-mutations";
import { spaceStatusQueryOptions } from "@/client/queries/space-queries";
import { LoginForm } from "@/components/ui/login-form";
import { loginFormSchema, type LoginFormValues } from "@/schemas/auth-schema";

export function LoginPage() {
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const loginMutation = useLoginMutation();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const handleLogin: SubmitHandler<LoginFormValues> = async (values) => {
    setSuccessMessage("");
    form.clearErrors("root");

    try {
      await loginMutation.mutateAsync({
        email: values.email,
        password: values.password,
      });
    } catch {
      form.setError("root", {
        message:
          "Unable to sign in. Check your email and password and try again.",
      });
      return;
    }

    try {
      const { hasSpace } = await queryClient.fetchQuery(spaceStatusQueryOptions);

      navigate(hasSpace ? "/dashboard" : "/partner-setup", { replace: true });
    } catch {
      form.setError("root", {
        message:
          "You are signed in, but we could not load your space. Please try again.",
      });
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-rose-50 via-white to-pink-100 px-5 py-10 sm:px-8">
      <div className="pointer-events-none absolute -left-28 -top-28 size-80 rounded-full bg-rose-300/35 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-36 -right-24 size-96 rounded-full bg-pink-300/40 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden max-w-xl lg:block">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/70 px-4 py-2 text-sm font-medium text-rose-700 shadow-sm">
            <Sparkles className="size-4" aria-hidden="true" />
            Made for meaningful connections
          </div>
          <h1 className="text-6xl font-semibold leading-[1.05] tracking-[-0.05em] text-rose-950">
            Life is better when we’re
            <span className="text-rose-500"> together.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-rose-950/60">
            Share moments, make plans, and stay close to your favorite
            people—all in one warm little corner of the internet.
          </p>
          <div className="mt-10 flex items-center gap-3 text-sm font-medium text-rose-950/50">
            <span className="flex -space-x-2" aria-hidden="true">
              {["bg-rose-300", "bg-pink-400", "bg-red-300"].map((color) => (
                <span
                  key={color}
                  className={`flex size-9 items-center justify-center rounded-full border-2 border-white ${color}`}
                >
                  <Heart className="size-4 fill-white text-white" />
                </span>
              ))}
            </span>
            A place for your people
          </div>
        </section>

        <section
          className="flex justify-center lg:justify-end"
          aria-label="Login"
        >
          <LoginForm
            form={form}
            onSubmit={handleLogin}
            successMessage={successMessage}
          />
        </section>
      </div>
    </main>
  );
}
