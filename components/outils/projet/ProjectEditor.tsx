"use client";

import Link from "next/link";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { saveProjectPart, updateProjectMeta } from "@/app/outils/(prive)/actions";
import { ALL_FEATURES, GUIDED_QUESTIONS, SECTION_LIBRARY, SITE_TYPE_LABELS, TEMPLATES, newId } from "@/data/outils/project-templates";
import { useAutosave } from "@/hooks/useAutosave";
import { briefFromTemplate, briefMarkdown, completenessItems, completenessPct, templatePages } from "@/lib/outils/project";
import { SITE_TYPES, type Brief, type ProjectPage, type SiteType } from "@/lib/validations/design-project";
import { ProjectStepper } from "../ProjectStepper";
import { SaveStatus } from "../SaveStatus";

interface Props {
  projectId: string;
  initialName: string;
  initialSiteType: SiteType;
  initialBrief: Brief;
}

export function ProjectEditor({ projectId, initialName, initialSiteType, initialBrief }: Props) {
  const [name, setName] = useState(initialName);
  const [siteType, setSiteType] = useState<SiteType>(initialSiteType);
  const [brief, setBrief] = useState<Brief>(initialBrief);
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const save = useCallback((b: Brief) => saveProjectPart(projectId, "brief", b), [projectId]);
  const { schedule, flush, status } = useAutosave(save);

  const tpl = TEMPLATES[siteType];
  const unit = tpl.unit;
  const items = useMemo(() => completenessItems(brief), [brief]);
  const pct = completenessPct(brief);
  const missing = items.filter((i) => !i.done);

  function update(next: Brief) {
    setBrief(next);
    schedule(next);
  }
  const patch = (p: Partial<Brief>) => update({ ...brief, ...p });

  async function changeType(t: SiteType) {
    if (t === siteType) return;
    const hasWork = brief.pages.some((p) => p.goal.trim() || p.content.trim());
    const replace = !brief.pages.length || !hasWork || window.confirm(`Remplacer les ${brief.pages.length} pages actuelles par le modèle « ${SITE_TYPE_LABELS[t]} » ? Tes textes seront perdus.`);
    setSiteType(t);
    await updateProjectMeta(projectId, { siteType: t });
    if (replace) {
      const fresh = briefFromTemplate(t);
      update({ ...brief, pages: fresh.pages, features: fresh.features });
    }
  }

  /* ---------- Pages ---------- */
  const setPage = (id: string, p: Partial<ProjectPage>) => patch({ pages: brief.pages.map((x) => (x.id === id ? { ...x, ...p } : x)) });
  const movePage = (i: number, d: -1 | 1) => {
    const pages = [...brief.pages];
    const j = i + d;
    if (j < 0 || j >= pages.length) return;
    [pages[i], pages[j]] = [pages[j]!, pages[i]!];
    patch({ pages });
  };
  const addPage = (init?: Partial<ProjectPage>) =>
    patch({ pages: [...brief.pages, { id: newId(), name: "", goal: "", priority: "mvp", sections: [], contentReady: "no", content: "", ...init }] });
  const missingTemplatePages = templatePages(siteType).filter((tp) => !brief.pages.some((p) => p.name.trim().toLowerCase() === tp.name.toLowerCase()));

  function makeBrief() {
    void flush();
    setMarkdown(briefMarkdown(name, siteType, brief));
    setCopied(false);
  }
  async function copyBrief() {
    if (!markdown) return;
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <>
      <ProjectStepper projectId={projectId} name={name || "Projet"} current="projet" status={<SaveStatus status={status} />} />
      <div className="pj-layout">
        <div className="pj-main">
          <span className="o-tag">[01 — PROJET]</span>
          <h1 className="o-h1">
            Détaille ton <em>projet</em>
          </h1>
          <p className="o-lead">Plus le brief est précis, meilleures seront les maquettes. Chaque bloc pose les bonnes questions ; l’assistant à droite suit la complétude.</p>

          {/* 1. Identité */}
          <Block id="identite" n="1" title="Identité" questions={GUIDED_QUESTIONS.identity}>
            <div className="pj-two">
              <label className="o-field">
                <span>Nom du projet</span>
                <input
                  value={name}
                  maxLength={120}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => name.trim() && updateProjectMeta(projectId, { name })}
                />
              </label>
              <label className="o-field">
                <span>Type de site</span>
                <select value={siteType} onChange={(e) => changeType(e.target.value as SiteType)}>
                  {SITE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {SITE_TYPE_LABELS[t]}
                    </option>
                  ))}
                </select>
                <small>{tpl.description} Changer de type propose un nouveau modèle de {unit}s.</small>
              </label>
            </div>
            <label className="o-field">
              <span>Pitch en une phrase</span>
              <textarea value={brief.pitch} maxLength={400} onChange={(e) => patch({ pitch: e.target.value })} placeholder="Ex. : Un portfolio one-page qui présente mes projets Symfony à des recruteurs pressés." />
            </label>
            <label className="o-field">
              <span>Secteur / univers</span>
              <input value={brief.sector} maxLength={200} onChange={(e) => patch({ sector: e.target.value })} placeholder="Ex. : développement web, photographie, restauration…" />
            </label>
          </Block>

          {/* 2. Objectif & cible */}
          <Block id="objectif" n="2" title="Objectif & cible" questions={GUIDED_QUESTIONS.audience}>
            <div className="pj-list">
              {brief.audience.map((a) => (
                <div className="pj-item" key={a.id}>
                  <input aria-label="Persona" value={a.name} maxLength={120} placeholder="Persona (ex. recruteur tech pressé)" onChange={(e) => patch({ audience: brief.audience.map((x) => (x.id === a.id ? { ...x, name: e.target.value } : x)) })} />
                  <input aria-label="Besoin" value={a.need} maxLength={400} placeholder="Son besoin ou sa peur" onChange={(e) => patch({ audience: brief.audience.map((x) => (x.id === a.id ? { ...x, need: e.target.value } : x)) })} />
                  <button className="o-btn sm danger" type="button" aria-label="Supprimer ce persona" onClick={() => patch({ audience: brief.audience.filter((x) => x.id !== a.id) })}>
                    ✕
                  </button>
                </div>
              ))}
              <button className="o-btn sm" type="button" onClick={() => patch({ audience: [...brief.audience, { id: newId(), name: "", need: "" }] })}>
                + Ajouter un persona
              </button>
            </div>
            <div className="pj-two" style={{ marginTop: 16 }}>
              <label className="o-field">
                <span>Action principale à faire faire</span>
                <input value={brief.mainAction} maxLength={300} onChange={(e) => patch({ mainAction: e.target.value })} placeholder="Ex. : m’envoyer un email" />
              </label>
              <label className="o-field">
                <span>Émotion à garder en partant</span>
                <input value={brief.emotion} maxLength={300} onChange={(e) => patch({ emotion: e.target.value })} placeholder="Ex. : confiance, curiosité" />
              </label>
            </div>
            <label className="o-field">
              <span>Comment saurez-vous que c’est réussi ?</span>
              <textarea value={brief.kpis} maxLength={600} onChange={(e) => patch({ kpis: e.target.value })} placeholder="Ex. : 5 demandes de contact par mois, CV téléchargé…" />
            </label>
          </Block>

          {/* 3. Arborescence */}
          <Block id="arborescence" n="3" title={`Arborescence (${unit}s)`} questions={GUIDED_QUESTIONS.pages}>
            {missingTemplatePages.length > 0 && (
              <div className="pj-suggest">
                <b>Suggestions pour « {tpl.label} » :</b>
                {missingTemplatePages.map((tp) => (
                  <button key={tp.name} className="o-btn sm" type="button" onClick={() => addPage({ name: tp.name, goal: tp.goal, priority: tp.priority, sections: tp.sections })}>
                    + {tp.name}
                  </button>
                ))}
              </div>
            )}
            <div className="pj-pages">
              {brief.pages.map((p, i) => (
                <PageCard
                  key={p.id}
                  index={i}
                  total={brief.pages.length}
                  unit={unit}
                  page={p}
                  onChange={(x) => setPage(p.id, x)}
                  onMove={(d) => movePage(i, d)}
                  onDelete={() => patch({ pages: brief.pages.filter((x) => x.id !== p.id) })}
                />
              ))}
              {!brief.pages.length && <div className="o-empty">Aucune {unit} pour l’instant.</div>}
            </div>
            <button className="o-btn" type="button" style={{ marginTop: 12 }} onClick={() => addPage()}>
              + Ajouter une {unit}
            </button>
          </Block>

          {/* 4. Fonctionnalités & contenu */}
          <Block id="contenu" n="4" title="Fonctionnalités & contenu" questions={GUIDED_QUESTIONS.features}>
            <div className="pj-checks" role="group" aria-label="Fonctionnalités">
              {Array.from(new Set<string>([...ALL_FEATURES, ...brief.features])).map((f) => (
                <label key={f} className={`pj-check ${tpl.features.includes(f) ? "sug" : ""}`}>
                  <input type="checkbox" checked={brief.features.includes(f)} onChange={(e) => patch({ features: e.target.checked ? [...brief.features, f] : brief.features.filter((x) => x !== f) })} />
                  {f}
                </label>
              ))}
            </div>
            <p className="pj-note">Les fonctionnalités soulignées sont suggérées pour « {tpl.label} ».</p>
            <CustomFeature onAdd={(f) => !brief.features.includes(f) && patch({ features: [...brief.features, f] })} />
            <h3 className="pj-h3">Contenu disponible par {unit}</h3>
            <p className="pj-note">Avec de vrais textes, la maquette évite le lorem ipsum et reste crédible.</p>
            {brief.pages.map((p) => (
              <details key={p.id} className="pj-content">
                <summary>
                  {p.name || "Sans titre"} <em>{p.contentReady === "yes" ? "contenu prêt" : p.contentReady === "partial" ? "contenu partiel" : "contenu à écrire"}</em>
                </summary>
                <label className="o-field">
                  <span>État du contenu</span>
                  <select value={p.contentReady} onChange={(e) => setPage(p.id, { contentReady: e.target.value as ProjectPage["contentReady"] })}>
                    <option value="no">À écrire</option>
                    <option value="partial">Partiel</option>
                    <option value="yes">Prêt</option>
                  </select>
                </label>
                <label className="o-field">
                  <span>Textes, titres, projets à utiliser</span>
                  <textarea value={p.content} maxLength={8000} onChange={(e) => setPage(p.id, { content: e.target.value })} placeholder="Colle ici les vrais contenus de cette page." style={{ minHeight: 120 }} />
                </label>
              </details>
            ))}
          </Block>

          {/* 5. Contraintes */}
          <Block id="contraintes" n="5" title="Contraintes" questions={GUIDED_QUESTIONS.constraints}>
            <div className="pj-two">
              <label className="o-field">
                <span>Priorité d’appareil</span>
                <select value={brief.constraints.priority} onChange={(e) => patch({ constraints: { ...brief.constraints, priority: e.target.value as Brief["constraints"]["priority"] } })}>
                  <option value="both">Mobile et desktop à égalité</option>
                  <option value="mobile">Mobile d’abord</option>
                  <option value="desktop">Desktop d’abord</option>
                </select>
              </label>
              <label className="o-field">
                <span>Accessibilité</span>
                <select value={brief.constraints.a11y} onChange={(e) => patch({ constraints: { ...brief.constraints, a11y: e.target.value as Brief["constraints"]["a11y"] } })}>
                  <option value="basic">De base</option>
                  <option value="aa">WCAG AA</option>
                  <option value="aaa">WCAG AAA</option>
                </select>
              </label>
              <label className="o-field">
                <span>Langues</span>
                <input value={brief.constraints.languages} maxLength={120} onChange={(e) => patch({ constraints: { ...brief.constraints, languages: e.target.value } })} placeholder="Ex. : français, anglais" />
              </label>
              <label className="o-field">
                <span>Techno cible</span>
                <input value={brief.constraints.tech} maxLength={200} onChange={(e) => patch({ constraints: { ...brief.constraints, tech: e.target.value } })} placeholder="Ex. : Next.js + Tailwind" />
              </label>
              <label className="o-field">
                <span>Échéance</span>
                <input value={brief.constraints.deadline} maxLength={120} onChange={(e) => patch({ constraints: { ...brief.constraints, deadline: e.target.value } })} placeholder="Ex. : fin novembre" />
              </label>
            </div>
          </Block>

          {/* 6. Identité existante */}
          <Block id="identite-visuelle" n="6" title="Identité visuelle existante" questions={GUIDED_QUESTIONS.identity2}>
            <div className="pj-two">
              <label className="o-field">
                <span>Logo</span>
                <select value={brief.identity.logo} onChange={(e) => patch({ identity: { ...brief.identity, logo: e.target.value as "yes" | "no" } })}>
                  <option value="no">Pas de logo</option>
                  <option value="yes">Un logo existe</option>
                </select>
              </label>
              <label className="o-field">
                <span>Couleurs imposées</span>
                <input value={brief.identity.colors} maxLength={300} onChange={(e) => patch({ identity: { ...brief.identity, colors: e.target.value } })} placeholder="Ex. : #FF5C93, #FF9357" />
              </label>
              <label className="o-field">
                <span>Polices imposées</span>
                <input value={brief.identity.fonts} maxLength={300} onChange={(e) => patch({ identity: { ...brief.identity, fonts: e.target.value } })} placeholder="Ex. : Poppins" />
              </label>
            </div>
            <h3 className="pj-h3">Références</h3>
            <div className="pj-list">
              {brief.identity.refs.map((r) => (
                <div className="pj-item" key={r.id}>
                  <input aria-label="Lien" value={r.url} maxLength={400} placeholder="Lien du site" onChange={(e) => patch({ identity: { ...brief.identity, refs: brief.identity.refs.map((x) => (x.id === r.id ? { ...x, url: e.target.value } : x)) } })} />
                  <input aria-label="Ce que j'en retiens" value={r.keep} maxLength={300} placeholder="Ce que j’en retiens (la typo ? le rythme ?)" onChange={(e) => patch({ identity: { ...brief.identity, refs: brief.identity.refs.map((x) => (x.id === r.id ? { ...x, keep: e.target.value } : x)) } })} />
                  <button className="o-btn sm danger" type="button" aria-label="Supprimer cette référence" onClick={() => patch({ identity: { ...brief.identity, refs: brief.identity.refs.filter((x) => x.id !== r.id) } })}>
                    ✕
                  </button>
                </div>
              ))}
              <button className="o-btn sm" type="button" onClick={() => patch({ identity: { ...brief.identity, refs: [...brief.identity.refs, { id: newId(), url: "", keep: "" }] } })}>
                + Ajouter une référence
              </button>
            </div>
          </Block>

          <div className="pj-next">
            <Link className="o-btn primary" href={`/outils/projets/${projectId}/lexique`}>
              Étape suivante : le Lexique du prompt →
            </Link>
          </div>
        </div>

        <aside className="pj-assist" aria-label="Assistant">
          <h2 className="o-h2" style={{ fontSize: 28 }}>
            Assistant
          </h2>
          <div className="o-prog">
            <span>Brief complet à {pct} %</span>
            <i>
              <b style={{ width: `${pct}%` }} />
            </i>
          </div>
          {missing.length ? (
            <>
              <p className="pj-note">Il manque encore :</p>
              <ul className="pj-missing">
                {missing.map((m) => (
                  <li key={m.id}>
                    <a href={`#${m.block}`}>{m.label}</a>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="o-msg sent">Brief complet : tu peux passer au Lexique.</p>
          )}
          <button className="o-btn primary" type="button" onClick={makeBrief} style={{ width: "100%", justifyContent: "center" }}>
            Générer le brief (Markdown)
          </button>
          {markdown !== null && (
            <div className="pj-md">
              <textarea readOnly value={markdown} aria-label="Brief au format Markdown" />
              <button className="o-btn sm" type="button" onClick={copyBrief}>
                {copied ? "✓ Copié" : "Copier"}
              </button>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}

function Block({ id, n, title, questions, children }: { id: string; n: string; title: string; questions: readonly string[]; children: ReactNode }) {
  return (
    <section className="pj-block" id={id}>
      <div className="pj-head">
        <span className="pj-num">{n}</span>
        <h2>{title}</h2>
      </div>
      <details className="pj-q">
        <summary>Questions à se poser</summary>
        <ul>
          {questions.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      </details>
      {children}
    </section>
  );
}

function CustomFeature({ onAdd }: { onAdd: (f: string) => void }) {
  const [v, setV] = useState("");
  return (
    <div className="o-row" style={{ marginTop: 8 }}>
      <input className="o-input" style={{ maxWidth: 280 }} value={v} maxLength={80} placeholder="Autre fonctionnalité…" onChange={(e) => setV(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && v.trim()) { onAdd(v.trim()); setV(""); } }} />
      <button className="o-btn sm" type="button" disabled={!v.trim()} onClick={() => { onAdd(v.trim()); setV(""); }}>
        Ajouter
      </button>
    </div>
  );
}

function PageCard({ index, total, unit, page, onChange, onMove, onDelete }: { index: number; total: number; unit: string; page: ProjectPage; onChange: (p: Partial<ProjectPage>) => void; onMove: (d: -1 | 1) => void; onDelete: () => void }) {
  const [custom, setCustom] = useState("");
  const addSection = (s: string) => s.trim() && !page.sections.includes(s.trim()) && onChange({ sections: [...page.sections, s.trim()] });
  return (
    <article className="pj-page">
      <div className="pj-page-head">
        <span className="pj-idx">{String(index + 1).padStart(2, "0")}</span>
        <input aria-label={`Nom de la ${unit}`} value={page.name} maxLength={120} placeholder={`Nom de la ${unit}`} onChange={(e) => onChange({ name: e.target.value })} />
        <select aria-label="Priorité" value={page.priority} onChange={(e) => onChange({ priority: e.target.value as ProjectPage["priority"] })}>
          <option value="mvp">MVP</option>
          <option value="later">Plus tard</option>
        </select>
        <button className="o-btn sm" type="button" aria-label="Monter" disabled={index === 0} onClick={() => onMove(-1)}>↑</button>
        <button className="o-btn sm" type="button" aria-label="Descendre" disabled={index === total - 1} onClick={() => onMove(1)}>↓</button>
        <button className="o-btn sm danger" type="button" aria-label={`Supprimer la ${unit}`} onClick={onDelete}>✕</button>
      </div>
      <label className="o-field" style={{ marginTop: 10 }}>
        <span>Objectif de la {unit}</span>
        <input value={page.goal} maxLength={400} onChange={(e) => onChange({ goal: e.target.value })} placeholder="Que doit-elle accomplir pour le visiteur ?" />
      </label>
      <div className="pj-sections">
        <span className="pj-label">Sections (dans l’ordre)</span>
        <ol>
          {page.sections.map((s, i) => (
            <li key={s + i}>
              <span>{s}</span>
              <button type="button" aria-label="Monter la section" disabled={i === 0} onClick={() => { const a = [...page.sections]; [a[i - 1], a[i]] = [a[i]!, a[i - 1]!]; onChange({ sections: a }); }}>↑</button>
              <button type="button" aria-label="Descendre la section" disabled={i === page.sections.length - 1} onClick={() => { const a = [...page.sections]; [a[i + 1], a[i]] = [a[i]!, a[i + 1]!]; onChange({ sections: a }); }}>↓</button>
              <button type="button" aria-label="Retirer la section" onClick={() => onChange({ sections: page.sections.filter((_, k) => k !== i) })}>✕</button>
            </li>
          ))}
        </ol>
        <div className="o-row">
          <select aria-label="Ajouter une section de la bibliothèque" value="" onChange={(e) => addSection(e.target.value)}>
            <option value="">+ Section de la bibliothèque…</option>
            {SECTION_LIBRARY.filter((s) => !page.sections.includes(s)).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input className="o-input" style={{ maxWidth: 220 }} value={custom} maxLength={120} placeholder="Section libre…" onChange={(e) => setCustom(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { addSection(custom); setCustom(""); } }} />
          <button className="o-btn sm" type="button" disabled={!custom.trim()} onClick={() => { addSection(custom); setCustom(""); }}>
            Ajouter
          </button>
        </div>
      </div>
    </article>
  );
}
