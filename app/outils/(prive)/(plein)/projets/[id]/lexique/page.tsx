import { notFound } from "next/navigation";
import { LexiqueProject } from "@/components/outils/lexique/LexiqueProject";
import { sanitize, sanitizeTips } from "@/lib/outils/lexique";
import { isLexiqueEmpty, suggestLexique } from "@/lib/outils/project-to-lexique";
import { getProject } from "../../../../actions";

export default async function ProjectLexiquePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  let state = sanitize(project.lexique.state);
  // Lexique encore vide : on propose « Type » et « Objectif » d'après le projet
  if (isLexiqueEmpty(state)) state = suggestLexique(project.siteType, project.brief);

  return <LexiqueProject projectId={project.id} projectName={project.name} initialState={state} initialTips={sanitizeTips(project.lexique.tips)} />;
}
