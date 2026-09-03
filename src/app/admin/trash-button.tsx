"use client";

import { ConfirmButton } from "./confirm-button";
import { moveToTrash } from "./trash-actions";
import type { TrashKind } from "@/lib/types";

export function TrashButton({
  kind,
  id,
  label,
  className = "rounded-lg border border-line bg-ink-800 px-3 py-1.5 text-xs font-medium text-mist transition-colors hover:border-amber-500/50 hover:text-amber-400",
}: {
  kind: TrashKind;
  id: string;
  label: string;
  className?: string;
}) {
  return (
    <form action={moveToTrash}>
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="id" value={id} />
      <ConfirmButton
        message={`Move “${label}” to trash? You can restore it later from Trash.`}
        className={className}
      >
        Move to trash
      </ConfirmButton>
    </form>
  );
}
