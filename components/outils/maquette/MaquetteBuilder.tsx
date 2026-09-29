"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { saveProjectPart, savePrompt } from "@/app/outils/(prive)/actions";
import { TEMPLATES } from "@/data/outils/project-templates";
import { useAutosave } from "@/hooks/useAutosave";
import { BREAKPOINTS, SCOPE_LABELS, buildMaquettePrompts, maquetteWarnings, reconcile, resolvePages } from "@/lib/outils/maquette";
import type { Brief, MaquettesConfig, PromptHistoryRow, SiteType } from "@/lib/validations/design-project";
import { ProjectStepper } from "../ProjectStepper";
import { SaveStatus } from "../SaveStatus";

interface Props {
  projectId: string;
  name: string;
  siteType: SiteType;
  brief: Brief;
  lexiquePrompt: string;
  initialConfig: MaquettesConfig;
  history: PromptHistoryRow[];
}

const FIDELITIES = [
  { v: "wireframe", l: "Wireframe", d: "Structure en niveaux de gris" },
  { v: "hifi", l: "Haute fidélité", d: "Couleurs, typographies, images" },
] as const;

export function MaquetteBuilder({ projectId, name, siteType, brief, lexiquePrompt, initialConfig, history: initialHistory }: Props) {
  const rec = useMemo(() => reconcile(initialConfig, brief), [initialConfig, brief]);
  const [config, setConfig] = useState<MaquettesConfig>(rec.config);
  const [history, setHistory] = useState<PromptHistoryRow[]>(initialHistory);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [removed] = useState(rec.removed);

  const save = useCallback((c: MaquettesConfig) => saveProjectPart(projectId, "maquettes", c), [projectId]);
  const { schedule, status } = useAutosave(save);

  // La sélection réconciliée est enregistrée dès l'ouverture si des pages ont disparu
  useEffect(() => {
    if (rec.removed > 0) schedule(rec.config);
  }, [rec, schedule]);

  const tpl = TEMPLATES[siteType];
  const unit = tpl.unit;
  const pages = resolvePages(brief, config);
  const prompts = useMemo(() => buildMaquettePrompts({ name, siteType, brief, lexiquePrompt, config }), [name, siteType, brief, lexiquePrompt, config]);
  const warnings = maquetteWarnings(brief, lexiquePrompt.trim().length > 0, config, projectId, removed);

  function update(p: Partial<MaquettesConfig>) {
    const next = { ...config, ...p };
    setConfig(next);
    schedule(next);
  }
  const toggleIn = <T extends string>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  async function copy(id: string, title: string, body: string) {
    try {
      await navigator.clipboard.writeText(body);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = body;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 1800);
    if (id !== "all" && !config.done.includes(id)) update({ done: [...config.done, id] });
    const r = await savePrompt({ projectId, kind: "maquette", label: title, prompt: body });
    if (r.ok) setHistory((h) => [{ id: `local-${Date.now()}`, project_id: projectId, kind: "maquette", label: title, prompt: body, created_at: new Date().toISOString() }, ...h]);
  }

  const scopes = (["one", "mvp", "all", "custom", "kit"] as const).map((s) => ({
    s,
    count: s === "kit" ? 0 : s === "one" ? Math.min(1, brief.pages.length) : s === "mvp" ? brief.pages.filter((p) => p.priority === "mvp").length : s === "all" ? brief.pages.length : config.pageIds.length,
  }));

  return (
    <>
      <ProjectStepper projectId={projectId} name={name} current="maquettes" status={<SaveStatus status={status} />} />
      <span className="o-tag">[03 — MAQUETTE]</span>
      <h1 className="o-h1">
        Génère tes <em>maquettes</em>
      </h1>
      <p className="o-lead">Choisis ce que tu veux générer. La liste vient de ton projet : ajoute ou retire une {unit} dans l’étape Projet et elle apparaît ici.</p>

      {warnings.length > 0 && (
        <div className="mq-warns">
          {warnings.map((w) => (
            <p key={w.id} className="o-msg error" style={{ margin: 0 }}>
              {w.text}{" "}
              {w.href && (
                <Link href={w.href} style={{ textDecoration: "underline" }}>
                  {w.cta} →
                </Link>
              )}
            </p>
          ))}
        </div>
      )}

      <div className="mq-layout">
        <div className="mq-config">
          <section className="mq-block">
            <h2>1. Portée</h2>
            <div className="mq-scopes" role="radiogroup" aria-label="Portée de la génération">
              {scopes.map(({ s, count }) => (
                <label key={s} className={`mq-scope ${config.scope === s ? "on" : ""}`}>
                  <input type="radio" name="scope" checked={config.scope === s} onChange={() => update({ scope: s })} />
                  <b>{SCOPE_LABELS[s]}</b>
                  <small>{s === "kit" ? "Système visuel seulement" : `${count} ${unit}${count > 1 ? "s" : ""}`}</small>
                </label>
              ))}
            </div>

            {config.scope === "one" && (
              <label className="o-field" style={{ marginTop: 14 }}>
                <span>{unit === "page" ? "Page" : "Écran"} à générer</span>
                <select value={config.onePageId} onChange={(e) => update({ onePageId: e.target.value })}>
                  {brief.pages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name || "Sans titre"}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {config.scope === "custom" && (
              <div className="mq-checks">
                {brief.pages.map((p) => (
                  <label key={p.id} className="pj-check">
                    <input type="checkbox" checked={config.pageIds.includes(p.id)} onChange={() => update({ pageIds: toggleIn(config.pageIds, p.id) })} />
                    {p.name || "Sans titre"} {p.priority === "mvp" && <em className="mq-mvp">MVP</em>}
                  </label>
                ))}
              </div>
            )}
            {config.scope !== "kit" && (
              <label className="pj-check" style={{ marginTop: 14, display: "inline-flex" }}>
                <input type="checkbox" checked={config.includeKit} onChange={(e) => update({ includeKit: e.target.checked })} />
                Générer aussi le kit UI (design system) en premier
              </label>
            )}
          </section>

          {pages.length > 0 && (
            <section className="mq-block">
              <h2>2. Sections par {unit}</h2>
              <p className="pj-note">Décoche une section pour l’exclure de cette génération (sans la supprimer du projet).</p>
              {pages.map((p) => (
                <details key={p.id} className="pj-content">
                  <summary>
                    {p.name || "Sans titre"} <em>{p.sections.length - (config.disabledSections[p.id]?.length ?? 0)}/{p.sections.length} sections</em>
                  </summary>
                  <div className="mq-checks" style={{ marginTop: 10 }}>
                    {p.sections.map((s) => {
                      const off = config.disabledSections[p.id] ?? [];
                      return (
                        <label key={s} className="pj-check">
                          <input type="checkbox" checked={!off.includes(s)} onChange={() => update({ disabledSections: { ...config.disabledSections, [p.id]: toggleIn(off, s) } })} />
                          {s}
                        </label>
                      );
                    })}
                    {!p.sections.length && <span className="pj-note">Aucune section définie dans le projet.</span>}
                  </div>
                </details>
              ))}
            </section>
          )}

          <section className="mq-block">
            <h2>{pages.length > 0 ? "3" : "2"}. Livrable</h2>
            <span className="pj-label">Fidélité</span>
            <div className="mq-scopes two" role="radiogroup" aria-label="Fidélité">
              {FIDELITIES.map((f) => (
                <label key={f.v} className={`mq-scope ${config.fidelity === f.v ? "on" : ""}`}>
                  <input type="radio" name="fid" checked={config.fidelity === f.v} onChange={() => update({ fidelity: f.v })} />
                  <b>{f.l}</b>
                  <small>{f.d}</small>
                </label>
              ))}
            </div>
            <span className="pj-label" style={{ marginTop: 16 }}>Formats</span>
            <div className="pj-checks">
              {(Object.keys(BREAKPOINTS) as (keyof typeof BREAKPOINTS)[]).map((b) => (
                <label key={b} className="pj-check">
                  <input type="checkbox" checked={config.breakpoints.includes(b)} onChange={() => update({ breakpoints: toggleIn(config.breakpoints, b) })} />
                  {BREAKPOINTS[b]}
                </label>
              ))}
            </div>
            <div className="pj-two" style={{ marginTop: 16 }}>
              <label className="o-field">
                <span>Variantes</span>
                <select value={config.variants} onChange={(e) => update({ variants: Number(e.target.value) })}>
                  <option value={1}>1 proposition</option>
                  <option value={2}>2 directions</option>
                  <option value={3}>3 directions</option>
                </select>
              </label>
              <label className="o-field">
                <span>Contenu</span>
                <select value={config.content} onChange={(e) => update({ content: e.target.value as MaquettesConfig["content"] })}>
                  <option value="realistic">Réaliste (généré)</option>
                  <option value="real">Réel (celui du projet)</option>
                </select>
              </label>
            </div>
            {tpl.states.length > 0 && (
              <>
                <span className="pj-label">États à prévoir</span>
                <div className="pj-checks">
                  {tpl.states.map((s) => (
                    <label key={s} className="pj-check">
                      <input type="checkbox" checked={config.states.includes(s)} onChange={() => update({ states: toggleIn(config.states, s) })} />
                      {s}
                    </label>
                  ))}
                </div>
              </>
            )}
          </section>

          <section className="mq-block">
            <h2>{pages.length > 0 ? "4" : "3"}. Sortie</h2>
            <div className="mq-scopes two" role="radiogroup" aria-label="Type de sortie">
              <label className={`mq-scope ${config.output === "sequence" ? "on" : ""}`}>
                <input type="radio" name="out" checked={config.output === "sequence"} onChange={() => update({ output: "sequence" })} />
                <b>Séquence de prompts</b>
                <small>Un prompt par {unit} : le premier fixe le système visuel, les suivants le reprennent</small>
              </label>
              <label className={`mq-scope ${config.output === "global" ? "on" : ""}`}>
                <input type="radio" name="out" checked={config.output === "global"} onChange={() => update({ output: "global" })} />
                <b>Un seul prompt</b>
                <small>Tout d’un coup, dans une seule demande</small>
              </label>
            </div>
          </section>
        </div>

        <aside className="mq-out" aria-label="Prompts générés">
          <h2 className="o-h2" style={{ fontSize: 28 }}>
            Prompts à copier
          </h2>
          {prompts.length === 0 && <div className="o-empty">Aucun prompt : choisis une portée qui contient au moins une {unit}.</div>}
          {config.output === "sequence" && prompts.length > 1 && <p className="pj-note">À coller dans l’ordre, dans la même conversation Claude Design.</p>}
          {prompts.map((p, i) => {
            const done = config.done.includes(p.id);
            return (
              <article key={p.id} className={`mq-prompt ${done ? "done" : ""}`}>
                <header>
                  <span className="pj-idx">{String(i + 1).padStart(2, "0")}</span>
                  <b>{p.title}</b>
                  <em>{p.body.length.toLocaleString("fr-FR")} car.</em>
                </header>
                <textarea readOnly value={p.body} aria-label={`Prompt ${p.title}`} />
                <div className="o-row">
                  <button className="o-btn primary sm" type="button" onClick={() => copy(p.id, p.title, p.body)}>
                    {copiedId === p.id ? "✓ Copié" : "Copier"}
                  </button>
                  {p.id !== "all" && (
                    <button className="o-btn sm" type="button" aria-pressed={done} onClick={() => update({ done: toggleIn(config.done, p.id) })}>
                      {done ? "✓ Fait" : "Marquer comme fait"}
                    </button>
                  )}
                </div>
              </article>
            );
          })}

          <details className="mq-history">
            <summary>Historique ({history.length})</summary>
            {history.length === 0 && <p className="pj-note">Chaque copie est enregistrée ici.</p>}
            {history.map((h) => (
              <div key={h.id} className="mq-hist-row">
                <div>
                  <b>{h.label || (h.kind === "lexique" ? "Direction artistique" : "Maquette")}</b>
                  <small>
                    {h.kind === "lexique" ? "Lexique" : "Maquette"} · {new Date(h.created_at).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
                  </small>
                </div>
                <button className="o-btn sm" type="button" onClick={() => navigator.clipboard?.writeText(h.prompt)}>
                  Recopier
                </button>
              </div>
            ))}
          </details>
        </aside>
      </div>
    </>
  );
}
