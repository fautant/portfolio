import Link from "next/link";
import type { ReactNode } from "react";

const STEPS = [
  { key: "structure", n: "01", label: "Structure", href: (id: string) => `/outils/projets/${id}` },
  { key: "contexte", n: "02", label: "Contexte", href: (id: string) => `/outils/projets/${id}/contexte` },
  { key: "lexique", n: "03", label: "Lexique", href: (id: string) => `/outils/projets/${id}/lexique` },
  { key: "sections", n: "04", label: "Sections", href: (id: string) => `/outils/projets/${id}/sections` },
  { key: "final", n: "05", label: "Final", href: (id: string) => `/outils/projets/${id}/final` },
] as const;

/** Fil d'Ariane Structure → Contexte → Lexique → Sections → Final, affiché en haut des pages d'un projet */
export function ProjectStepper({ projectId, name, current, status }: { projectId: string; name: string; current: (typeof STEPS)[number]["key"]; status?: ReactNode }) {
  return (
    <nav className="o-stepper" aria-label="Étapes du projet">
      <span className="who">{name}</span>
      {STEPS.map((s) => (
        <Link key={s.key} href={s.href(projectId)} aria-current={s.key === current ? "page" : undefined}>
          <span>{s.n}</span>
          {s.label}
        </Link>
      ))}
      {status}
    </nav>
  );
}
