"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { createProject, deleteProject, duplicateProject, importProject } from "@/app/outils/(prive)/actions";
import { SITE_TYPE_LABELS } from "@/data/outils/project-templates";
import { SITE_TYPES, type SiteType } from "@/lib/validations/design-project";

export interface ProjectSummary {
  id: string;
  name: string;
  siteType: SiteType;
  updatedAt: string;
  briefPct: number;
  lexiqueDone: number;
  lexiqueTotal: number;
  maquettePrompts: number;
  /** Données complètes pour l'export JSON */
  exportData: unknown;
}

const fmt = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

export function ProgressBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="o-prog">
      <span>{label}</span>
      <i>
        <b style={{ width: `${Math.min(100, value)}%` }} />
      </i>
    </div>
  );
}

export function ProjectRows({ projects, compact }: { projects: ProjectSummary[]; compact?: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function act(fn: () => Promise<{ ok: boolean; error?: string }>) {
    setError(null);
    start(async () => {
      const r = await fn();
      if (!r.ok) setError(r.error ?? "Action impossible");
      router.refresh();
    });
  }

  function exportJson(p: ProjectSummary) {
    const blob = new Blob([JSON.stringify(p.exportData, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${p.name.replace(/[^\w-]+/g, "-").toLowerCase() || "projet"}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  if (!projects.length) return <div className="o-empty">Aucun projet pour l’instant. Crée-en un pour commencer.</div>;
  return (
    <>
      {error && <p className="o-msg error">{error}</p>}
      <div className="o-plist" aria-busy={pending}>
        {projects.map((p) => (
          <div className="o-prow" key={p.id}>
            <div>
              <h3>
                <Link href={`/outils/projets/${p.id}`}>{p.name}</Link>
              </h3>
              <small>
                {SITE_TYPE_LABELS[p.siteType]} · modifié le {fmt(p.updatedAt)}
              </small>
              <div className="o-prog-list" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
                <ProgressBar label={`Projet ${p.briefPct} %`} value={p.briefPct} />
                <ProgressBar label={`Lexique ${p.lexiqueDone}/${p.lexiqueTotal}`} value={(p.lexiqueDone / p.lexiqueTotal) * 100} />
                <ProgressBar label={`Maquettes : ${p.maquettePrompts} prompt${p.maquettePrompts > 1 ? "s" : ""}`} value={Math.min(100, p.maquettePrompts * 25)} />
              </div>
            </div>
            <div className="o-row">
              <Link className="o-btn sm primary" href={`/outils/projets/${p.id}`}>
                Ouvrir
              </Link>
              {!compact && (
                <>
                  <button className="o-btn sm" type="button" disabled={pending} onClick={() => act(() => duplicateProject(p.id))}>
                    Dupliquer
                  </button>
                  <button className="o-btn sm" type="button" onClick={() => exportJson(p)}>
                    Exporter
                  </button>
                  <button
                    className="o-btn sm danger"
                    type="button"
                    disabled={pending}
                    onClick={() => window.confirm(`Supprimer définitivement « ${p.name} » et son historique de prompts ?`) && act(() => deleteProject(p.id))}
                  >
                    Supprimer
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function NewProjectForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [siteType, setSiteType] = useState<SiteType>("portfolio-dev");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    start(async () => {
      const r = await createProject({ name, siteType });
      if (r.ok && r.data) router.push(`/outils/projets/${r.data.id}`);
      else setError(r.error ?? "Création impossible");
    });
  }

  async function onImport(file: File | undefined) {
    if (!file) return;
    setError(null);
    try {
      const json: unknown = JSON.parse(await file.text());
      start(async () => {
        const r = await importProject(json);
        if (r.ok && r.data) router.push(`/outils/projets/${r.data.id}`);
        else setError(r.error ?? "Import impossible");
      });
    } catch {
      setError("Ce fichier n’est pas un JSON valide.");
    }
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <form className="o-new" onSubmit={submit}>
      <label className="o-field">
        <span>Nom du projet</span>
        <input value={name} maxLength={120} required onChange={(e) => setName(e.target.value)} placeholder="Ex. : Portfolio 2026" />
      </label>
      <label className="o-field">
        <span>Type de site</span>
        <select value={siteType} onChange={(e) => setSiteType(e.target.value as SiteType)}>
          {SITE_TYPES.map((t) => (
            <option key={t} value={t}>
              {SITE_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </label>
      <div className="o-row" style={{ alignItems: "flex-end", marginBottom: 14 }}>
        <button className="o-btn primary" type="submit" disabled={pending || !name.trim()}>
          Créer le projet
        </button>
        <button className="o-btn" type="button" disabled={pending} onClick={() => fileRef.current?.click()}>
          Importer un JSON
        </button>
        <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={(e) => onImport(e.target.files?.[0])} />
      </div>
      {error && <p className="o-msg error">{error}</p>}
    </form>
  );
}
