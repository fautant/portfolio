import { notFound } from "next/navigation";
import { FinalAssembly } from "@/components/outils/final/FinalAssembly";
import { buildPrompt, sanitize, sanitizeTips } from "@/lib/outils/lexique";
import { getProject } from "../../../../actions";

export default async function FinalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  const lexiquePrompt = buildPrompt(sanitize(project.lexique.state), sanitizeTips(project.lexique.tips));

  return <FinalAssembly projectId={project.id} name={project.name} siteType={project.siteType} brief={project.brief} lexiquePrompt={lexiquePrompt} config={project.build} />;
}
