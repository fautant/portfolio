"use client";

import Link from "next/link";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { saveProjectPart, updateProjectMeta } from "@/app/outils/(prive)/actions";
import { defaultVariant, getSectionDef, sectionsFor } from "@/data/outils/sections";
import { GUIDED_QUESTIONS, SUPPORTS, newId, unitWords, type Support } from "@/data/outils/supports";
import { useAutosave } from "@/hooks/useAutosave";
import { briefFromSupport, completenessItems, makeSection } from "@/lib/outils/project";
import { SUPPORT_TYPES, type Brief, type ProjectPage, type SectionInstance, type SupportType } from "@/lib/validations/design-project";
import { ProjectStepper } from "../ProjectStepper";
import { SaveStatus } from "../SaveStatus";

interface Props {
  projectId: string;
  initialName: string;
  initialSiteType: SupportType;
  initialBrief: Brief;
}

export function StructureEditor({ projectId, initialName, initialSiteType, initialBrief }: Props) {
  const [name, setName] = useState(initialName);
  const [type, setType] = useState<SupportType>(initialSiteType);
  const [brief, setBrief] = useState<Brief>(initialBrief);

  const save = useCallback((b: Brief) => saveProjectPart(projectId, "brief", b), [projectId]);
  const { schedule, status } = useAutosave(save);

  const support = SUPPORTS[type];
  const words = unitWords(support);
  const missing = useMemo(() => completenessItems(brief, type).filter((i) => i.step === "structure" && !i.done), [brief, type]);
  const sectionCount = brief.pages.reduce((n, p) => n + p.sections.length, 0);

  function update(next: Brief) {
    setBrief(next);
    schedule(next);
  }
  const patch = (p: Partial<Brief>) => update({ ...brief, ...p });

  async function changeType(t: SupportType) {
    if (t === type) return;
    const hasWork = brief.pages.some((p) => p.goal.trim() || p.content.trim() || p.sections.some((s) => s.content.trim() || Object.keys(s.fields).length));
    if (hasWork && !window.confirm(`Passer à « ${SUPPORTS[t].label} » remplace la structure actuelle (pages, sections, contenus) et le contexte propre au support. Continuer ?`)) return;
    setType(t);
    await updateProjectMeta(projectId, { siteType: t });
    const fresh = briefFromSupport(t);
    update({ ...brief, pages: fresh.pages, features: fresh.features, context: {} });
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
  const missingTemplatePages = support.multiPage ? support.pages.filter((tp) => !brief.pages.some((p) => p.name.trim().toLowerCase() === tp.name.toLowerCase())) : [];

  return (
    <>
      <ProjectStepper projectId={projectId} name={name || "Projet"} current="structure" status={<SaveStatus status={status} />} />
      <div className="pj-layout">
        <div className="pj-main">
          <span className="o-tag">[01 — STRUCTURE]</span>
          <h1 className="o-h1">
            Que construis-tu, et avec quelles <em>sections</em> ?
          </h1>
          <p className="o-lead">Choisis le support, puis compose-le section par section. Chaque section aura son propre prompt à l’étape 04 ; les champs du contexte (étape 02) s’adaptent à ce que tu choisis ici.</p>

          <Block id="support" n="1" title="Support" questions={GUIDED_QUESTIONS.identity}>
            <div className="pj-two">
              <label className="o-field">
                <span>Nom du projet</span>
                <input value={name} maxLength={120} onChange={(e) => setName(e.target.value)} onBlur={() => name.trim() && updateProjectMeta(projectId, { name })} />
              </label>
              <label className="o-field">
                <span>Type de support</span>
                <select value={type} onChange={(e) => changeType(e.target.value as SupportType)}>
                  {(["web", "print"] as const).map((family) => (
                    <optgroup key={family} label={family === "web" ? "Site ou application" : "Document imprimable"}>
                      {SUPPORT_TYPES.filter((t) => SUPPORTS[t].family === family).map((t) => (
                        <option key={t} value={t}>
                          {SUPPORTS[t].label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <small>{support.description} Changer de support propose un nouveau modèle de sections.</small>
              </label>
            </div>
          </Block>

          <Block id="structure" n="2" title={support.multiPage ? `Structure (${words.plur} et sections)` : "Sections du document"} questions={GUIDED_QUESTIONS.structure}>
            {missingTemplatePages.length > 0 && (
              <div className="pj-suggest">
                <b>Suggestions pour « {support.label} » :</b>
                {missingTemplatePages.map((tp) => (
                  <button key={tp.name} className="o-btn sm" type="button" onClick={() => addPage({ name: tp.name, goal: tp.goal, priority: tp.priority, sections: tp.sections.map((k) => makeSection(k)) })}>
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
                  support={support}
                  page={p}
                  onChange={(x) => setPage(p.id, x)}
                  onMove={(d) => movePage(i, d)}
                  onDelete={() => patch({ pages: brief.pages.filter((x) => x.id !== p.id) })}
                />
              ))}
              {!brief.pages.length && <div className="o-empty">Aucune {words.sing} pour l’instant.</div>}
            </div>
            {support.multiPage && (
              <button className="o-btn" type="button" style={{ marginTop: 12 }} onClick={() => addPage()}>
                + Ajouter {words.un}
              </button>
            )}
            {!support.multiPage && !brief.pages.length && (
              <button className="o-btn" type="button" style={{ marginTop: 12 }} onClick={() => patch({ pages: briefFromSupport(type).pages })}>
                Recréer le modèle
              </button>
            )}
          </Block>

          <div className="pj-next">
            <Link className="o-btn primary" href={`/outils/projets/${projectId}/contexte`}>
              Étape suivante : le contexte →
            </Link>
          </div>
        </div>

        <aside className="pj-assist" aria-label="Assistant">
          <h2 className="o-h2" style={{ fontSize: 28 }}>
            Assistant
          </h2>
          <p className="pj-note" style={{ margin: 0 }}>
            {support.label} · {brief.pages.length} {brief.pages.length > 1 ? words.plur : words.sing} · {sectionCount} section{sectionCount > 1 ? "s" : ""}
          </p>
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
            <p className="o-msg sent">Structure prête : tu peux passer au contexte.</p>
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

interface PageCardProps {
  index: number;
  total: number;
  support: Support;
  page: ProjectPage;
  onChange: (p: Partial<ProjectPage>) => void;
  onMove: (d: -1 | 1) => void;
  onDelete: () => void;
}

function PageCard({ index, total, support, page, onChange, onMove, onDelete }: PageCardProps) {
  const [custom, setCustom] = useState("");
  const words = unitWords(support);
  const catalog = sectionsFor(support.family);

  const setSections = (sections: SectionInstance[]) => onChange({ sections });
  const setSection = (id: string, p: Partial<SectionInstance>) => setSections(page.sections.map((s) => (s.id === id ? { ...s, ...p } : s)));
  const moveSection = (i: number, d: -1 | 1) => {
    const a = [...page.sections];
    const j = i + d;
    if (j < 0 || j >= a.length) return;
    [a[i], a[j]] = [a[j]!, a[i]!];
    setSections(a);
  };
  const addCustom = () => {
    if (!custom.trim()) return;
    setSections([...page.sections, makeSection("custom", custom.trim().slice(0, 120))]);
    setCustom("");
  };

  return (
    <article className="pj-page">
      {support.multiPage && (
        <div className="pj-page-head">
          <span className="pj-idx">{String(index + 1).padStart(2, "0")}</span>
          <input aria-label={`Nom de ${words.le}`} value={page.name} maxLength={120} placeholder={`Nom de ${words.le}`} onChange={(e) => onChange({ name: e.target.value })} />
          <select aria-label="Priorité" value={page.priority} onChange={(e) => onChange({ priority: e.target.value as ProjectPage["priority"] })}>
            <option value="mvp">MVP</option>
            <option value="later">Plus tard</option>
          </select>
          <button className="o-btn sm" type="button" aria-label="Monter" disabled={index === 0} onClick={() => onMove(-1)}>↑</button>
          <button className="o-btn sm" type="button" aria-label="Descendre" disabled={index === total - 1} onClick={() => onMove(1)}>↓</button>
          <button className="o-btn sm danger" type="button" aria-label={`Supprimer ${words.le}`} onClick={onDelete}>✕</button>
        </div>
      )}
      <label className="o-field" style={{ marginTop: support.multiPage ? 10 : 0 }}>
        <span>{support.multiPage ? `Objectif de ${words.le}` : "Objectif du document"}</span>
        <input value={page.goal} maxLength={400} onChange={(e) => onChange({ goal: e.target.value })} placeholder="Que doit-il accomplir pour le lecteur ?" />
      </label>
      <div className="pj-sections">
        <span className="pj-label">Sections (dans l’ordre)</span>
        <ol className="st-secs">
          {page.sections.map((s, i) => {
            const def = getSectionDef(s.key);
            const current = def.variants.find((v) => v.k === (s.variant || defaultVariant(def)));
            return (
              <li key={s.id} className="st-sec">
                <span className="pj-idx">{String(i + 1).padStart(2, "0")}</span>
                <span className="st-name">{s.label}</span>
                <span className="st-ctrls">
                  <button type="button" aria-label="Monter la section" disabled={i === 0} onClick={() => moveSection(i, -1)}>↑</button>
                  <button type="button" aria-label="Descendre la section" disabled={i === page.sections.length - 1} onClick={() => moveSection(i, 1)}>↓</button>
                  <button type="button" aria-label="Retirer la section" onClick={() => setSections(page.sections.filter((x) => x.id !== s.id))}>✕</button>
                </span>
                {def.variants.length > 0 && (
                  <div className="st-var">
                    <select aria-label={`Mise en page de ${s.label}`} value={s.variant || defaultVariant(def)} onChange={(e) => setSection(s.id, { variant: e.target.value })}>
                      {def.variants.map((v) => (
                        <option key={v.k} value={v.k}>
                          {v.label}
                        </option>
                      ))}
                    </select>
                    {current && <small>{current.desc}</small>}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
        {!page.sections.length && <p className="pj-note">Aucune section : ajoutes-en depuis la bibliothèque.</p>}
        <div className="o-row">
          <select
            aria-label="Ajouter une section de la bibliothèque"
            value=""
            onChange={(e) => e.target.value && setSections([...page.sections, makeSection(e.target.value)])}
          >
            <option value="">+ Section de la bibliothèque…</option>
            {catalog.map((d) => (
              <option key={d.key} value={d.key}>
                {d.label}
              </option>
            ))}
          </select>
          <input className="o-input" style={{ maxWidth: 220 }} value={custom} maxLength={120} placeholder="Section libre…" onChange={(e) => setCustom(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCustom()} />
          <button className="o-btn sm" type="button" disabled={!custom.trim()} onClick={addCustom}>
            Ajouter
          </button>
        </div>
      </div>
    </article>
  );
}
