import Link from "next/link";
import { ProjectRows } from "@/components/outils/projets/ProjectList";
import { summarize } from "@/lib/outils/summary";
import { listProjects } from "../actions";

export default async function OutilsHome() {
  const projects = await listProjects();
  const recent = projects.slice(0, 4).map((p) => summarize(p));

  return (
    <>
      <span className="o-tag">[ESPACE PRIVÉ]</span>
      <h1 className="o-h1">
        Mes <em>outils</em>
      </h1>
      <p className="o-lead">Les outils que j’utilise pour concevoir et prompter. Cette page n’est pas référencée et nécessite une connexion.</p>

      <section className="o-section" style={{ marginTop: 0 }}>
        <h2>Design</h2>
        <p>Du besoin au support final, section par section : cinq étapes chaînées autour d’un même projet (site, app, CV, carte de visite, flyer…).</p>
        <div className="o-grid">
          <Link className="o-card" href="/outils/projets">
            <span className="n">01</span>
            <h3>Structure</h3>
            <p>Choisir le support (CV, portfolio, landing…) puis ses sections, leur ordre et leur mise en page.</p>
            <span className="go">Ouvrir →</span>
          </Link>
          <Link className="o-card" href={projects[0] ? `/outils/projets/${projects[0].id}/contexte` : "/outils/projets"}>
            <span className="n">02</span>
            <h3>Contexte</h3>
            <p>Un formulaire qui s’adapte au support : cible, objectifs, contenus de chaque section.</p>
            <span className="go">{projects[0] ? "Ouvrir →" : "Créer un projet d’abord →"}</span>
          </Link>
          <Link className="o-card" href="/outils/lexique">
            <span className="n">03</span>
            <h3>Lexique du prompt design</h3>
            <p>Les 14 paramètres à donner à une IA pour fixer la direction artistique, avec exemples visuels.</p>
            <span className="go">Ouvrir →</span>
          </Link>
          <Link className="o-card" href={projects[0] ? `/outils/projets/${projects[0].id}/sections` : "/outils/projets"}>
            <span className="n">04</span>
            <h3>Sections</h3>
            <p>Un prompt par section à coller dans Claude Design, avec suivi et retouches rapides.</p>
            <span className="go">{projects[0] ? "Ouvrir →" : "Créer un projet d’abord →"}</span>
          </Link>
          <Link className="o-card" href={projects[0] ? `/outils/projets/${projects[0].id}/final` : "/outils/projets"}>
            <span className="n">05</span>
            <h3>Prompt final</h3>
            <p>Assembler toutes les sections en un résultat cohérent, prêt à exporter.</p>
            <span className="go">{projects[0] ? "Ouvrir →" : "Créer un projet d’abord →"}</span>
          </Link>
        </div>
      </section>

      <section className="o-section">
        <h2>Projets récents</h2>
        <p>
          <Link href="/outils/projets" style={{ textDecoration: "underline" }}>
            Tous les projets
          </Link>
        </p>
        <ProjectRows projects={recent} compact />
      </section>
    </>
  );
}
