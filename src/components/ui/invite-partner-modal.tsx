import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, KeyRound, Mail, Send, UserPlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { invitePartnerFormSchema, type InvitePartnerFormValues } from "@/schemas/linking-schema";

type InviteMode = "email" | "code";

type InvitePartnerModalProps = {
  isOpen: boolean;
  spaceInviteCode?: string;
  onClose: () => void;
  onComplete: (message: string) => void;
};

export function InvitePartnerModal({
  isOpen,
  spaceInviteCode = "LOVE-2847",
  onClose,
  onComplete,
}: InvitePartnerModalProps) {
  const [copied, setCopied] = useState(false);
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
    clearErrors();
  };

  const copyCode = async () => {
    await navigator.clipboard?.writeText(spaceInviteCode);
    setCopied(true);
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
              <>
                <div className="space-y-2">
                  <label htmlFor="partner-invite-code" className="text-sm font-medium text-rose-950">Enter their invite code</label>
                  <input id="partner-invite-code" autoFocus placeholder="LOVE-2847" aria-invalid={Boolean(errors.inviteCode)} className="h-12 w-full rounded-xl border border-rose-100 bg-rose-50/40 px-3 text-center text-lg font-semibold uppercase tracking-[0.2em] outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 aria-invalid:border-red-500" {...register("inviteCode", { setValueAs: (value: string) => value.toUpperCase() })} />
                  {errors.inviteCode && <p className="text-sm text-red-600" role="alert">{errors.inviteCode.message}</p>}
                </div>
                <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-rose-500">Or share your code</p>
                  <p className="mt-1 text-xl font-semibold tracking-widest text-rose-950">{spaceInviteCode}</p>
                  <Button type="button" variant="ghost" size="sm" className="mt-2 text-rose-600" onClick={() => void copyCode()}><Copy /> {copied ? "Copied" : "Copy code"}</Button>
                </div>
              </>
            )}

            <div className="flex justify-end gap-3 border-t border-rose-100 pt-5">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" className="bg-rose-500 text-white hover:bg-rose-600"><Send /> {mode === "email" ? "Send invitation" : "Use invite code"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
