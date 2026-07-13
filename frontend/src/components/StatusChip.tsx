import type { GrievanceStatus } from "../api/types";

type Tone = "neutral" | "info" | "warning" | "success";
interface StatusMeta { label: string; tone: Tone; live?: boolean; fallback?: string }

const STATUS_META: Record<string, Omit<StatusMeta, "fallback">> = {
  draft: { label: "Draft", tone: "neutral" },
  processing: { label: "Processing", tone: "info", live: true },
  awaiting_confirmation: { label: "Awaiting confirmation", tone: "info" },
  photo_mismatch: { label: "Photo needs review", tone: "warning" },
  registered: { label: "Registered", tone: "success" },
  pending_window: { label: "Grouping reports", tone: "info", live: true },
  dispatching: { label: "Sending to department", tone: "info", live: true },
  submitted: { label: "Submitted", tone: "success" },
  duplicate: { label: "Also reported", tone: "info" },
  cancelled: { label: "Cancelled", tone: "neutral" },
  dispatch_failed: { label: "Dispatch delayed", tone: "warning" },
};

export function metaForStatus(status: string): StatusMeta {
  const meta = STATUS_META[status as GrievanceStatus];
  if (meta) return meta;
  const fallbackLabel = status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
  return { label: "Status", tone: "neutral", fallback: fallbackLabel || undefined };
}

export default function StatusChip({ status }: { status: string }) {
  const meta = metaForStatus(status);
  return (
    <span className={`status-chip status-chip--${meta.tone}`} data-live={meta.live ? "true" : undefined}>
      <span>{meta.fallback ?? meta.label}</span>
    </span>
  );
}
