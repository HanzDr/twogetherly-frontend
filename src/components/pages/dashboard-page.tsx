import { Heart, LogOut, Plus, Target, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AddContributionModal } from "@/components/ui/add-contribution-modal";
import { Button } from "@/components/ui/button";
import { CreateGoal } from "@/components/ui/create-goal";
import { ConfirmtaionModal } from "@/components/ui/confirmtaion-modal";
import { EditGoalForm } from "@/components/ui/edit-goal-form";
import { GoalCard } from "@/components/ui/goal-card";
import { GoalHistoryModal, type GoalTransaction } from "@/components/ui/goal-history-modal";
import { InvitePartnerModal } from "@/components/ui/invite-partner-modal";
import type {
  addContributionFormValues,
  createGoalFormValues,
  editGoalFormValues,
} from "@/schemas/goal-schema";

type Goal = {
  id: number;
  name: string;
  description: string;
  currentAmount: number;
  targetAmount: number;
  startDate?: string;
  deadline?: string;
};

const initialGoals: Goal[] = [
  {
    id: 1,
    name: "Our Dream Wedding",
    description: "Saving for a beautiful day with all of our favorite people.",
    currentAmount: 65_600,
    targetAmount: 150_000,
    startDate: "2026-01-15",
    deadline: "2027-06-12",
  },
  {
    id: 2,
    name: "First Home Fund",
    description: "Building a cozy place that feels completely ours.",
    currentAmount: 210_000,
    targetAmount: 500_000,
    startDate: "2025-09-01",
    deadline: "2028-12-31",
  },
  {
    id: 3,
    name: "Anniversary Getaway",
    description: "A week away to celebrate another wonderful year together.",
    currentAmount: 42_500,
    targetAmount: 50_000,
    startDate: "2026-07-20",
    deadline: "2026-11-20",
  },
];

