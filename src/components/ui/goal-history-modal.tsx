import { ArrowDownToLine, Eye, History, ReceiptText, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PhotoPreviewModal } from "@/components/ui/photo-preview-modal";

export type GoalTransaction = {
  id: number;
  amount: number;
  author: string;
  note?: string;
  createdAt: string;
  receiptUrl?: string;
  receiptName?: string;
};

type GoalHistoryModalProps = {
  isOpen: boolean;
  goalName: string;
  transactions: GoalTransaction[];
  onClose: () => void;
};

export function GoalHistoryModal({ isOpen, goalName, transactions, onClose }: GoalHistoryModalProps) {
  const [selectedReceipt, setSelectedReceipt] = useState<GoalTransaction | null>(null);
  const [isReceiptPhotoOpen, setIsReceiptPhotoOpen] = useState(false);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-rose-950/40 p-4 backdrop-blur-sm" onMouseDown={(event) => event.currentTarget === event.target && onClose()}>
      <Card className="max-h-[calc(100vh-2rem)] w-full max-w-2xl gap-5 overflow-y-auto border-rose-100 bg-white py-6 shadow-2xl ring-rose-100" role="dialog" aria-modal="true" aria-labelledby="history-title">
        <CardHeader className="relative gap-3 pr-14">
          <span className="flex size-11 items-center justify-center rounded-xl bg-rose-100 text-rose-600"><History aria-hidden="true" /></span>
          <div>
            <CardTitle id="history-title" className="text-2xl text-rose-950">Goal audit trail</CardTitle>
            <CardDescription className="mt-1">Every contribution recorded for {goalName}.</CardDescription>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} className="absolute right-4 top-0" aria-label="Close transaction history"><X /></Button>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-rose-200 bg-rose-50/40 px-5 py-12 text-center">
              <ReceiptText className="mx-auto size-8 text-rose-300" />
              <p className="mt-3 font-medium text-rose-950">No transactions yet</p>
              <p className="mt-1 text-sm text-rose-950/50">Your first contribution will appear here.</p>
            </div>
          ) : (
            <ol className="relative ml-3 space-y-5 border-l border-rose-200">
              {transactions.map((transaction) => (
                <li key={transaction.id} className="relative ml-6 rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
                  <span className="absolute -left-[2.05rem] top-5 flex size-4 rounded-full border-4 border-white bg-rose-500" />
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-rose-950">+₱{transaction.amount.toLocaleString()}</p>
                      <p className="mt-1 text-sm text-rose-950/50">Added by {transaction.author} · {transaction.createdAt}</p>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => setSelectedReceipt(transaction)} className="border-rose-200 bg-white text-rose-700">
                      <Eye aria-hidden="true" /> View receipt
                    </Button>
                  </div>
                  {transaction.note && <p className="mt-3 rounded-lg bg-rose-50 p-3 text-sm text-rose-950/65">“{transaction.note}”</p>}
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>

      {selectedReceipt && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-rose-950/75 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-label="Transaction receipt" onMouseDown={(event) => event.currentTarget === event.target && setSelectedReceipt(null)}>
          <Card className="max-h-[90vh] w-full max-w-md gap-5 overflow-y-auto border-rose-100 bg-white py-6 shadow-2xl">
            <CardHeader className="relative pr-14">
              <CardTitle className="flex items-center gap-2 text-xl text-rose-950"><ReceiptText className="text-rose-500" /> Contribution receipt</CardTitle>
              <CardDescription>Transaction #{selectedReceipt.id}</CardDescription>
              <Button type="button" variant="ghost" size="icon" className="absolute right-4 top-0" onClick={() => setSelectedReceipt(null)} aria-label="Close receipt"><X /></Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <dl className="divide-y divide-rose-100 rounded-xl border border-rose-100 px-4">
                <div className="flex justify-between gap-4 py-3"><dt className="text-rose-950/50">Amount</dt><dd className="font-semibold text-rose-950">₱{selectedReceipt.amount.toLocaleString()}</dd></div>
                <div className="flex justify-between gap-4 py-3"><dt className="text-rose-950/50">Contributor</dt><dd className="font-medium text-rose-950">{selectedReceipt.author}</dd></div>
                <div className="flex justify-between gap-4 py-3"><dt className="text-rose-950/50">Date</dt><dd className="text-right text-rose-950">{selectedReceipt.createdAt}</dd></div>
              </dl>
              {selectedReceipt.receiptUrl ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  <Button type="button" onClick={() => setIsReceiptPhotoOpen(true)} className="bg-rose-500 text-white hover:bg-rose-600">
                    <Eye aria-hidden="true" /> View receipt
                  </Button>
                  <a href={selectedReceipt.receiptUrl} download={selectedReceipt.receiptName ?? "receipt"} className="flex h-8 items-center justify-center gap-2 rounded-lg border border-rose-200 bg-white px-3 text-sm font-medium text-rose-700 hover:bg-rose-50"><ArrowDownToLine className="size-4" /> Download receipt</a>
                </div>
              ) : (
                <p className="rounded-xl bg-rose-50 p-3 text-center text-sm text-rose-950/50">No receipt photo was uploaded for this contribution.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <PhotoPreviewModal
        isOpen={isReceiptPhotoOpen && Boolean(selectedReceipt?.receiptUrl)}
        photoUrl={selectedReceipt?.receiptUrl ?? ""}
        alt={selectedReceipt?.receiptName ?? "Uploaded contribution receipt"}
        onClose={() => setIsReceiptPhotoOpen(false)}
      />
    </div>
  );
}
