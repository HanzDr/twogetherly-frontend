import {
  ArrowRight,
  Copy,
  Heart,
  Link2,
  Mail,
  Sparkles,
  Users,
} from "lucide-react";
import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCreateSpaceMutation } from "@/client/mutations/space-mutations";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SetupMode = "choose" | "create" | "join";

export function PartnerOnboardingPage() {
  const navigate = useNavigate();
  const createSpaceMutation = useCreateSpaceMutation();
  const [mode, setMode] = useState<SetupMode>("choose");
  const [spaceName, setSpaceName] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [createdCode, setCreatedCode] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const finishSetup = () => {
    sessionStorage.setItem("twogetherly:partner-linked", "true");
    navigate("/dashboard", { replace: true });
  };

  const createSpace = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setStatus("");

    if (spaceName.trim().length < 2) {
      setError("Give your shared space a name.");
      return;
    }
    if (partnerEmail && !/^\S+@\S+\.\S+$/.test(partnerEmail)) {
      setError("Enter a valid partner email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createSpaceMutation.mutateAsync({
        name: spaceName.trim(),
        partnerEmail: partnerEmail.trim(),
      });

      setCreatedCode(response.inviteCode ?? "");
      setStatus(response.message);
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : "");
    } finally {
      setIsSubmitting(false);
    }
  };

  const joinSpace = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^[A-Z0-9-]{6,12}$/i.test(inviteCode.trim())) {
      setError("Enter a valid invite code, such as LOVE-2847.");
      return;
    }
    setError("");
    setStatus("Invite accepted! Your shared space is ready.");
  };

  const chooseMode = (nextMode: SetupMode) => {
    setMode(nextMode);
    setError("");
    setStatus("");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-rose-50 via-white to-pink-100 px-5 py-10 sm:px-8">
      <div className="pointer-events-none absolute -left-24 -top-24 size-80 rounded-full bg-rose-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-20 size-96 rounded-full bg-pink-300/35 blur-3xl" />
      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-4xl flex-col justify-center">
        <header className="mx-auto mb-8 max-w-2xl text-center">
          <span className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-xl shadow-rose-200">
            <Heart className="size-7 fill-current" aria-hidden="true" />
          </span>
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-rose-500">
            One last step
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-rose-950 sm:text-5xl">
            Who are you building with?
          </h1>
          <p className="mt-3 text-rose-950/55">
            Create a private space for the two of you, or join the one your
            partner already made.
          </p>
        </header>

        {mode === "choose" && (
          <section className="grid gap-5 md:grid-cols-2">
            <button
              type="button"
              onClick={() => chooseMode("create")}
              className="group rounded-3xl border border-rose-100 bg-white p-7 text-left shadow-lg shadow-rose-950/5 transition hover:-translate-y-1 hover:border-rose-300 hover:shadow-xl"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                <Users aria-hidden="true" />
              </span>
              <h2 className="mt-6 text-xl font-semibold text-rose-950">
                Create our space
              </h2>
              <p className="mt-2 leading-6 text-rose-950/55">
                Start a new shared environment and invite your partner by email
                or code.
              </p>
              <span className="mt-6 flex items-center gap-2 font-medium text-rose-600">
                Get started{" "}
                <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </span>
            </button>
            <button
              type="button"
              onClick={() => chooseMode("join")}
              className="group rounded-3xl border border-rose-100 bg-white p-7 text-left shadow-lg shadow-rose-950/5 transition hover:-translate-y-1 hover:border-rose-300 hover:shadow-xl"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
                <Link2 aria-hidden="true" />
              </span>
              <h2 className="mt-6 text-xl font-semibold text-rose-950">
                Join my partner
              </h2>
              <p className="mt-2 leading-6 text-rose-950/55">
                Already received an invitation? Enter the code to connect
                instantly.
              </p>
              <span className="mt-6 flex items-center gap-2 font-medium text-rose-600">
                Enter a code{" "}
                <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </span>
            </button>
          </section>
        )}

        {mode !== "choose" && (
          <Card className="mx-auto w-full max-w-xl gap-6 border-rose-100 bg-white py-7 shadow-2xl shadow-rose-950/10 ring-rose-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl text-rose-950">
                {mode === "create" ? (
                  <Sparkles className="text-rose-500" />
                ) : (
                  <Link2 className="text-rose-500" />
                )}
                {mode === "create"
                  ? "Create your shared space"
                  : "Join a shared space"}
              </CardTitle>
              <CardDescription>
                {mode === "create"
                  ? "You can invite your partner now or share the code later."
                  : "Ask your partner for the invite code shown in their Twogetherly space."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-5"
                onSubmit={mode === "create" ? createSpace : joinSpace}
                noValidate
              >
                {mode === "create" ? (
                  <>
                    <div className="space-y-2">
                      <label
                        htmlFor="space-name"
                        className="text-sm font-medium text-rose-950"
                      >
                        Space name
                      </label>
                      <input
                        id="space-name"
                        value={spaceName}
                        onChange={(event) => setSpaceName(event.target.value)}
                        placeholder="Taylor & Freiz"
                        className="h-11 w-full rounded-xl border border-rose-100 bg-rose-50/40 px-3 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="partner-email"
                        className="flex items-center gap-2 text-sm font-medium text-rose-950"
                      >
                        <Mail className="size-4" /> Partner's email{" "}
                        <span className="font-normal text-rose-950/40">
                          (optional)
                        </span>
                      </label>
                      <input
                        id="partner-email"
                        type="email"
                        value={partnerEmail}
                        onChange={(event) =>
                          setPartnerEmail(event.target.value)
                        }
                        placeholder="partner@example.com"
                        className="h-11 w-full rounded-xl border border-rose-100 bg-rose-50/40 px-3 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <label
                      htmlFor="invite-code"
                      className="text-sm font-medium text-rose-950"
                    >
                      Invite code
                    </label>
                    <input
                      id="invite-code"
                      value={inviteCode}
                      onChange={(event) =>
                        setInviteCode(event.target.value.toUpperCase())
                      }
                      placeholder="LOVE-2847"
                      className="h-12 w-full rounded-xl border border-rose-100 bg-rose-50/40 px-3 text-center text-lg font-semibold uppercase tracking-[0.2em] outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
                    />
                  </div>
                )}

                {createdCode && (
                  <div className="rounded-xl bg-rose-50 p-4 text-center">
                    <p className="text-xs font-semibold uppercase tracking-wider text-rose-500">
                      Your invite code
                    </p>
                    <p className="mt-1 text-2xl font-semibold tracking-widest text-rose-950">
                      {createdCode}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-rose-600"
                      onClick={() =>
                        void navigator.clipboard?.writeText(createdCode)
                      }
                    >
                      <Copy /> Copy code
                    </Button>
                  </div>
                )}
                {error && (
                  <p className="text-sm text-red-600" role="alert">
                    {error}
                  </p>
                )}
                {status && (
                  <p
                    className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700"
                    role="status"
                  >
                    {status}
                  </p>
                )}

                <div className="flex flex-wrap justify-between gap-3 border-t border-rose-100 pt-5">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => chooseMode("choose")}
                  >
                    Back
                  </Button>
                  {status ? (
                    <Button
                      type="button"
                      onClick={finishSetup}
                      className="bg-rose-500 text-white hover:bg-rose-600"
                    >
                      Continue to dashboard <ArrowRight />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-rose-500 text-white hover:bg-rose-600"
                    >
                      {isSubmitting
                        ? "Creating space..."
                        : mode === "create"
                          ? "Create space"
                          : "Join space"}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
