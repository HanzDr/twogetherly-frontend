import { zodResolver } from "@hookform/resolvers/zod";
import { format, isBefore, parseISO, startOfDay } from "date-fns";
import { CalendarDays, Heart, Target, X } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { createGoalFormSchema, type createGoalFormValues } from "@/schemas/goal-schema";

type CreateGoalProps = {
  isOpen: boolean;
  partnerName: string;
  onClose: () => void;
  onCreate: (values: createGoalFormValues) => void;
};

export function CreateGoal({ isOpen, partnerName, onClose, onCreate }: CreateGoalProps) {
  const form = useForm<createGoalFormValues>({
    resolver: zodResolver(createGoalFormSchema),
    defaultValues: {
      name: "",
      description: "",
      targetAmount: 0,
      startDate: "",
      deadline: "",
    },
  });
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = form;
  const startDate = useWatch({ control, name: "startDate" });

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const submitGoal = (values: createGoalFormValues) => {
    onCreate(values);
    reset();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-rose-950/35 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <Card
        className="max-h-[calc(100vh-2rem)] w-full max-w-lg gap-6 overflow-y-auto border-rose-100 bg-white py-6 shadow-2xl ring-rose-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-goal-title"
      >
        <CardHeader className="relative gap-3 pr-14">
          <div className="flex size-11 items-center justify-center rounded-xl bg-rose-500 text-white shadow-lg shadow-rose-200">
            <Target className="size-5" aria-hidden="true" />
          </div>
          <div>
            <CardTitle id="create-goal-title" className="text-2xl font-semibold text-rose-950">
              Create a new goal
            </CardTitle>
            <CardDescription className="mt-1 text-rose-950/55">
              Start something meaningful with {partnerName}.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-4 top-0 text-rose-950/50 hover:bg-rose-50 hover:text-rose-700"
            onClick={onClose}
            aria-label="Close create goal modal"
          >
            <X aria-hidden="true" />
          </Button>
        </CardHeader>

        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit(submitGoal)} noValidate>
            <div className="space-y-2">
              <label className="text-sm font-medium text-rose-950" htmlFor="goal-name">Goal name</label>
              <input
                id="goal-name"
                autoFocus
                placeholder="e.g. Our first home"
                aria-invalid={Boolean(errors.name)}
                className="h-11 w-full rounded-xl border border-rose-100 bg-rose-50/40 px-3 text-rose-950 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 aria-invalid:border-red-500"
                {...register("name")}
              />
              {errors.name && <p className="text-sm text-red-600" role="alert">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-rose-950" htmlFor="goal-description">Description</label>
              <textarea
                id="goal-description"
                rows={3}
                placeholder="What are you working toward together?"
                aria-invalid={Boolean(errors.description)}
                className="w-full resize-none rounded-xl border border-rose-100 bg-rose-50/40 p-3 text-rose-950 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 aria-invalid:border-red-500"
                {...register("description")}
              />
              {errors.description && <p className="text-sm text-red-600" role="alert">{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-rose-950" htmlFor="goal-target">Target amount</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-rose-950/40">₱</span>
                <input
                  id="goal-target"
                  type="number"
                  min="1"
                  step="100"
                  placeholder="150000"
                  aria-invalid={Boolean(errors.targetAmount)}
                  className="h-11 w-full rounded-xl border border-rose-100 bg-rose-50/40 pl-8 pr-3 text-rose-950 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 aria-invalid:border-red-500"
                  {...register("targetAmount", { valueAsNumber: true })}
                />
              </div>
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
                        <Calendar
                          mode="single"
                          selected={field.value ? parseISO(field.value) : undefined}
                          onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                          disabled={(date) => isBefore(date, startDate ? parseISO(startDate) : startOfDay(new Date()))}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.deadline && <p className="text-sm text-red-600" role="alert">{errors.deadline.message}</p>}
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
              <Heart className="size-5 fill-rose-400 text-rose-400" aria-hidden="true" />
              This goal will be shared with {partnerName}.
            </div>

            <div className="flex justify-end gap-3 pt-1">
              <Button type="button" variant="outline" onClick={onClose} className="border-rose-200">Cancel</Button>
              <Button type="submit" disabled={isSubmitting} className="bg-rose-500 text-white hover:bg-rose-600">
                {isSubmitting ? "Creating..." : "Create goal"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
