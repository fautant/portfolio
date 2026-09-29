import { redirect } from "next/navigation";

/** L'ancienne étape « Maquette » est devenue « Sections » */
export default async function MaquettesRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/outils/projets/${id}/sections`);
}
