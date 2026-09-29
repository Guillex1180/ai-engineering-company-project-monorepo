import type { CandidateStage, CandidateStatus } from "@/types/candidate";
import {
  STAGE_BADGE_CLASSES,
  STAGE_LABELS,
  STATUS_BADGE_CLASSES,
  STATUS_LABELS
} from "@/lib/labels";

const base =
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";

export function StatusBadge({ status }: { status: CandidateStatus }) {
  return (
    <span className={`${base} ${STATUS_BADGE_CLASSES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

export function StageBadge({ stage }: { stage: CandidateStage }) {
  return (
    <span className={`${base} ${STAGE_BADGE_CLASSES[stage]}`}>
      {STAGE_LABELS[stage]}
    </span>
  );
}
