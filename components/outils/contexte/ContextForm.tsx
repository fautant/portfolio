"use client";

import Link from "next/link";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { saveProjectPart } from "@/app/outils/(prive)/actions";
import type { FieldValue } from "@/data/outils/form-fields";
import { getSectionDef } from "@/data/outils/sections";
import { ALL_FEATURES, GUIDED_QUESTIONS, SUPPORTS, newId, unitWords } from "@/data/outils/supports";
import { useAutosave } from "@/hooks/useAutosave";
import { completenessItems, completenessPct } from "@/lib/outils/project";
import type { Brief, SectionInstance, SupportType } from "@/lib/validations/design-project";
import { FieldGroup } from "../form/FieldRenderer";
import { ProjectStepper } from "../ProjectStepper";
import { SaveStatus } from "../SaveStatus";

interface Props {
  projectId: string;
  name: string;
  siteType: SupportType;
  initialBrief: Brief;
}

export function ContextForm({ projectId, name, siteType, initialBrief }: Props) {
  const [brief, setBrief] = useState<Brief>(initialBrief);

  const save = useCallback((b: Brief) => saveProjectPart(projectId, "brief", b), [projectId]);
  const { schedule, status } = useAutosave(save);

  const support = SUPPORTS[siteType];
  const web = support.family === "web";
  const words = unitWords(support);
  const items = useMemo(() => completenessItems(brief, siteType), [brief, siteType]);
  const pct = completenessPct(brief, siteType);
  const missing = items.filter((i) => !i.done);

  function update(next: Brief) {
    setBrief(next);
    schedule(next);
  }
  const patch = (p: Partial<Brief>) => update({ ...brief, ...p });
  const setContext = (id: string, v: FieldValue) => patch({ context: { ...brief.context, [id]: v } });
  const setSection = (pageId: string, sectionId: string, p: Partial<SectionInstance>) =>
    patch({ pages: brief.pages.map((pg) => (pg.id === pageId ? { ...pg, sections: pg.sections.map((s) => (s.id === sectionId ? { ...s, ...p } : s)) } : pg)) });

  const c = brief.constraints;
  const setConstraints = (p: Partial<Brief["constraints"]>) => patch({ constraints: { ...c, ...p } });
  const setIdentity = (p: Partial<Brief["identity"]>) => patch({ identity: { ...brief.identity, ...p } });

  return (
    <>
      <ProjectStepper projectId={projectId} name={name || "Projet"} current="contexte" status={<SaveStatus status={status} />} />
      <div className="pj-layout">
        <div className="pj-main">
          <span className="o-tag">[02 — CONTEXTE]</span>
          <h1 className="o-h1">
            Le contexte de <em>{support.label.toLowerCase()}</em>
          </h1>
          <p className="o-lead">Plus le contexte est précis, meilleurs seront les prompts. Le formulaire s’adapte au support choisi et aux sections retenues.</p>

          <Block id="identite" n="1" title="Identité" questions={GUIDED_QUESTIONS.identity}>
            <label className="o-field">
              <span>Pitch en une phrase</span>
              <textarea value={brief.pitch} maxLength={400} onChange={(e) => patch({ pitch: e.target.value })} placeholder="Ex. : Un CV d’une page pour décrocher un stage en développement web." />
            </label>
            <label className="o-field">
              <span>Secteur / univers</span>
              <input value={brief.sector} maxLength={200} onChange={(e) => patch({ sector: e.target.value })} placeholder="Ex. : développement web, photographie, restauration…" />
            </label>
          </Block>

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
                <input value={brief.mainAction} maxLength={300} onChange={(e) => patch({ mainAction: e.target.value })} placeholder={web ? "Ex. : m’envoyer un email" : "Ex. : m’inviter en entretien"} />
              </label>
              <label className="o-field">
                <span>Émotion à garder en partant</span>
                <input value={brief.emotion} maxLength={300} onChange={(e) => patch({ emotion: e.target.value })} placeholder="Ex. : confiance, curiosité" />
              </label>
            </div>
            <label className="o-field">
              <span>Comment saurez-vous que c’est réussi ?</span>
              <textarea value={brief.kpis} maxLength={600} onChange={(e) => patch({ kpis: e.target.value })} placeholder="Ex. : 5 demandes de contact par mois, un entretien décroché…" />
            </label>
          </Block>

          <Block id="specifique" n="3" title={`Spécifique : ${support.label}`} questions={["Que doit savoir Claude Design pour ce type de support précisément ?"]}>
            <FieldGroup defs={support.contextFields} values={brief.context} onChange={setContext} />
          </Block>

          <Block id="sections" n="4" title="Contenu de chaque section" questions={GUIDED_QUESTIONS.features}>
            <p className="pj-note">Chaque section a ses propres champs. Avec de vrais textes, le résultat évite le lorem ipsum et reste crédible.</p>
            {brief.pages.map((p, pi) => (
              <details key={p.id} className="pj-content" open={pi === 0}>
                <summary>
                  {support.multiPage ? p.name || "Sans titre" : "Sections"} <em>{p.sections.length} section{p.sections.length > 1 ? "s" : ""}</em>
                </summary>
                {p.content.trim() && (
                  <label className="o-field">
                    <span>Contenu de {words.le} (ancien format, réparti dans les sections au moment de la génération)</span>
                    <textarea value={p.content} maxLength={8000} onChange={(e) => patch({ pages: brief.pages.map((x) => (x.id === p.id ? { ...x, content: e.target.value } : x)) })} style={{ minHeight: 100 }} />
                  </label>
                )}
                {p.sections.map((s) => {
                  const def = getSectionDef(s.key);
                  const filled = s.content.trim() || Object.keys(s.fields).length;
                  return (
                    <details key={s.id} className="pj-content">
                      <summary>
                        {s.label} <em>{filled ? "renseignée" : "à renseigner"}</em>
                      </summary>
                      <FieldGroup defs={def.fields} values={s.fields} onChange={(id, v) => setSection(p.id, s.id, { fields: { ...s.fields, [id]: v } })} />
                      <label className="o-field">
                        <span>Contenu réel (textes, titres, chiffres)</span>
                        <textarea value={s.content} maxLength={8000} onChange={(e) => setSection(p.id, s.id, { content: e.target.value })} placeholder="Colle ici les vrais contenus de cette section." style={{ minHeight: 90 }} />
                      </label>
                    </details>
                  );
                })}
                {!p.sections.length && <p className="pj-note">Aucune section : retourne à l’étape Structure.</p>}
              </details>
            ))}
          </Block>

          {web && (
            <Block id="fonctionnalites" n="5" title="Fonctionnalités" questions={GUIDED_QUESTIONS.features}>
              <div className="pj-checks" role="group" aria-label="Fonctionnalités">
                {Array.from(new Set<string>([...ALL_FEATURES, ...brief.features])).map((f) => (
                  <label key={f} className={`pj-check ${support.features.includes(f) ? "sug" : ""}`}>
                    <input type="checkbox" checked={brief.features.includes(f)} onChange={(e) => patch({ features: e.target.checked ? [...brief.features, f] : brief.features.filter((x) => x !== f) })} />
                    {f}
                  </label>
                ))}
              </div>
              <p className="pj-note">Les fonctionnalités soulignées sont suggérées pour « {support.label} ».</p>
              <CustomFeature onAdd={(f) => !brief.features.includes(f) && patch({ features: [...brief.features, f] })} />
            </Block>
          )}

          <Block id="contraintes" n={web ? "6" : "5"} title="Contraintes" questions={GUIDED_QUESTIONS.constraints}>
            <div className="pj-two">
              {web && (
                <label className="o-field">
                  <span>Priorité d’appareil</span>
                  <select value={c.priority} onChange={(e) => setConstraints({ priority: e.target.value as Brief["constraints"]["priority"] })}>
                    <option value="both">Mobile et desktop à égalité</option>
                    <option value="mobile">Mobile d’abord</option>
                    <option value="desktop">Desktop d’abord</option>
                  </select>
                </label>
              )}
              <label className="o-field">
                <span>{web ? "Accessibilité" : "Lisibilité / contraste"}</span>
                <select value={c.a11y} onChange={(e) => setConstraints({ a11y: e.target.value as Brief["constraints"]["a11y"] })}>
                  <option value="basic">De base</option>
                  <option value="aa">WCAG AA</option>
                  <option value="aaa">WCAG AAA</option>
                </select>
              </label>
              <label className="o-field">
                <span>Langues</span>
                <input value={c.languages} maxLength={120} onChange={(e) => setConstraints({ languages: e.target.value })} placeholder="Ex. : français, anglais" />
              </label>
              {web && (
                <label className="o-field">
                  <span>Techno cible</span>
                  <input value={c.tech} maxLength={200} onChange={(e) => setConstraints({ tech: e.target.value })} placeholder="Ex. : Next.js + Tailwind" />
                </label>
              )}
              <label className="o-field">
                <span>Échéance</span>
                <input value={c.deadline} maxLength={120} onChange={(e) => setConstraints({ deadline: e.target.value })} placeholder="Ex. : fin novembre" />
              </label>
            </div>
          </Block>

          <Block id="identite-visuelle" n={web ? "7" : "6"} title="Identité visuelle existante" questions={GUIDED_QUESTIONS.identity2}>
            <div className="pj-two">
              <label className="o-field">
                <span>Logo</span>
                <select value={brief.identity.logo} onChange={(e) => setIdentity({ logo: e.target.value as "yes" | "no" })}>
                  <option value="no">Pas de logo</option>
                  <option value="yes">Un logo existe</option>
                </select>
              </label>
              <label className="o-field">
                <span>Couleurs imposées</span>
                <input value={brief.identity.colors} maxLength={300} onChange={(e) => setIdentity({ colors: e.target.value })} placeholder="Ex. : #FF5C93, #FF9357" />
              </label>
              <label className="o-field">
                <span>Polices imposées</span>
                <input value={brief.identity.fonts} maxLength={300} onChange={(e) => setIdentity({ fonts: e.target.value })} placeholder="Ex. : Poppins" />
              </label>
            </div>
            <h3 className="pj-h3">Références</h3>
            <div className="pj-list">
              {brief.identity.refs.map((r) => (
                <div className="pj-item" key={r.id}>
                  <input aria-label="Lien" value={r.url} maxLength={400} placeholder="Lien ou nom de la référence" onChange={(e) => setIdentity({ refs: brief.identity.refs.map((x) => (x.id === r.id ? { ...x, url: e.target.value } : x)) })} />
                  <input aria-label="Ce que j'en retiens" value={r.keep} maxLength={300} placeholder="Ce que j’en retiens (la typo ? le rythme ?)" onChange={(e) => setIdentity({ refs: brief.identity.refs.map((x) => (x.id === r.id ? { ...x, keep: e.target.value } : x)) })} />
                  <button className="o-btn sm danger" type="button" aria-label="Supprimer cette référence" onClick={() => setIdentity({ refs: brief.identity.refs.filter((x) => x.id !== r.id) })}>
                    ✕
                  </button>
                </div>
              ))}
              <button className="o-btn sm" type="button" onClick={() => setIdentity({ refs: [...brief.identity.refs, { id: newId(), url: "", keep: "" }] })}>
                + Ajouter une référence
              </button>
            </div>
          </Block>

          <div className="pj-next o-row">
            <Link className="o-btn" href={`/outils/projets/${projectId}`}>
              ← Structure
            </Link>
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
            <span>Contexte complet à {pct} %</span>
            <i>
              <b style={{ width: `${pct}%` }} />
            </i>
          </div>
          {missing.length ? (
            <>
              <p className="pj-note">Il manque encore :</p>
              <ul className="pj-missing">
                {missing.map((m) => (
                  <li key={m.id}>{m.step === "structure" ? <Link href={`/outils/projets/${projectId}#${m.block}`}>{m.label} (structure)</Link> : <a href={`#${m.block}`}>{m.label}</a>}</li>
                ))}
              </ul>
            </>
          ) : (
            <p className="o-msg sent">Contexte complet : tu peux passer au Lexique.</p>
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
  const add = () => {
    if (!v.trim()) return;
    onAdd(v.trim());
    setV("");
  };
  return (
    <div className="o-row" style={{ marginTop: 8 }}>
      <input className="o-input" style={{ maxWidth: 280 }} value={v} maxLength={80} placeholder="Autre fonctionnalité…" onChange={(e) => setV(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} />
      <button className="o-btn sm" type="button" disabled={!v.trim()} onClick={add}>
        Ajouter
      </button>
    </div>
  );
}
