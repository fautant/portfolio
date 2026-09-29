import { notFound } from "next/navigation";
import { ContextForm } from "@/components/outils/contexte/ContextForm";
import { getProject } from "../../../../actions";

export default async function ContextPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();
  return <ContextForm projectId={project.id} name={project.name} siteType={project.siteType} initialBrief={project.brief} />;
}
