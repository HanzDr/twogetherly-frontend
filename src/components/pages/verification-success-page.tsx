import axios from "axios";
import { Check, CircleX, Heart, LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { verifyAccountClient } from "@/client/api/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function VerificationSuccessPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const verificationStarted = useRef(false);

  useEffect(() => {
    if (verificationStarted.current) return;
    verificationStarted.current = true;

    const token = searchParams.get("token");

    if (!token) {
      setErrorMessage("This verification link is invalid because it is missing a token.");
      setStatus("error");
      return;
    }

    void verifyAccountClient(token)
      .then(() => setStatus("success"))
      .catch((error: unknown) => {
        const apiMessage = axios.isAxiosError<{ message?: string }>(error)
          ? error.response?.data?.message
          : undefined;

        setErrorMessage(
          apiMessage ??
            "We could not verify your account. The link may be invalid or expired.",
        );
        setStatus("error");
      });
  }, [searchParams]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-pink-100 via-white to-rose-100 px-5 py-10 sm:px-8">
      <div className="pointer-events-none absolute -left-28 -top-28 size-80 rounded-full bg-pink-300/35 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-36 -right-24 size-96 rounded-full bg-rose-300/40 blur-3xl" />

      <Card className="relative w-full max-w-md gap-6 border-rose-100 bg-white/90 py-10 text-center shadow-2xl shadow-rose-950/10 backdrop-blur-xl sm:px-4">
        <CardHeader className="items-center gap-4">
          <div
            className={`relative flex size-20 items-center justify-center rounded-full ${
              status === "error"
                ? "bg-red-100 text-red-600"
                : status === "success"
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-rose-100 text-rose-500"
            }`}
          >
            {status === "loading" && (
              <LoaderCircle className="size-10 animate-spin" aria-hidden="true" />
            )}
            {status === "success" && (
              <>
                <Check className="size-10 stroke-[3]" aria-hidden="true" />
                <span className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full border-4 border-white bg-rose-500 text-white">
                  <Heart className="size-4 fill-current" aria-hidden="true" />
                </span>
              </>
            )}
            {status === "error" && <CircleX className="size-10" aria-hidden="true" />}
          </div>
          <div>
            <CardTitle className="text-3xl font-semibold tracking-tight text-rose-950">
              {status === "loading"
                ? "Verifying your email..."
                : status === "success"
                  ? "Email verified!"
                  : "Verification failed"}
            </CardTitle>
            <CardDescription className="mt-3 text-base leading-7 text-rose-950/60">
              {status === "loading"
                ? "Please wait while we confirm your account."
                : status === "success"
                  ? "Your Twogetherly account is now verified and ready to use."
                  : errorMessage}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {status !== "loading" && (
            <Link
              to={status === "success" ? "/login" : "/sign-up"}
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-rose-500 px-4 text-sm font-medium text-white shadow-lg shadow-rose-200 transition hover:bg-rose-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-200"
            >
              {status === "success" ? "Continue to sign in" : "Back to sign up"}
            </Link>
          )}
          {status === "success" && (
            <p className="mt-5 text-sm text-rose-950/45">
              Welcome to your new space for meaningful connections.
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
