import { cn } from "@/lib/utils";

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    operational: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20",
    maintenance: "bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-amber-500/20",
    retired: "bg-muted text-muted-foreground ring-border",
    missing: "bg-rose-500/15 text-rose-600 dark:text-rose-400 ring-rose-500/20",
    completed: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20",
    in_progress: "bg-blue-500/15 text-blue-600 dark:text-blue-400 ring-blue-500/20",
    scheduled: "bg-secondary text-secondary-foreground ring-border",
    overdue: "bg-rose-500/15 text-rose-600 dark:text-rose-400 ring-rose-500/20",
    approved: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20",
    pending: "bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-amber-500/20",
    rejected: "bg-rose-500/15 text-rose-600 dark:text-rose-400 ring-rose-500/20",
    open: "bg-rose-500/15 text-rose-600 dark:text-rose-400 ring-rose-500/20",
    investigating: "bg-blue-500/15 text-blue-600 dark:text-blue-400 ring-blue-500/20",
    resolved: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20",
    low: "bg-secondary text-secondary-foreground ring-border",
    medium: "bg-blue-500/15 text-blue-600 dark:text-blue-400 ring-blue-500/20",
    high: "bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-amber-500/20",
    critical: "bg-rose-500/15 text-rose-600 dark:text-rose-400 ring-rose-500/20",
    excellent: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20",
    good: "bg-blue-500/15 text-blue-600 dark:text-blue-400 ring-blue-500/20",
    fair: "bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-amber-500/20",
    poor: "bg-rose-500/15 text-rose-600 dark:text-rose-400 ring-rose-500/20",
  };
  
  const cls = map[status] ?? "bg-secondary text-secondary-foreground ring-border";
  
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ring-1 ring-inset capitalize transition-colors duration-300",
      cls
    )}>
      {status.replace("_", " ")}
    </span>
  );
}
