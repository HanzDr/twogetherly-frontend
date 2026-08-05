import { AlertTriangle, CheckCircle2, HelpCircle, X } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ConfirmationTone = "default" | "success" | "danger";

type ConfirmtaionModalProps = {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: ConfirmationTone;
  isConfirming?: boolean;
  children?: ReactNode;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
};

const toneStyles = {
  default: { icon: HelpCircle, iconClass: "bg-rose-100 text-rose-600", buttonClass: "bg-rose-500 text-white hover:bg-rose-600" },
  success: { icon: CheckCircle2, iconClass: "bg-emerald-100 text-emerald-600", buttonClass: "bg-emerald-600 text-white hover:bg-emerald-700" },
  danger: { icon: AlertTriangle, iconClass: "bg-red-100 text-red-600", buttonClass: "bg-red-600 text-white hover:bg-red-700" },
} satisfies Record<ConfirmationTone, object>;

export function ConfirmtaionModal({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "default",
  isConfirming = false,
  children,
  onConfirm,
  onCancel,
}: ConfirmtaionModalProps) {
  if (!isOpen) return null;
  const style = toneStyles[tone];
  const Icon = style.icon;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-rose-950/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="confirmation-title" onMouseDown={(event) => event.currentTarget === event.target && onCancel()}>
      <Card className="w-full max-w-md gap-5 border-rose-100 bg-white py-6 shadow-2xl ring-rose-100">
        <CardHeader className="relative gap-3 pr-14">
          <span className={`flex size-11 items-center justify-center rounded-xl ${style.iconClass}`}><Icon aria-hidden="true" /></span>
          <div>
            <CardTitle id="confirmation-title" className="text-xl text-rose-950">{title}</CardTitle>
            <CardDescription className="mt-1 leading-6">{description}</CardDescription>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onCancel} className="absolute right-4 top-0" aria-label="Close confirmation"><X /></Button>
        </CardHeader>
        <CardContent className="space-y-5">
          {children}
          <div className="flex justify-end gap-3 border-t border-rose-100 pt-5">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isConfirming}>{cancelLabel}</Button>
            <Button type="button" onClick={() => void onConfirm()} disabled={isConfirming} className={style.buttonClass}>{isConfirming ? "Please wait..." : confirmLabel}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
