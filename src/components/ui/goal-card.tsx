import { ArrowUpRight, CalendarDays, CalendarRange, CircleDollarSign, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type GoalCardProps = {
  name: string;
  currentAmount: number;
  targetAmount: number;
  description?: string;
  startDate?: string;
  deadline?: string;
  onViewMore?: () => void;
  onEdit?: () => void;
  onAddContribution?: () => void;
};

function formatAmount(amount: number) {
  return Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}

export function GoalCard({
  name,
  currentAmount,
  targetAmount,
  description,
  startDate,
  deadline,
  onViewMore,
  onEdit,
  onAddContribution,
}: GoalCardProps) {
  const percentage = targetAmount > 0
    ? Math.min(Math.max((currentAmount / targetAmount) * 100, 0), 100)
    : 0;

  return (
    <Card className="gap-5 border-rose-100 bg-white py-5 shadow-sm ring-rose-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-950/5">
      <CardHeader className="gap-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold text-rose-950">{name}</CardTitle>
            {description && (
              <CardDescription className="mt-1 line-clamp-2 text-rose-950/50">
                {description}
              </CardDescription>
            )}
          </div>
          <span className="shrink-0 rounded-full bg-rose-50 px-3 py-1 text-sm font-semibold text-rose-600">
            {Math.round(percentage)}%
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-end justify-between gap-4">
          <p className="text-2xl font-semibold tracking-tight text-rose-950">
            {formatAmount(currentAmount)}
            <span className="text-base font-normal text-rose-950/40"> / {formatAmount(targetAmount)}</span>
          </p>
          <p className="text-xs font-medium uppercase tracking-wider text-rose-950/40">Progress</p>
        </div>
        <div
          className="h-3 overflow-hidden rounded-full bg-rose-100"
          role="progressbar"
          aria-label={`${name} progress`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(percentage)}
        >
          <div
            className="h-full rounded-full bg-linear-to-r from-rose-400 to-pink-600 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-sm text-rose-950/45">
          {formatAmount(Math.max(targetAmount - currentAmount, 0))} remaining to reach this goal
        </p>
        {deadline && (
          <p className="flex items-center gap-2 text-sm font-medium text-rose-600">
            <CalendarDays className="size-4" aria-hidden="true" />
            Expected by {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(`${deadline}T00:00:00`))}
          </p>
        )}
        {startDate && (
          <p className="flex items-center gap-2 text-sm text-rose-950/50">
            <CalendarRange className="size-4 text-rose-400" aria-hidden="true" />
            Started {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(`${startDate}T00:00:00`))}
          </p>
        )}
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 border-rose-100 bg-rose-50/50">
        <Button variant="ghost" onClick={onViewMore} className="text-rose-700 hover:bg-rose-100">
          <ArrowUpRight aria-hidden="true" />
          View more
        </Button>
        <Button variant="outline" onClick={onEdit} className="border-rose-200 bg-white text-rose-700 hover:bg-rose-50">
          <Pencil aria-hidden="true" />
          Edit
        </Button>
        <Button onClick={onAddContribution} className="ml-auto bg-rose-500 text-white hover:bg-rose-600">
          <CircleDollarSign aria-hidden="true" />
          Add contribution
        </Button>
      </CardFooter>
    </Card>
  );
}
