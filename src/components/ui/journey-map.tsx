import { BookHeart, Check, Cloud, Flag, Flower2, Heart, Home, MapPin, MapPinned, Maximize2, Minimize2, RotateCcw, TreePine, X } from "lucide-react";
import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

import { Button } from "@/components/ui/button";

export type JourneyMemory = { message: string; date: string; location?: string };
export type JourneyGoal = {
  id: number;
  name: string;
  currentAmount: number;
  targetAmount: number;
  deadline?: string;
  diaryEntries?: JourneyMemory[];
};

type JourneyMapProps = { goals: JourneyGoal[]; partnerName: string };
type Position = { x: number; y: number };

const milestones = [25, 50, 75, 100];
const pathPoints = [
  { x: 475, y: 850 }, { x: 245, y: 680 }, { x: 495, y: 475 },
  { x: 225, y: 280 }, { x: 360, y: 80 },
];

function getTravelerPosition(progress: number) {
  const normalized = Math.min(Math.max(progress, 0), 100) / 25;
  const segment = Math.min(Math.floor(normalized), 3);
  const amount = normalized >= 4 ? 1 : normalized - segment;
  return {
    x: pathPoints[segment].x + (pathPoints[segment + 1].x - pathPoints[segment].x) * amount,
    y: pathPoints[segment].y + (pathPoints[segment + 1].y - pathPoints[segment].y) * amount,
  };
}

