import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, KeyRound, Mail, RefreshCw, Send, UserPlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { invitePartnerFormSchema, type InvitePartnerFormValues } from "@/schemas/linking-schema";

type InviteMode = "email" | "code";

type InvitePartnerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (message: string) => void;
};

function generateInviteCode() {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const suffix = Array.from({ length: 6 }, () => characters[Math.floor(Math.random() * characters.length)]).join("");
  return `TGLY-${suffix}`;
}

export function InvitePartnerModal({
  isOpen,
  onClose,
  onComplete,
}: InvitePartnerModalProps) {
  const [copied, setCopied] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(generateInviteCode);
  const form = useForm<InvitePartnerFormValues>({
    resolver: zodResolver(invitePartnerFormSchema),
    defaultValues: { mode: "email", email: "", inviteCode: "" },
  });
  const { register, handleSubmit, setValue, clearErrors, reset, control, formState: { errors } } = form;
  const mode = useWatch({ control, name: "mode" });

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const submitInvite: SubmitHandler<InvitePartnerFormValues> = (values) => {
    if (values.mode === "email") {
      onComplete(`An invitation was sent to ${values.email}.`);
    } else {
      onComplete(`Invite code ${values.inviteCode.toUpperCase()} was accepted.`);
    }
    reset();
    onClose();
  };

  const changeMode = (nextMode: InviteMode) => {
    setValue("mode", nextMode);
    if (nextMode === "code") setValue("inviteCode", generatedCode);
    clearErrors();
    setCopied(false);
  };

  const copyCode = async () => {
    await navigator.clipboard?.writeText(generatedCode);
    setCopied(true);
  };

  const regenerateCode = () => {
    const nextCode = generateInviteCode();
    setGeneratedCode(nextCode);
    setValue("inviteCode", nextCode);
    setCopied(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-rose-950/40 p-4 backdrop-blur-sm" onMouseDown={(event) => event.currentTarget === event.target && onClose()}>
      <Card className="w-full max-w-lg gap-6 border-rose-100 bg-white py-6 shadow-2xl ring-rose-100" role="dialog" aria-modal="true" aria-labelledby="invite-partner-title">
        <CardHeader className="relative gap-3 pr-14">
          <span className="flex size-11 items-center justify-center rounded-xl bg-rose-100 text-rose-600"><UserPlus aria-hidden="true" /></span>
          <div>
            <CardTitle id="invite-partner-title" className="text-2xl text-rose-950">Invite your partner</CardTitle>
            <CardDescription className="mt-1">Send an email invitation or connect using an invite code.</CardDescription>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} className="absolute right-4 top-0" aria-label="Close invite modal"><X /></Button>
        </CardHeader>

        <CardContent>
          <div className="mb-5 grid grid-cols-2 rounded-xl bg-rose-50 p-1">
            <button type="button" onClick={() => changeMode("email")} className={`flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-medium transition ${mode === "email" ? "bg-white text-rose-700 shadow-sm" : "text-rose-950/50"}`}><Mail className="size-4" /> Email</button>
            <button type="button" onClick={() => changeMode("code")} className={`flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-medium transition ${mode === "code" ? "bg-white text-rose-700 shadow-sm" : "text-rose-950/50"}`}><KeyRound className="size-4" /> Invite code</button>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(submitInvite)} noValidate>
            {mode === "email" ? (
              <div className="space-y-2">
                <label htmlFor="invite-email" className="text-sm font-medium text-rose-950">Partner's email</label>
                <input id="invite-email" type="email" autoFocus placeholder="partner@example.com" aria-invalid={Boolean(errors.email)} className="h-11 w-full rounded-xl border border-rose-100 bg-rose-50/40 px-3 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 aria-invalid:border-red-500" {...register("email")} />
                <p className="text-xs text-rose-950/45">They'll receive a link to join your shared Togetherly space.</p>
                {errors.email && <p className="text-sm text-red-600" role="alert">{errors.email.message}</p>}
              </div>
            ) : (
              <div className="rounded-2xl border border-rose-100 bg-rose-50 p-6 text-center">
                <span className="mx-auto flex size-11 items-center justify-center rounded-xl bg-white text-rose-600 shadow-sm"><KeyRound aria-hidden="true" /></span>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-rose-500">Your generated invite code</p>
                <p className="mt-2 text-2xl font-semibold tracking-[0.18em] text-rose-950">{generatedCode}</p>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-rose-950/50">Send this code to your partner. They can paste it into the join screen on their device.</p>
                <input type="hidden" {...register("inviteCode")} />
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <Button type="button" className="bg-rose-500 text-white hover:bg-rose-600" onClick={() => void copyCode()}><Copy /> {copied ? "Copied!" : "Copy code"}</Button>
                  <Button type="button" variant="outline" className="border-rose-200 bg-white text-rose-700" onClick={regenerateCode}><RefreshCw /> New code</Button>
                </div>
                {errors.inviteCode && <p className="mt-3 text-sm text-red-600" role="alert">{errors.inviteCode.message}</p>}
              </div>
            )}

            <div className="flex justify-end gap-3 border-t border-rose-100 pt-5">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              {mode === "email" ? (
                <Button type="submit" className="bg-rose-500 text-white hover:bg-rose-600"><Send /> Send invitation</Button>
              ) : (
                <Button type="button" className="bg-rose-500 text-white hover:bg-rose-600" onClick={onClose}>Done</Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
