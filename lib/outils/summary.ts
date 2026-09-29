import type { ProjectSummary } from "@/components/outils/projets/ProjectList";
import type { Project } from "@/lib/validations/design-project";
import { PARAM_COUNT, filledCount, sanitize } from "./lexique";
import { completenessPct } from "./project";

/** Résumé d'un projet pour le tableau de bord et la liste (progression de chaque outil) */
export function summarize(p: Project, prompts: Record<string, number>): ProjectSummary {
  return {
    id: p.id,
    name: p.name,
    siteType: p.siteType,
    updatedAt: p.updatedAt,
    briefPct: completenessPct(p.brief),
    lexiqueDone: filledCount(sanitize(p.lexique.state)),
    lexiqueTotal: PARAM_COUNT,
    maquettePrompts: prompts[p.id] ?? 0,
    exportData: { name: p.name, siteType: p.siteType, brief: p.brief, lexique: p.lexique, maquettes: p.maquettes },
  };
}
