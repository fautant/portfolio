import { notFound } from "next/navigation";
import { StructureEditor } from "@/components/outils/structure/StructureEditor";
import { getProject } from "../../../actions";

export default async function StructurePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();
  return <StructureEditor projectId={project.id} initialName={project.name} initialSiteType={project.siteType} initialBrief={project.brief} />;
}
