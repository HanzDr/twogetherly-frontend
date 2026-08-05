import { Eye, EyeOff, HeartHandshake } from "lucide-react";
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
import type { signUpFormValues } from "@/schemas/auth-schema";

type SignUpFormProps = {
  form: UseFormReturn<signUpFormValues>;
  onSubmit: SubmitHandler<signUpFormValues>;
  successMessage?: string;
};

export function SignUpForm({ form, onSubmit, successMessage }: SignUpFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const fields = [
    { id: "name", label: "Full name", type: "text", placeholder: "Your name", autoComplete: "name" },
    { id: "email", label: "Email address", type: "email", placeholder: "you@example.com", autoComplete: "email" },
  ] as const;

  return (
    <Card className="w-full max-w-lg gap-6 border-rose-100 bg-white/90 py-8 shadow-2xl shadow-rose-950/10 ring-rose-100 backdrop-blur-xl sm:px-2">
      <CardHeader className="gap-3 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-200">
          <HeartHandshake className="size-6" aria-hidden="true" />
        </div>
        <div>
          <CardTitle className="text-2xl font-semibold tracking-tight text-rose-950">
            Join Togetherly
          </CardTitle>
          <CardDescription className="mt-2 text-rose-950/55">
            Create your account and make every moment feel closer.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          {fields.map((field) => {
            const error = errors[field.id];
            return (
              <div className="space-y-2" key={field.id}>
                <label className="text-sm font-medium text-rose-950" htmlFor={`sign-up-${field.id}`}>
                  {field.label}
                </label>
                <input
                  id={`sign-up-${field.id}`}
                  type={field.type}
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? `sign-up-${field.id}-error` : undefined}
                  className="h-11 w-full rounded-xl border border-rose-100 bg-rose-50/40 px-3 text-rose-950 outline-none transition placeholder:text-rose-950/30 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 aria-invalid:border-red-500 aria-invalid:ring-red-100"
                  {...register(field.id)}
                />
                {error && (
                  <p id={`sign-up-${field.id}-error`} className="text-sm text-red-600" role="alert">
                    {error.message}
                  </p>
                )}
              </div>
            );
          })}

          <div className="grid gap-4 sm:grid-cols-2">
            {(["password", "confirmPassword"] as const).map((fieldName) => {
              const error = errors[fieldName];
              const label = fieldName === "password" ? "Password" : "Confirm password";
              return (
                <div className="space-y-2" key={fieldName}>
                  <label className="text-sm font-medium text-rose-950" htmlFor={`sign-up-${fieldName}`}>
                    {label}
                  </label>
                  <div className="relative">
                    <input
                      id={`sign-up-${fieldName}`}
                      type={showPassword ? "text" : "password"}
                      autoComplete={fieldName === "password" ? "new-password" : "new-password"}
                      placeholder={fieldName === "password" ? "Create password" : "Repeat password"}
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? `sign-up-${fieldName}-error` : undefined}
                      className="h-11 w-full rounded-xl border border-rose-100 bg-rose-50/40 px-3 pr-10 text-rose-950 outline-none transition placeholder:text-rose-950/30 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 aria-invalid:border-red-500 aria-invalid:ring-red-100"
                      {...register(fieldName)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-rose-950/45 hover:text-rose-600"
                      onClick={() => setShowPassword((visible) => !visible)}
                      aria-label={showPassword ? "Hide passwords" : "Show passwords"}
                    >
                      {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                    </button>
                  </div>
                  {error && (
                    <p id={`sign-up-${fieldName}-error`} className="text-sm text-red-600" role="alert">
                      {error.message}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div>
            <label className="flex cursor-pointer items-start gap-2 text-sm leading-5 text-rose-950/65">
              <input type="checkbox" className="mt-0.5 size-4 accent-rose-500" {...register("acceptTerms")} />
              <span>I agree to the Terms of Service and Privacy Policy.</span>
            </label>
            {errors.acceptTerms && (
              <p className="mt-2 text-sm text-red-600" role="alert">{errors.acceptTerms.message}</p>
            )}
          </div>

          {successMessage && (
            <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700" role="status">
              {successMessage}
            </p>
          )}

          <Button type="submit" size="lg" disabled={isSubmitting} className="h-11 w-full rounded-xl bg-rose-500 text-white shadow-lg shadow-rose-200 hover:bg-rose-600">
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>

          <p className="text-center text-sm text-rose-950/55">
            Already have an account?{" "}
            <Link className="font-semibold text-rose-600 hover:text-rose-700" to="/login">
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
