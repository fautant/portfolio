import type { ProjectSummary } from "@/components/outils/projets/ProjectList";
import type { Project } from "@/lib/validations/design-project";
import { PARAM_COUNT, filledCount, sanitize } from "./lexique";
import { completenessPct, sectionProgress } from "./project";

/** Résumé d'un projet pour le tableau de bord et la liste (progression de chaque étape) */
export function summarize(p: Project): ProjectSummary {
  const progress = sectionProgress(p.brief);
  return {
    id: p.id,
    name: p.name,
    siteType: p.siteType,
    updatedAt: p.updatedAt,
    briefPct: completenessPct(p.brief, p.siteType),
    lexiqueDone: filledCount(sanitize(p.lexique.state)),
    lexiqueTotal: PARAM_COUNT,
    sectionsOk: progress.ok,
    sectionsCopied: progress.copied,
    sectionsTotal: progress.total,
    exportData: { name: p.name, siteType: p.siteType, brief: p.brief, lexique: p.lexique, maquettes: p.build },
  };
}
