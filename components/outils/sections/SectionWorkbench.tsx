"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { saveProjectPart, savePrompt } from "@/app/outils/(prive)/actions";
import { SUPPORTS } from "@/data/outils/supports";
import { useAutosave } from "@/hooks/useAutosave";
import { RETOUCH_CHIPS, activeFormats, buildKitPrompt, buildRetouchPrompt, buildSectionPrompt, flattenSections, sectionWarnings, type GeneratedPrompt, type PromptCtx } from "@/lib/outils/prompts";
import type { Brief, BuildConfig, PromptHistoryRow, PromptKind, SectionStatus, SupportType } from "@/lib/validations/design-project";
import { ProjectStepper } from "../ProjectStepper";
import { SaveStatus } from "../SaveStatus";

interface Props {
  projectId: string;
  name: string;
  siteType: SupportType;
  initialBrief: Brief;
  lexiquePrompt: string;
  initialConfig: BuildConfig;
  history: PromptHistoryRow[];
}

const STATUS_LABEL: Record<SectionStatus, string> = { todo: "à faire", copied: "copié", ok: "validé", retouch: "à retoucher" };
const KIND_LABEL: Record<PromptKind, string> = { lexique: "Lexique", maquette: "Maquette", kit: "Kit", section: "Section", retouche: "Retouche", final: "Final" };
const FIDELITIES = [
  { v: "wireframe", l: "Wireframe", d: "Structure en niveaux de gris" },
  { v: "hifi", l: "Haute fidélité", d: "Couleurs, typographies, images" },
] as const;

async function writeClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
}

