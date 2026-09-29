import Link from "next/link";
import type { ReactNode } from "react";

const STEPS = [
  { key: "projet", n: "01", label: "Projet", href: (id: string) => `/outils/projets/${id}` },
  { key: "lexique", n: "02", label: "Lexique", href: (id: string) => `/outils/projets/${id}/lexique` },
  { key: "maquettes", n: "03", label: "Maquette", href: (id: string) => `/outils/projets/${id}/maquettes` },
] as const;

/** Fil d'Ariane Projet → Lexique → Maquette, affiché en haut des pages d'un projet */
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
