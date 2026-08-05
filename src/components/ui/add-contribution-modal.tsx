import { zodResolver } from "@hookform/resolvers/zod";
import { CircleDollarSign, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { AddContributionForm } from "@/components/ui/add-contribution-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmtaionModal } from "@/components/ui/confirmtaion-modal";
import {
  addContributionFormSchema,
  type addContributionFormValues,
} from "@/schemas/goal-schema";

type AddContributionModalProps = {
  isOpen: boolean;
  goalName: string;
  remainingAmount: number;
  partnerName: string;
  onClose: () => void;
  onAddContribution: (values: addContributionFormValues) => void | Promise<void>;
};

export function AddContributionModal({
  isOpen,
  goalName,
  remainingAmount,
  partnerName,
  onClose,
  onAddContribution,
}: AddContributionModalProps) {
  const [pendingContribution, setPendingContribution] = useState<addContributionFormValues | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const form = useForm<addContributionFormValues>({
    resolver: zodResolver(addContributionFormSchema),
    defaultValues: { amount: 0, note: "", photo: undefined },
  });

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const submitContribution: SubmitHandler<addContributionFormValues> = (values) => {
    if (values.amount > remainingAmount) {
      form.setError("amount", { message: `Contribution cannot exceed ₱${remainingAmount.toLocaleString()}` });
      return;
    }
    setPendingContribution(values);
  };

  const confirmContribution = async () => {
    if (!pendingContribution) return;
    setIsConfirming(true);
    await onAddContribution(pendingContribution);
    setIsConfirming(false);
    setPendingContribution(null);
    form.reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-rose-950/35 p-4 backdrop-blur-sm" onMouseDown={(event) => event.currentTarget === event.target && onClose()}>
      <Card className="max-h-[calc(100vh-2rem)] w-full max-w-lg gap-6 overflow-y-auto border-rose-100 bg-white py-6 shadow-2xl ring-rose-100" role="dialog" aria-modal="true" aria-labelledby="contribution-title">
        <CardHeader className="relative gap-3 pr-14">
          <div className="flex size-11 items-center justify-center rounded-xl bg-rose-500 text-white shadow-lg shadow-rose-200">
            <CircleDollarSign className="size-5" aria-hidden="true" />
          </div>
          <div>
            <CardTitle id="contribution-title" className="text-2xl font-semibold text-rose-950">Add a contribution</CardTitle>
            <CardDescription className="mt-1 text-rose-950/55">Every little step brings you closer together.</CardDescription>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} className="absolute right-4 top-0 text-rose-950/50 hover:bg-rose-50" aria-label="Close contribution modal">
            <X aria-hidden="true" />
          </Button>
        </CardHeader>
        <CardContent>
          <AddContributionForm form={form} goalName={goalName} remainingAmount={remainingAmount} partnerName={partnerName} onSubmit={submitContribution} onCancel={onClose} />
        </CardContent>
      </Card>
      <ConfirmtaionModal
        isOpen={Boolean(pendingContribution)}
        title="Confirm contribution"
        description={`Add this contribution to ${goalName}? This will update your shared goal and audit trail.`}
        confirmLabel="Confirm contribution"
        tone="success"
        isConfirming={isConfirming}
        onCancel={() => setPendingContribution(null)}
        onConfirm={confirmContribution}
      >
        {pendingContribution && (
          <div className="rounded-xl bg-rose-50 p-4">
            <p className="text-sm text-rose-950/50">Contribution amount</p>
            <p className="mt-1 text-2xl font-semibold text-rose-950">₱{pendingContribution.amount.toLocaleString()}</p>
            {pendingContribution.note && <p className="mt-2 text-sm text-rose-950/65">“{pendingContribution.note}”</p>}
            {pendingContribution.photo && <p className="mt-2 text-xs font-medium text-rose-600">Receipt attached: {pendingContribution.photo.name}</p>}
          </div>
        )}
      </ConfirmtaionModal>
    </div>
  );
}
