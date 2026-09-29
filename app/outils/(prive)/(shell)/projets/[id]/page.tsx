import { notFound } from "next/navigation";
import { ProjectEditor } from "@/components/outils/projet/ProjectEditor";
import { getProject } from "../../../actions";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();
  return <ProjectEditor projectId={project.id} initialName={project.name} initialSiteType={project.siteType} initialBrief={project.brief} />;
}