export function JourneyMap({ goals, partnerName }: JourneyMapProps) {
  const [selectedGoalId, setSelectedGoalId] = useState(goals[0]?.id ?? 0);
  const [mapPosition, setMapPosition] = useState<Position>({ x: 0, y: -320 });
  const [isDragging, setIsDragging] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<JourneyMemory | null>(null);
  const dragStart = useRef({ pointerX: 0, pointerY: 0, mapX: 0, mapY: 0 });
  const selectedGoal = goals.find((goal) => goal.id === selectedGoalId) ?? goals[0];

  const startDragging = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = { pointerX: event.clientX, pointerY: event.clientY, mapX: mapPosition.x, mapY: mapPosition.y };
    setIsDragging(true);
  };
  const dragMap = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const nextY = dragStart.current.mapY + event.clientY - dragStart.current.pointerY;
    setMapPosition({
      x: 0,
      y: Math.min(Math.max(nextY, isExpanded ? -128 : -576), 0),
    });
  };
  const stopDragging = () => setIsDragging(false);

  if (!selectedGoal) return null;
  const progress = selectedGoal.targetAmount > 0 ? Math.min((selectedGoal.currentAmount / selectedGoal.targetAmount) * 100, 100) : 0;
  const travelers = getTravelerPosition(progress);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-rose-100 bg-white shadow-xl shadow-rose-950/5" aria-labelledby="journey-map-title">
      <div
        className={`relative touch-none select-none overflow-hidden bg-linear-to-b from-pink-100 via-rose-50 to-red-100 transition-[height] duration-500 ${isExpanded ? "h-[52rem]" : "h-[24rem]"} ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        onPointerDown={startDragging}
        onPointerMove={dragMap}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.95),transparent_35%)]" />
        <div
          className="absolute inset-x-0 top-0 h-[60rem] w-full overflow-hidden bg-linear-to-br from-white via-rose-50 to-pink-200 transition-transform duration-75 [perspective:1000px]"
          style={{ transform: `translateY(${mapPosition.y}px)` }}
        >
          <div className="absolute left-16 top-40 size-28 rounded-[50%] bg-sky-200/70 shadow-[inset_0_0_20px_rgba(14,165,233,0.2)]" />
          <div className="absolute bottom-28 right-14 h-20 w-36 rounded-[50%] bg-sky-200/70" />
          <Cloud className="absolute left-16 top-16 size-14 fill-white text-white drop-shadow-md" />
          <Cloud className="absolute right-20 top-28 size-11 fill-white/80 text-white/80" />
          <Home className="absolute right-24 top-[38%] size-12 fill-rose-300 text-red-500 drop-shadow-lg" />
          <TreePine className="absolute left-20 top-[48%] size-14 fill-emerald-300 text-emerald-600 drop-shadow-md" />
          <TreePine className="absolute right-28 top-[70%] size-12 fill-emerald-300 text-emerald-600" />
          <Flower2 className="absolute left-28 bottom-24 size-10 fill-pink-200 text-pink-500" />

          <svg viewBox="0 0 720 930" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <path d="M360 80 C360 185 180 180 225 280 S555 365 495 475 S175 570 245 680 S510 760 475 850" fill="none" stroke="white" strokeWidth="32" strokeLinecap="round" />
            <path d="M360 80 C360 185 180 180 225 280 S555 365 495 475 S175 570 245 680 S510 760 475 850" fill="none" stroke="#f43f5e" strokeWidth="14" strokeLinecap="round" />
            <path d="M360 80 C360 185 180 180 225 280 S555 365 495 475 S175 570 245 680 S510 760 475 850" fill="none" stroke="#fda4af" strokeWidth="4" strokeLinecap="round" />
          </svg>

          {milestones.map((milestone, index) => {
            const point = pathPoints[index + 1];
            const complete = progress >= milestone;
            return (
              <div key={milestone} className="absolute z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: `${(point.x / 720) * 100}%`, top: `${(point.y / 930) * 100}%` }}>
                <span className={`flex size-14 items-center justify-center rounded-2xl border-4 border-white text-sm font-bold shadow-xl ${complete ? "bg-emerald-500 text-white" : "bg-white text-rose-500 ring-2 ring-rose-200"}`}>{complete ? <Check /> : `${milestone}%`}</span>
                <span className="absolute left-1/2 top-16 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-3 py-1 text-xs font-semibold text-rose-700 shadow-md">{milestone === 100 ? "Destination" : `Checkpoint ${index + 1}`}</span>
              </div>
            );
          })}

          <div className="absolute z-20 flex -translate-x-1/2 -translate-y-1/2 items-center transition-all duration-700" style={{ left: `${(travelers.x / 720) * 100}%`, top: `${(travelers.y / 930) * 100}%` }}>
            <span className="flex size-11 items-center justify-center rounded-full border-4 border-white bg-rose-500 font-bold text-white shadow-2xl">Y</span>
            <span className="-ml-2 -mt-6 flex size-11 items-center justify-center rounded-full border-4 border-white bg-red-600 font-bold text-white shadow-2xl">{partnerName.charAt(0)}</span>
            <Heart className="absolute -right-3 -top-4 size-5 fill-pink-400 text-pink-400 animate-pulse" />
          </div>

          {selectedGoal.diaryEntries?.map((memory, index) => {
            const point = pathPoints[Math.min(index + 1, pathPoints.length - 1)];
            return (
              <button
                key={`${memory.date}-${index}`}
                type="button"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => setSelectedMemory(memory)}
                className="absolute z-30 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-pink-500 text-white shadow-[0_0_0_8px_rgba(244,114,182,0.2),0_12px_24px_rgba(190,24,93,0.25)] transition hover:scale-110"
                style={{ left: `${((point.x + (index % 2 === 0 ? 78 : -78)) / 720) * 100}%`, top: `${((point.y - 18) / 930) * 100}%` }}
                aria-label={`Open diary memory from ${memory.date}`}
              >
                <BookHeart className="size-5" />
              </button>
            );
          })}

          <span className="absolute bottom-9 left-[62%] rounded-full bg-white px-4 py-1.5 text-xs font-bold tracking-wider text-rose-600 shadow-md">START</span>
          <Flag className="absolute left-[47%] top-7 size-11 fill-red-500 text-red-600 drop-shadow-xl" />
        </div>

        <div className="absolute inset-x-4 top-4 z-40 rounded-2xl border border-white/80 bg-white/90 p-4 shadow-xl backdrop-blur-md" onPointerDown={(event) => event.stopPropagation()}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-600"><MapPinned className="size-4" /> Journey map</p>
              <h2 id="journey-map-title" className="mt-1 text-xl font-semibold text-rose-950">Explore your story together</h2>
            </div>
            <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
              {goals.map((goal) => (
                <button key={goal.id} type="button" onClick={() => { setSelectedGoalId(goal.id); setSelectedMemory(null); }} className={`shrink-0 rounded-xl px-3 py-2 text-sm font-medium transition ${selectedGoal.id === goal.id ? "bg-rose-500 text-white shadow-lg shadow-rose-200" : "bg-white text-rose-950/55 ring-1 ring-rose-100 hover:bg-rose-50"}`}>
                  {goal.name}
                </button>
              ))}
              <Button type="button" variant="secondary" size="sm" className="shrink-0 bg-rose-50 text-rose-700" onClick={() => setIsExpanded((expanded) => { const nextExpanded = !expanded; setMapPosition({ x: 0, y: nextExpanded ? -40 : -320 }); return nextExpanded; })}>
                {isExpanded ? <Minimize2 /> : <Maximize2 />}
                {isExpanded ? "Minimize" : "Expand map"}
              </Button>
              <Button type="button" variant="secondary" size="sm" className="shrink-0 bg-rose-50 text-rose-700" onClick={() => setMapPosition({ x: 0, y: isExpanded ? -40 : -320 })}><RotateCcw /> Reset</Button>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute left-4 top-32 z-30 rounded-xl bg-white/85 px-3 py-2 text-xs font-medium text-rose-700 shadow-lg backdrop-blur-sm">Drag anywhere to explore</div>

        <div className="pointer-events-none absolute bottom-4 left-4 rounded-2xl bg-rose-600/95 px-4 py-3 text-white shadow-xl backdrop-blur-sm">
          <p className="font-semibold">{selectedGoal.name}</p>
          <p className="mt-0.5 text-sm text-white/75">{Math.round(progress)}% complete · ₱{selectedGoal.currentAmount.toLocaleString()} saved</p>
        </div>

        {selectedMemory && (
          <div className="absolute inset-x-4 top-1/2 z-40 mx-auto max-w-sm -translate-y-1/2 rounded-3xl border border-rose-100 bg-white p-5 shadow-2xl" onPointerDown={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-pink-100 text-pink-600"><BookHeart /></span>
              <Button type="button" variant="ghost" size="icon" onClick={() => setSelectedMemory(null)} aria-label="Close memory"><X /></Button>
            </div>
            <p className="mt-4 text-lg leading-7 text-rose-950">“{selectedMemory.message}”</p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs font-medium text-rose-500">
              <span>{selectedMemory.date}</span>
              {selectedMemory.location && <span className="flex items-center gap-1"><MapPin className="size-3.5" />{selectedMemory.location}</span>}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
