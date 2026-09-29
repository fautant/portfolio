import { notFound } from "next/navigation";
import { SectionWorkbench } from "@/components/outils/sections/SectionWorkbench";
import { buildPrompt, sanitize, sanitizeTips } from "@/lib/outils/lexique";
import { getProject, listPrompts } from "../../../../actions";

export default async function SectionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  const lexiquePrompt = buildPrompt(sanitize(project.lexique.state), sanitizeTips(project.lexique.tips));
  const history = await listPrompts(project.id);

  return (
    <SectionWorkbench
      projectId={project.id}
      name={project.name}
      siteType={project.siteType}
      initialBrief={project.brief}
      lexiquePrompt={lexiquePrompt}
      initialConfig={project.build}
      history={history}
    />
  );
}
