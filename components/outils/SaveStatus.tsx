import type { SaveStatus as Status } from "@/hooks/useAutosave";

const LABEL: Record<Status, string> = {
  idle: "",
  saving: "Enregistrement…",
  saved: "✓ Enregistré",
  error: "⚠ Échec de l'enregistrement",
};

export function SaveStatus({ status }: { status: Status }) {
  return (
    <span className={`o-save ${status === "error" ? "err" : ""}`} role="status" aria-live="polite">
      {LABEL[status]}
    </span>
  );
}
