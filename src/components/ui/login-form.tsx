import { Eye, EyeOff, Heart } from "lucide-react";
import { useState } from "react";
import type { SubmitHandler, UseFormReturn } from "react-hook-form";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { LoginFormValues } from "@/schemas/auth-schema";

type LoginFormProps = {
  form: UseFormReturn<LoginFormValues>;
  onSubmit: SubmitHandler<LoginFormValues>;
  successMessage?: string;
};

export function LoginForm({ form, onSubmit, successMessage }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <Card className="w-full max-w-md gap-6 border-rose-100 bg-white/90 py-8 shadow-2xl shadow-rose-950/10 ring-rose-100 backdrop-blur-xl sm:px-2">
      <CardHeader className="gap-3 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-200">
          <Heart className="size-6 fill-current" aria-hidden="true" />
        </div>
        <div>
          <CardTitle className="text-2xl font-semibold tracking-tight text-rose-950">
            Welcome back
          </CardTitle>
          <CardDescription className="mt-2 text-rose-950/55">
            Sign in and get back to the people who matter.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-2">
            <label className="text-sm font-medium text-rose-950" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className="h-11 w-full rounded-xl border border-rose-100 bg-rose-50/40 px-3 text-rose-950 outline-none transition placeholder:text-rose-950/30 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 aria-invalid:border-red-500 aria-invalid:ring-red-100"
              {...register("email")}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-red-600" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <label className="text-sm font-medium text-rose-950" htmlFor="password">
                Password
              </label>
              <a className="text-sm font-medium text-rose-600 hover:text-rose-700" href="#forgot-password">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "password-error" : undefined}
                className="h-11 w-full rounded-xl border border-rose-100 bg-rose-50/40 px-3 pr-11 text-rose-950 outline-none transition placeholder:text-rose-950/30 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 aria-invalid:border-red-500 aria-invalid:ring-red-100"
                {...register("password")}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-rose-950/45 transition hover:text-rose-600"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="text-sm text-red-600" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-rose-950/65">
            <input
              type="checkbox"
              className="size-4 rounded border-rose-200 accent-rose-500"
              {...register("rememberMe")}
            />
            Remember me
          </label>

          {errors.root && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
              {errors.root.message}
            </p>
          )}

          {successMessage && (
            <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700" role="status">
              {successMessage}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="h-11 w-full rounded-xl bg-rose-500 text-white shadow-lg shadow-rose-200 hover:bg-rose-600"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>

          <p className="text-center text-sm text-rose-950/55">
            New to Twogetherly?{" "}
            <Link className="font-semibold text-rose-600 hover:text-rose-700" to="/sign-up">
              Create an account
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