export function SectionWorkbench({ projectId, name, siteType, initialBrief, lexiquePrompt, initialConfig, history: initialHistory }: Props) {
  const support = SUPPORTS[siteType];
  const [brief, setBrief] = useState<Brief>(initialBrief);
  const [config, setConfig] = useState<BuildConfig>(initialConfig);
  const [history, setHistory] = useState<PromptHistoryRow[]>(initialHistory);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [chips, setChips] = useState<string[]>([]);
  const [note, setNote] = useState("");

  const saveBrief = useCallback((b: Brief) => saveProjectPart(projectId, "brief", b), [projectId]);
  const saveConfig = useCallback((c: BuildConfig) => saveProjectPart(projectId, "maquettes", c), [projectId]);
  const briefSave = useAutosave(saveBrief);
  const configSave = useAutosave(saveConfig);
  const status = briefSave.status === "error" || configSave.status === "error" ? "error" : briefSave.status === "saving" || configSave.status === "saving" ? "saving" : briefSave.status === "saved" || configSave.status === "saved" ? "saved" : "idle";

  const ctx: PromptCtx = useMemo(() => ({ name, type: siteType, brief, lexiquePrompt, config }), [name, siteType, brief, lexiquePrompt, config]);
  const flat = useMemo(() => flattenSections(brief), [brief]);
  const warnings = useMemo(() => sectionWarnings(ctx, projectId), [ctx, projectId]);

  // Ordre de travail : le kit (s'il est demandé) puis chaque section
  const order = useMemo(() => [...(config.includeKit ? ["kit"] : []), ...flat.map((f) => f.section.id)], [config.includeKit, flat]);
  const [activeRaw, setActive] = useState<string | null>(null);
  const active = activeRaw && order.includes(activeRaw) ? activeRaw : (order[0] ?? null);

  const statusOf = (id: string): SectionStatus => (id === "kit" ? config.kitStatus : (flat.find((f) => f.section.id === id)?.section.status ?? "todo"));
  const doneCount = order.filter((id) => statusOf(id) === "ok").length;

  function updateConfig(p: Partial<BuildConfig>) {
    const next = { ...config, ...p };
    setConfig(next);
    configSave.schedule(next);
  }
  function setStatus(id: string, s: SectionStatus) {
    if (id === "kit") {
      updateConfig({ kitStatus: s === "ok" ? "ok" : s === "copied" ? "copied" : "todo" });
      return;
    }
    const next: Brief = { ...brief, pages: brief.pages.map((p) => ({ ...p, sections: p.sections.map((x) => (x.id === id ? { ...x, status: s } : x)) })) };
    setBrief(next);
    briefSave.schedule(next);
  }
  const toggleIn = <T extends string>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  async function copy(id: string, p: GeneratedPrompt, kind: PromptKind) {
    await writeClipboard(p.body);
    setCopiedId(p.id);
    setTimeout(() => setCopiedId((c) => (c === p.id ? null : c)), 1800);
    if (kind !== "retouche" && statusOf(id) === "todo") setStatus(id, "copied");
    const r = await savePrompt({ projectId, kind, label: p.title, prompt: p.body });
    if (r.ok) setHistory((h) => [{ id: `local-${Date.now()}`, project_id: projectId, kind, label: p.title, prompt: p.body, created_at: new Date().toISOString() }, ...h]);
  }

  const prompt: GeneratedPrompt | null = active === "kit" ? buildKitPrompt(ctx) : active ? buildSectionPrompt(ctx, active) : null;
  const activeStatus = active ? statusOf(active) : "todo";
  const retouch = active && active !== "kit" && activeStatus === "retouch" ? buildRetouchPrompt(ctx, active, chips, note) : null;
  const activeIndex = active ? order.indexOf(active) : -1;
  const nextId = activeIndex >= 0 ? order[activeIndex + 1] : undefined;
  const activeItem = flat.find((f) => f.section.id === active);

  const anchorField = (
    <label className="o-field">
      <span>Système visuel établi (à coller après le kit)</span>
      <textarea
        value={config.anchor}
        maxLength={6000}
        onChange={(e) => updateConfig({ anchor: e.target.value })}
        placeholder="Décris ici ce que Claude Design a produit : palette (hex), polices, rayons, style des boutons… Il sera rappelé dans chaque prompt de section."
        style={{ minHeight: 110 }}
      />
      <small>Facultatif mais utile si tu ouvres une nouvelle conversation : chaque prompt reprendra ce système au lieu de la direction artistique.</small>
    </label>
  );

  let lastPage = "";
  return (
    <>
      <ProjectStepper projectId={projectId} name={name} current="sections" status={<SaveStatus status={status} />} />
      <span className="o-tag">[04 — SECTIONS]</span>
      <h1 className="o-h1">
        Génère chaque <em>section</em>
      </h1>
      <p className="o-lead">
        Colle les prompts dans l’ordre, dans la même conversation Claude Design. Valide chaque section avant de passer à la suivante, puis assemble le tout à l’étape finale. {doneCount}/{order.length} validé{doneCount > 1 ? "s" : ""}.
      </p>

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

      <details className="sw-settings">
        <summary>
          Réglages de génération · {config.fidelity === "hifi" ? "haute fidélité" : "wireframe"} · {activeFormats(support, config).join(", ")}
        </summary>
        <div>
          <span className="pj-label">Fidélité</span>
          <div className="mq-scopes two" role="radiogroup" aria-label="Fidélité">
            {FIDELITIES.map((f) => (
              <label key={f.v} className={`mq-scope ${config.fidelity === f.v ? "on" : ""}`}>
                <input type="radio" name="fid" checked={config.fidelity === f.v} onChange={() => updateConfig({ fidelity: f.v })} />
                <b>{f.l}</b>
                <small>{f.d}</small>
              </label>
            ))}
          </div>
          {support.formats.length > 1 && (
            <>
              <span className="pj-label" style={{ marginTop: 16 }}>Formats</span>
              <div className="pj-checks">
                {support.formats.map((f) => {
                  const current = config.formats.length ? config.formats : support.defaultFormats;
                  return (
                    <label key={f.k} className="pj-check">
                      <input type="checkbox" checked={current.includes(f.k)} onChange={() => updateConfig({ formats: toggleIn(current, f.k) })} />
                      {f.label}
                    </label>
                  );
                })}
              </div>
            </>
          )}
          <div className="pj-two" style={{ marginTop: 16 }}>
            <label className="o-field">
              <span>Variantes</span>
              <select value={config.variants} onChange={(e) => updateConfig({ variants: Number(e.target.value) })}>
                <option value={1}>1 proposition</option>
                <option value={2}>2 directions</option>
                <option value={3}>3 directions</option>
              </select>
            </label>
            <label className="o-field">
              <span>Contenu</span>
              <select value={config.contentMode} onChange={(e) => updateConfig({ contentMode: e.target.value as BuildConfig["contentMode"] })}>
                <option value="realistic">Réaliste (généré)</option>
                <option value="real">Réel (celui du projet)</option>
              </select>
            </label>
          </div>
          <label className="pj-check" style={{ display: "inline-flex" }}>
            <input type="checkbox" checked={config.includeKit} onChange={(e) => updateConfig({ includeKit: e.target.checked })} />
            Commencer par un kit de style (recommandé)
          </label>
          {!config.includeKit && <div style={{ marginTop: 14 }}>{anchorField}</div>}
        </div>
      </details>

      {order.length === 0 ? (
        <div className="o-empty">
          Aucune section. <Link href={`/outils/projets/${projectId}`} style={{ textDecoration: "underline" }}>Choisis-en à l’étape Structure →</Link>
        </div>
      ) : (
        <div className="sw-layout">
          <nav className="sw-list" aria-label="Sections à générer">
            {config.includeKit && (
              <>
                <div className="sw-group">Étape 0</div>
                <button type="button" className="sw-item" aria-current={active === "kit"} onClick={() => setActive("kit")}>
                  <span className="pj-idx">00</span>
                  <span>{support.family === "web" ? "Kit UI" : "Kit de style"}</span>
                  <span className={`sw-st ${config.kitStatus}`}>{STATUS_LABEL[config.kitStatus]}</span>
                </button>
              </>
            )}
            {flat.map((f, n) => {
              const heading = f.page.id !== lastPage && support.multiPage ? f.page.name.trim() || "Sans titre" : null;
              lastPage = f.page.id;
              return (
                <div key={f.section.id} style={{ display: "contents" }}>
                  {heading && <div className="sw-group">{heading}</div>}
                  <button type="button" className="sw-item" aria-current={active === f.section.id} onClick={() => setActive(f.section.id)}>
                    <span className="pj-idx">{String(n + 1).padStart(2, "0")}</span>
                    <span>{f.section.label}</span>
                    <span className={`sw-st ${f.section.status}`}>{STATUS_LABEL[f.section.status]}</span>
                  </button>
                </div>
              );
            })}
            <Link className="o-btn primary sm" style={{ marginTop: 14, justifyContent: "center" }} href={`/outils/projets/${projectId}/final`}>
              Prompt final →
            </Link>
          </nav>

          <section className="sw-panel" aria-live="polite">
            {prompt && active && (
              <>
                <div>
                  <span className="o-tag">{active === "kit" ? "[ÉTAPE 0]" : `[${activeItem ? `${activeItem.index + 1}/${activeItem.total}` : ""}${support.multiPage && activeItem ? ` · ${(activeItem.page.name.trim() || "Sans titre").toUpperCase()}` : ""}]`}</span>
                  <h2>{prompt.title}</h2>
                </div>
                <div className="sw-prompt">
                  <textarea readOnly value={prompt.body} aria-label={`Prompt ${prompt.title}`} />
                  <p className="pj-note">{prompt.body.length.toLocaleString("fr-FR")} caractères</p>
                </div>
                <div className="o-row">
                  <button className="o-btn primary" type="button" onClick={() => copy(active, prompt, active === "kit" ? "kit" : "section")}>
                    {copiedId === prompt.id ? "✓ Copié" : "Copier le prompt"}
                  </button>
                  <button className="o-btn" type="button" aria-pressed={activeStatus === "ok"} onClick={() => setStatus(active, activeStatus === "ok" ? "copied" : "ok")}>
                    {activeStatus === "ok" ? "✓ Validé" : "Valider le résultat"}
                  </button>
                  {active !== "kit" && (
                    <button className="o-btn" type="button" aria-pressed={activeStatus === "retouch"} onClick={() => setStatus(active, activeStatus === "retouch" ? "copied" : "retouch")}>
                      À retoucher
                    </button>
                  )}
                  {activeStatus !== "todo" && (
                    <button className="o-btn sm" type="button" onClick={() => setStatus(active, "todo")}>
                      Remettre à faire
                    </button>
                  )}
                  {nextId && (
                    <button className="o-btn sm" type="button" style={{ marginLeft: "auto" }} onClick={() => setActive(nextId)}>
                      Suivant →
                    </button>
                  )}
                </div>

                {active === "kit" && anchorField}

                {retouch && (
                  <div className="sw-retouch">
                    <b>Retouche rapide</b>
                    <div className="pj-checks" role="group" aria-label="Corrections">
                      {RETOUCH_CHIPS.map((c) => (
                        <label key={c} className="pj-check">
                          <input type="checkbox" checked={chips.includes(c)} onChange={() => setChips(toggleIn(chips, c))} />
                          {c}
                        </label>
                      ))}
                    </div>
                    <label className="o-field" style={{ marginBottom: 0 }}>
                      <span>Précision libre</span>
                      <input value={note} maxLength={300} onChange={(e) => setNote(e.target.value)} placeholder="Ex. : passer les cartes à trois colonnes" />
                    </label>
                    <div className="sw-prompt">
                      <textarea readOnly value={retouch.body} aria-label="Prompt de retouche" style={{ height: 160 }} />
                    </div>
                    <div className="o-row">
                      <button className="o-btn primary sm" type="button" onClick={() => copy(active, retouch, "retouche")}>
                        {copiedId === retouch.id ? "✓ Copié" : "Copier la retouche"}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            <details className="mq-history">
              <summary>Historique ({history.length})</summary>
              {history.length === 0 && <p className="pj-note">Chaque copie est enregistrée ici.</p>}
              {history.map((h) => (
                <div key={h.id} className="mq-hist-row">
                  <div>
                    <b>{h.label || "Prompt"}</b>
                    <small>
                      {KIND_LABEL[h.kind]} ·{" "}
                      {new Date(h.created_at).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
                    </small>
                  </div>
                  <button className="o-btn sm" type="button" onClick={() => navigator.clipboard?.writeText(h.prompt)}>
                    Recopier
                  </button>
                </div>
              ))}
            </details>
          </section>
        </div>
      )}
    </>
  );
}
