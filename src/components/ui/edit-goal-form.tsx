import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { CalendarDays, Pencil, Save, X } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm, useWatch, type SubmitHandler } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { editGoalFormSchema, type editGoalFormValues } from "@/schemas/goal-schema";

type EditGoalFormProps = {
  isOpen: boolean;
  goal: editGoalFormValues & { currentAmount: number };
  onSave: (values: editGoalFormValues) => void | Promise<void>;
  onCancel: () => void;
};

export function EditGoalForm({ isOpen, goal, onSave, onCancel }: EditGoalFormProps) {
  const form = useForm<editGoalFormValues>({
    resolver: zodResolver(editGoalFormSchema),
    defaultValues: {
      name: goal.name,
      description: goal.description,
      targetAmount: goal.targetAmount,
      startDate: goal.startDate ?? "",
      deadline: goal.deadline ?? "",
    },
  });
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isDirty, isSubmitting },
  } = form;
  const description = useWatch({ control: form.control, name: "description" });

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const saveGoal: SubmitHandler<editGoalFormValues> = async (values) => {
    if (values.targetAmount < goal.currentAmount) {
      setError("targetAmount", {
        message: `Target cannot be lower than the current ₱${goal.currentAmount.toLocaleString()} saved`,
      });
      return;
    }
    await onSave(values);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-rose-950/40 p-4 backdrop-blur-sm" onMouseDown={(event) => event.currentTarget === event.target && onCancel()}>
      <Card className="max-h-[calc(100vh-2rem)] w-full max-w-lg gap-6 overflow-y-auto border-rose-100 bg-white py-6 shadow-2xl ring-rose-100" role="dialog" aria-modal="true" aria-labelledby="edit-goal-title">
        <CardHeader className="relative gap-3 pr-14">
          <span className="flex size-11 items-center justify-center rounded-xl bg-rose-100 text-rose-600"><Pencil aria-hidden="true" /></span>
          <div>
            <CardTitle id="edit-goal-title" className="text-2xl text-rose-950">Edit goal</CardTitle>
            <CardDescription className="mt-1">Update your shared goal details and target.</CardDescription>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onCancel} className="absolute right-4 top-0" aria-label="Close edit goal form"><X /></Button>
        </CardHeader>

        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit(saveGoal)} noValidate>
            <div className="space-y-2">
              <label htmlFor="edit-goal-name" className="text-sm font-medium text-rose-950">Goal name</label>
              <input id="edit-goal-name" autoFocus aria-invalid={Boolean(errors.name)} className="h-11 w-full rounded-xl border border-rose-100 bg-rose-50/40 px-3 text-rose-950 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 aria-invalid:border-red-500" {...register("name")} />
              {errors.name && <p className="text-sm text-red-600" role="alert">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between gap-4">
                <label htmlFor="edit-goal-description" className="text-sm font-medium text-rose-950">Description</label>
                <span className="text-xs text-rose-950/40">{description.length}/160</span>
              </div>
              <textarea id="edit-goal-description" rows={3} aria-invalid={Boolean(errors.description)} className="w-full resize-none rounded-xl border border-rose-100 bg-rose-50/40 p-3 text-rose-950 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 aria-invalid:border-red-500" {...register("description")} />
              {errors.description && <p className="text-sm text-red-600" role="alert">{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-goal-target" className="text-sm font-medium text-rose-950">Target amount</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-rose-950/40">₱</span>
                <input id="edit-goal-target" type="number" min={goal.currentAmount} step="100" aria-invalid={Boolean(errors.targetAmount)} className="h-11 w-full rounded-xl border border-rose-100 bg-rose-50/40 pl-8 pr-3 text-rose-950 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 aria-invalid:border-red-500" {...register("targetAmount", { valueAsNumber: true })} />
              </div>
              <p className="text-xs text-rose-950/45">Current savings: ₱{goal.currentAmount.toLocaleString()}</p>
              {errors.targetAmount && <p className="text-sm text-red-600" role="alert">{errors.targetAmount.message}</p>}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-rose-950">Start date <span className="font-normal text-rose-950/40">(optional)</span></label>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger render={<Button type="button" variant="outline" className="h-11 w-full justify-start border-rose-100 bg-rose-50/40 px-3 font-normal text-rose-950 hover:bg-rose-50" />}>
                        <CalendarDays className="text-rose-400" />
                        {field.value ? format(parseISO(field.value), "PPP") : <span className="text-rose-950/35">Choose start date</span>}
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto border-rose-100 p-0">
                        <Calendar mode="single" selected={field.value ? parseISO(field.value) : undefined} onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")} />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.startDate && <p className="text-sm text-red-600" role="alert">{errors.startDate.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-rose-950">Expected completion <span className="font-normal text-rose-950/40">(optional)</span></label>
                <Controller
                  name="deadline"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger render={<Button type="button" variant="outline" className="h-11 w-full justify-start border-rose-100 bg-rose-50/40 px-3 font-normal text-rose-950 hover:bg-rose-50" />}>
                        <CalendarDays className="text-rose-400" />
                        {field.value ? format(parseISO(field.value), "PPP") : <span className="text-rose-950/35">Choose deadline</span>}
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto border-rose-100 p-0">
                        <Calendar mode="single" selected={field.value ? parseISO(field.value) : undefined} onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")} disabled={{ before: new Date() }} />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.deadline && <p className="text-sm text-red-600" role="alert">{errors.deadline.message}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-rose-100 pt-5">
              <Button type="button" variant="outline" onClick={onCancel} className="border-rose-200">Cancel</Button>
              <Button type="submit" disabled={!isDirty || isSubmitting} className="bg-rose-500 text-white hover:bg-rose-600"><Save /> {isSubmitting ? "Saving..." : "Save changes"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
