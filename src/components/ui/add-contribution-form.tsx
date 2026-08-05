import { CircleDollarSign, Expand, Heart, ImagePlus, Trash2 } from "lucide-react";
import { type ChangeEvent, useRef, useState } from "react";
import type { SubmitHandler, UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { PhotoPreviewModal } from "@/components/ui/photo-preview-modal";
import type { addContributionFormValues } from "@/schemas/goal-schema";

type AddContributionFormProps = {
  form: UseFormReturn<addContributionFormValues>;
  goalName: string;
  remainingAmount: number;
  partnerName: string;
  onSubmit: SubmitHandler<addContributionFormValues>;
  onCancel: () => void;
};

export function AddContributionForm({
  form,
  goalName,
  remainingAmount,
  partnerName,
  onSubmit,
  onCancel,
}: AddContributionFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    clearErrors,
    watch,
    formState: { errors, isSubmitting },
  } = form;
  const noteLength = watch("note").length;
  const [photoPreview, setPhotoPreview] = useState("");
  const [isPhotoExpanded, setIsPhotoExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectPhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("photo", { message: "Only image files are allowed" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("photo", { message: "Photo must be smaller than 5 MB" });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(String(reader.result));
      setValue("photo", file, { shouldDirty: true, shouldValidate: true });
      clearErrors("photo");
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoPreview("");
    setValue("photo", undefined, { shouldDirty: true });
    clearErrors("photo");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="rounded-xl border border-rose-100 bg-rose-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-rose-500">Contributing to</p>
        <p className="mt-1 font-semibold text-rose-950">{goalName}</p>
        <p className="mt-1 text-sm text-rose-950/50">₱{remainingAmount.toLocaleString()} remaining</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-rose-950" htmlFor="contribution-amount">Contribution amount</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center font-medium text-rose-950/40">₱</span>
          <input
            id="contribution-amount"
            type="number"
            min="1"
            max={remainingAmount}
            step="100"
            autoFocus
            placeholder="5000"
            aria-invalid={Boolean(errors.amount)}
            className="h-11 w-full rounded-xl border border-rose-100 bg-rose-50/40 pl-8 pr-3 text-rose-950 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 aria-invalid:border-red-500"
            {...register("amount", { valueAsNumber: true })}
          />
        </div>
        {errors.amount && <p className="text-sm text-red-600" role="alert">{errors.amount.message}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between gap-4">
          <label className="text-sm font-medium text-rose-950" htmlFor="contribution-note">Add a note</label>
          <span className="text-xs text-rose-950/40">{noteLength}/120</span>
        </div>
        <textarea
          id="contribution-note"
          rows={3}
          placeholder={`Write something sweet for ${partnerName}...`}
          aria-invalid={Boolean(errors.note)}
          className="w-full resize-none rounded-xl border border-rose-100 bg-rose-50/40 p-3 text-rose-950 outline-none placeholder:text-rose-950/30 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 aria-invalid:border-red-500"
          {...register("note")}
        />
        {errors.note && <p className="text-sm text-red-600" role="alert">{errors.note.message}</p>}
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-rose-950">Contribution photo <span className="font-normal text-rose-950/40">(optional)</span></p>
          <p className="mt-1 text-xs text-rose-950/45">Add a receipt, memory, or photo up to 5 MB.</p>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" className="sr-only" onChange={selectPhoto} aria-label="Choose a contribution photo" />

        {!photoPreview ? (
          <button type="button" onClick={() => fileInputRef.current?.click()} className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-rose-200 bg-rose-50/40 px-4 py-7 text-sm font-medium text-rose-600 transition hover:border-rose-400 hover:bg-rose-50">
            <ImagePlus className="size-6" aria-hidden="true" />
            Choose a photo
          </button>
        ) : (
          <div className="overflow-hidden rounded-xl border border-rose-100 bg-rose-50/40">
            <img src={photoPreview} alt="Contribution upload preview" className="h-44 w-full object-cover" />
            <div className="flex flex-wrap gap-2 p-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsPhotoExpanded(true)} className="border-rose-200 bg-white text-rose-700">
                <Expand aria-hidden="true" /> Expand photo
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={removePhoto} className="text-red-600 hover:bg-red-50 hover:text-red-700">
                <Trash2 aria-hidden="true" /> Remove
              </Button>
            </div>
          </div>
        )}
        {errors.photo && <p className="text-sm text-red-600" role="alert">{errors.photo.message}</p>}
      </div>

      <p className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
        <Heart className="size-4 fill-rose-400 text-rose-400" aria-hidden="true" />
        {partnerName} will see this contribution on your shared goal.
      </p>

      <div className="flex justify-end gap-3 border-t border-rose-100 pt-5">
        <Button type="button" variant="outline" onClick={onCancel} className="border-rose-200">Cancel</Button>
        <Button type="submit" disabled={isSubmitting} className="bg-rose-500 text-white hover:bg-rose-600">
          <CircleDollarSign aria-hidden="true" />
          {isSubmitting ? "Adding..." : "Add contribution"}
        </Button>
      </div>

      <PhotoPreviewModal
        isOpen={isPhotoExpanded}
        photoUrl={photoPreview}
        alt="Expanded contribution upload"
        onClose={() => setIsPhotoExpanded(false)}
      />
    </form>
  );
}
