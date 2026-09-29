import { NewProjectForm, ProjectRows } from "@/components/outils/projets/ProjectList";
import { summarize } from "@/lib/outils/summary";
import { countPrompts, listProjects } from "../../actions";

export default async function ProjetsPage() {
  const [projects, prompts] = await Promise.all([listProjects(), countPrompts()]);
  return (
    <>
      <span className="o-tag">[MES PROJETS]</span>
      <h1 className="o-h1">
        Mes <em>projets</em>
      </h1>
      <p className="o-lead">Chaque projet regroupe son brief, sa direction artistique (Lexique) et ses maquettes. Tout est enregistré automatiquement.</p>
      <section className="o-section" style={{ marginTop: 0 }}>
        <h2>Nouveau projet</h2>
        <NewProjectForm />
      </section>
      <section className="o-section">
        <h2>Projets ({projects.length})</h2>
        <ProjectRows projects={projects.map((p) => summarize(p, prompts))} />
      </section>
    </>
  );
}