const initialTransactions: Record<number, GoalTransaction[]> = {
  1: [
    { id: 1001, amount: 10_000, author: "Freiz", note: "For our dream venue.", createdAt: "August 3, 2026 · 6:20 PM" },
    { id: 1002, amount: 5_600, author: "You", note: "A little closer today!", createdAt: "July 28, 2026 · 9:15 AM" },
  ],
  2: [
    { id: 2001, amount: 25_000, author: "You", note: "Monthly home fund contribution.", createdAt: "August 1, 2026 · 8:00 AM" },
  ],
  3: [
    { id: 3001, amount: 7_500, author: "Freiz", note: "Flights are almost covered!", createdAt: "July 30, 2026 · 7:45 PM" },
  ],
};

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function DashboardPage() {
  const navigate = useNavigate();
  const partnerName = "Freiz";
  const [goals, setGoals] = useState(initialGoals);
  const [isCreateGoalOpen, setIsCreateGoalOpen] = useState(false);
  const [contributionGoalId, setContributionGoalId] = useState<number | null>(null);
  const [historyGoalId, setHistoryGoalId] = useState<number | null>(null);
  const [editGoalId, setEditGoalId] = useState<number | null>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isSignOutOpen, setIsSignOutOpen] = useState(false);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [activityMessage, setActivityMessage] = useState(
    "Welcome back! Your shared goals are looking great.",
  );

  const createGoal = (values: createGoalFormValues) => {
    setGoals((currentGoals) => [
      ...currentGoals,
      {
        id: Date.now(),
        ...values,
        currentAmount: 0,
      },
    ]);
    setActivityMessage(
      `${values.name} was created and shared with ${partnerName}.`,
    );
  };

  const addContribution = async (values: addContributionFormValues) => {
    if (contributionGoalId === null) return;
    const goalName = goals.find((goal) => goal.id === contributionGoalId)?.name ?? "Goal";
    const receiptUrl = values.photo ? await readFileAsDataUrl(values.photo) : undefined;
    setGoals((currentGoals) =>
      currentGoals.map((goal) => {
        if (goal.id !== contributionGoalId) return goal;
        return {
          ...goal,
          currentAmount: Math.min(goal.currentAmount + values.amount, goal.targetAmount),
        };
      }),
    );
    const transaction: GoalTransaction = {
      id: Date.now(),
      amount: values.amount,
      author: "You",
      note: values.note || undefined,
      createdAt: new Date().toLocaleString(),
      receiptUrl,
      receiptName: values.photo?.name,
    };
    setTransactions((currentTransactions) => ({
      ...currentTransactions,
      [contributionGoalId]: [transaction, ...(currentTransactions[contributionGoalId] ?? [])],
    }));
    setActivityMessage(`₱${values.amount.toLocaleString()} was added to ${goalName}.`);
  };

  const contributionGoal = goals.find((goal) => goal.id === contributionGoalId);
  const historyGoal = goals.find((goal) => goal.id === historyGoalId);
  const editGoal = goals.find((goal) => goal.id === editGoalId);

  const saveGoalChanges = (values: editGoalFormValues) => {
    if (editGoalId === null) return;
    setGoals((currentGoals) => currentGoals.map((goal) =>
      goal.id === editGoalId ? { ...goal, ...values } : goal,
    ));
    setActivityMessage(`${values.name} was updated.`);
    setEditGoalId(null);
  };

  const signOut = () => {
    sessionStorage.removeItem("togetherly:partner-linked");
    navigate("/login", { replace: true });
  };

  const totalSaved = goals.reduce(
    (total, goal) => total + goal.currentAmount,
    0,
  );
  const totalTarget = goals.reduce(
    (total, goal) => total + goal.targetAmount,
    0,
  );

  return (
    <main className="min-h-screen bg-linear-to-b from-rose-50 to-white px-5 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-6 border-b border-rose-100 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 font-semibold text-rose-600">
              <span className="flex size-9 items-center justify-center rounded-xl bg-rose-500 text-white">
                <Heart className="size-5 fill-current" aria-hidden="true" />
              </span>
              Togetherly
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-rose-950 sm:text-4xl">
              Shared goals
            </h1>
            <p className="mt-2 text-rose-950/55">
              Small contributions, beautiful things ahead.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="ghost" size="lg" className="h-11 text-rose-700 hover:bg-rose-100" onClick={() => setIsSignOutOpen(true)}>
              <LogOut aria-hidden="true" /> Sign out
            </Button>
            <Button variant="outline" size="lg" className="h-11 border-rose-200 bg-white text-rose-700" onClick={() => setIsInviteOpen(true)}>
              <UserPlus aria-hidden="true" /> Invite partner
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-11 border-rose-200 bg-white text-rose-700"
              render={<Link to="/diary" />}
            >
              Shared diary
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-11 border-rose-200 bg-white text-rose-700"
              render={<Link to="/profile-settings" />}
            >
              Profile settings
            </Button>
            <Button
              size="lg"
              className="h-11 bg-rose-500 text-white shadow-lg shadow-rose-200 hover:bg-rose-600"
              onClick={() => setIsCreateGoalOpen(true)}
            >
              <Plus aria-hidden="true" />
              Create new goal
            </Button>
          </div>
        </header>

        <section className="my-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
            <p className="flex items-center gap-2 text-sm font-medium text-rose-950/50">
              <Heart className="size-4 text-rose-500" aria-hidden="true" />{" "}
              Total saved together
            </p>
            <p className="mt-2 text-3xl font-semibold text-rose-950">
              {totalSaved.toLocaleString()}
            </p>
          </div>
          <div className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
            <p className="flex items-center gap-2 text-sm font-medium text-rose-950/50">
              <Target className="size-4 text-rose-500" aria-hidden="true" />{" "}
              Combined target
            </p>
            <p className="mt-2 text-3xl font-semibold text-rose-950">
              {totalTarget.toLocaleString()}
            </p>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-rose-200 bg-linear-to-br from-rose-500 to-pink-600 p-5 text-white shadow-lg shadow-rose-200 sm:col-span-2 lg:col-span-1">
            <div
              className="absolute -right-5 -top-6 size-24 rounded-full bg-white/10"
              aria-hidden="true"
            />
            <p className="flex items-center gap-2 text-sm font-medium text-white/75">
              <Users className="size-4" aria-hidden="true" /> Your goal partner
            </p>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-full border-2 border-white/70 bg-white/20 text-lg font-semibold">
                {partnerName.charAt(0)}
              </span>
              <div>
                <p className="text-xl font-semibold">{partnerName}</p>
                <p className="text-sm text-white/70">
                  Saving and dreaming with you
                </p>
              </div>
            </div>
          </div>
        </section>

        <p
          className="mb-5 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          role="status"
        >
          {activityMessage}
        </p>

        <section
          className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3"
          aria-label="Your goals"
        >
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              {...goal}
              onViewMore={() => setHistoryGoalId(goal.id)}
              onEdit={() => setEditGoalId(goal.id)}
              onAddContribution={() => setContributionGoalId(goal.id)}
            />
          ))}
        </section>
      </div>

      <CreateGoal
        isOpen={isCreateGoalOpen}
        partnerName={partnerName}
        onClose={() => setIsCreateGoalOpen(false)}
        onCreate={createGoal}
      />
      <AddContributionModal
        isOpen={Boolean(contributionGoal)}
        goalName={contributionGoal?.name ?? ""}
        remainingAmount={contributionGoal ? contributionGoal.targetAmount - contributionGoal.currentAmount : 0}
        partnerName={partnerName}
        onClose={() => setContributionGoalId(null)}
        onAddContribution={addContribution}
      />
      <GoalHistoryModal
        isOpen={Boolean(historyGoal)}
        goalName={historyGoal?.name ?? ""}
        transactions={historyGoal ? transactions[historyGoal.id] ?? [] : []}
        onClose={() => setHistoryGoalId(null)}
      />
      <EditGoalForm
        key={editGoal?.id ?? "edit-goal"}
        isOpen={Boolean(editGoal)}
        goal={editGoal ?? { name: "", description: "", targetAmount: 0, currentAmount: 0, startDate: "", deadline: "" }}
        onSave={saveGoalChanges}
        onCancel={() => setEditGoalId(null)}
      />
      <InvitePartnerModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onComplete={setActivityMessage}
      />
      <ConfirmtaionModal
        isOpen={isSignOutOpen}
        title="Sign out of Togetherly?"
        description="You'll return to the login page and will need to sign in again to access your shared space."
        confirmLabel="Sign out"
        tone="danger"
        onCancel={() => setIsSignOutOpen(false)}
        onConfirm={signOut}
      />
    </main>
  );
}
