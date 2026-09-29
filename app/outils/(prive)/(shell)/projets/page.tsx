import { NewProjectForm, ProjectRows } from "@/components/outils/projets/ProjectList";
import { summarize } from "@/lib/outils/summary";
import { listProjects } from "../../actions";

export default async function ProjetsPage() {
  const projects = await listProjects();
  return (
    <>
      <span className="o-tag">[MES PROJETS]</span>
      <h1 className="o-h1">
        Mes <em>projets</em>
      </h1>
      <p className="o-lead">Chaque projet regroupe sa structure, son contexte, sa direction artistique (Lexique) et ses prompts par section. Tout est enregistré automatiquement.</p>
      <section className="o-section" style={{ marginTop: 0 }}>
        <h2>Nouveau projet</h2>
        <NewProjectForm />
      </section>
      <section className="o-section">
        <h2>Projets ({projects.length})</h2>
        <ProjectRows projects={projects.map((p) => summarize(p))} />
      </section>
    </>
  );
}
