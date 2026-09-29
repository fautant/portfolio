import { notFound } from "next/navigation";
import { MaquetteBuilder } from "@/components/outils/maquette/MaquetteBuilder";
import { buildPrompt, sanitize, sanitizeTips } from "@/lib/outils/lexique";
import { getProject, listPrompts } from "../../../../actions";

export default async function MaquettesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  const lexiquePrompt = buildPrompt(sanitize(project.lexique.state), sanitizeTips(project.lexique.tips));
  const history = await listPrompts(project.id);

  return (
    <MaquetteBuilder
      projectId={project.id}
      name={project.name}
      siteType={project.siteType}
      brief={project.brief}
      lexiquePrompt={lexiquePrompt}
      initialConfig={project.maquettes}
      history={history}
    />
  );
}
