import { cn } from "@/lib/utils";

export function PaymentBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid: "bg-success/10 text-success",
    partial: "bg-warning/10 text-warning",
    pending: "bg-muted text-muted-foreground",
    overdue: "bg-destructive/10 text-destructive",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide", map[status])}>
      {status}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending: { label: "Pending", cls: "bg-muted text-muted-foreground" },
    processing: { label: "Processing", cls: "bg-info/10 text-info" },
    ready: { label: "Ready", cls: "bg-chart-3/15 text-chart-3" },
    in_transit: { label: "In Transit", cls: "bg-chart-1/15 text-chart-1" },
    delivered: { label: "Delivered", cls: "bg-success/10 text-success" },
  };
  const v = map[status] || { label: status, cls: "bg-muted" };
  return <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide", v.cls)}>{v.label}</span>;
}
