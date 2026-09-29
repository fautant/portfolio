"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { savePrompt } from "@/app/outils/(prive)/actions";
import { SUPPORTS } from "@/data/outils/supports";
import { briefMarkdown } from "@/lib/outils/project";
import { buildAssemblyPrompt, flattenSections, type PromptCtx } from "@/lib/outils/prompts";
import type { Brief, BuildConfig, SectionStatus, SupportType } from "@/lib/validations/design-project";
import { ProjectStepper } from "../ProjectStepper";

interface Props {
  projectId: string;
  name: string;
  siteType: SupportType;
  brief: Brief;
  lexiquePrompt: string;
  config: BuildConfig;
}

const STATUS_LABEL: Record<SectionStatus, string> = { todo: "à faire", copied: "copié", ok: "validé", retouch: "à retoucher" };

async function writeClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function FinalAssembly({ projectId, name, siteType, brief, lexiquePrompt, config }: Props) {
  const support = SUPPORTS[siteType];
  const ctx: PromptCtx = useMemo(() => ({ name, type: siteType, brief, lexiquePrompt, config }), [name, siteType, brief, lexiquePrompt, config]);
  const prompt = useMemo(() => buildAssemblyPrompt(ctx), [ctx]);
  const flat = useMemo(() => flattenSections(brief), [brief]);
  const notOk = flat.filter((f) => f.section.status !== "ok");
  const [copied, setCopied] = useState(false);
  const [md, setMd] = useState<string | null>(null);
  const [mdCopied, setMdCopied] = useState(false);

  async function copy() {
    if (!(await writeClipboard(prompt.body))) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
    void savePrompt({ projectId, kind: "final", label: prompt.title, prompt: prompt.body });
  }

  return (
    <>
      <ProjectStepper projectId={projectId} name={name} current="final" />
      <span className="o-tag">[05 — PROMPT FINAL]</span>
      <h1 className="o-h1">
        Assemble le <em>résultat</em>
      </h1>
      <p className="o-lead">
        À coller dans la conversation Claude Design où tu as généré les sections : il les réunit dans l’ordre du projet, harmonise l’ensemble et prépare l’export.
      </p>

      {flat.length === 0 ? (
        <div className="o-empty">
          Aucune section dans le projet. <Link href={`/outils/projets/${projectId}`} style={{ textDecoration: "underline" }}>Retour à la structure →</Link>
        </div>
      ) : (
        <div className="mq-layout">
          <div className="mq-config">
            {notOk.length > 0 && (
              <p className="o-msg error" style={{ marginTop: 0 }}>
                {notOk.length} section{notOk.length > 1 ? "s ne sont" : " n’est"} pas validée{notOk.length > 1 ? "s" : ""}. L’assemblage fonctionne mieux quand toutes les sections ont été générées.{" "}
                <Link href={`/outils/projets/${projectId}/sections`} style={{ textDecoration: "underline" }}>
                  Retour aux sections →
                </Link>
              </p>
            )}
            <section className="mq-block">
              <h2>Ordre d’assemblage</h2>
              {brief.pages.map((p) => (
                <details key={p.id} className="pj-content" open>
                  <summary>
                    {support.multiPage ? p.name || "Sans titre" : "Document"} <em>{p.sections.length} sections</em>
                  </summary>
                  <ol className="st-secs" style={{ marginTop: 10 }}>
                    {p.sections.map((s, i) => (
                      <li key={s.id} className="st-sec" style={{ gridTemplateColumns: "auto 1fr auto" }}>
                        <span className="pj-idx">{String(i + 1).padStart(2, "0")}</span>
                        <span className="st-name">{s.label}</span>
                        <span className={`sw-st ${s.status}`}>{STATUS_LABEL[s.status]}</span>
                      </li>
                    ))}
                  </ol>
                </details>
              ))}
            </section>

            <section className="mq-block">
              <h2>Brief complet</h2>
              <p className="pj-note">Une version Markdown du projet (structure, contexte, contraintes) à conserver ou à partager.</p>
              <button className="o-btn" type="button" onClick={() => { setMd(briefMarkdown(name, siteType, brief)); setMdCopied(false); }}>
                Générer le brief (Markdown)
              </button>
              {md !== null && (
                <div className="pj-md" style={{ marginTop: 12 }}>
                  <textarea readOnly value={md} aria-label="Brief au format Markdown" />
                  <button className="o-btn sm" type="button" onClick={async () => setMdCopied(await writeClipboard(md))}>
                    {mdCopied ? "✓ Copié" : "Copier"}
                  </button>
                </div>
              )}
            </section>
          </div>

          <aside className="mq-out" aria-label="Prompt final">
            <h2 className="o-h2" style={{ fontSize: 28 }}>
              Prompt à copier
            </h2>
            <article className="mq-prompt">
              <header>
                <b>{prompt.title}</b>
                <em>{prompt.body.length.toLocaleString("fr-FR")} car.</em>
              </header>
              <textarea readOnly value={prompt.body} aria-label="Prompt final d'assemblage" style={{ height: 360 }} />
              <div className="o-row">
                <button className="o-btn primary sm" type="button" onClick={copy}>
                  {copied ? "✓ Copié" : "Copier"}
                </button>
              </div>
            </article>
          </aside>
        </div>
      )}
    </>
  );
}
