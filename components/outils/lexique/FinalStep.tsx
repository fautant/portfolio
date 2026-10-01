"use client";

import { STACKS } from "@/data/outils/lexique-v2";
import type { LexiqueV2State } from "@/data/outils/lexique-types";
import { allBricks, catOf, edit, elementOf, finalPrompt, variantOf, type Result } from "@/lib/outils/lexique";

interface FinalStepProps {
  state: LexiqueV2State;
  apply: (r: LexiqueV2State | Result) => void;
  onGo: (key: string) => void;
  onCopy: (text: string, msg: string) => void;
  onPrev: () => void;
  prevName: string;
}

export function FinalStep({ state, apply, onGo, onCopy, onPrev, prevName }: FinalStepProps) {
  const bricks = allBricks(state);
  const hasDesign = (uid: string) => !!(state.el[uid]?.design ?? "").trim();
  const missing = bricks.filter((b) => !hasDesign(b.uid)).length;
  const multi = state.mode === "multi";

  return (
    <section className="block param is-current" id="final">
      <span className="tag">[PROMPT CLAUDE CODE]</span>
      <h2>
        {!bricks.length
          ? "Aucune brique pour l’instant"
          : missing
            ? `Prompt prêt à ${Math.round(((bricks.length - missing) / bricks.length) * 100)} %`
            : "Ton prompt Claude Code est prêt"}
      </h2>
      <p className="lead" style={{ marginTop: 12 }}>
        {!bricks.length
          ? "Construis d’abord la structure du portfolio."
          : missing
            ? `${missing} élément${missing > 1 ? "s" : ""} sans design retenu. Tu peux copier le prompt tel quel : Claude Code déduira ces éléments de la direction globale.`
            : "Tous les éléments ont un design retenu. Précise la stack, puis copie le prompt dans Claude Code."}
      </p>

      <div className="fin-pages">
        {state.pages
          .filter((p) => p.bricks.length)
          .map((p) => (
            <div key={p.id}>
              <b className="fin-page">{multi ? p.name : "Page unique"}</b>
              <div className="recap">
                {p.bricks.map((b) => {
                  const has = hasDesign(b.uid);
                  const d = state.el[b.uid];
                  const vl = d?.v.map((k) => variantOf(b.k, k)?.l).find(Boolean);
                  return (
                    <button key={b.uid} type="button" className={`rc${has ? " ok" : ""}`} onClick={() => onGo(`el:${b.uid}`)}>
                      <span>
                        <i style={{ background: catOf(b.k).c }} />
                        {has ? "✓" : "··"}
                      </span>
                      {elementOf(b.k).l}
                      <em>{has ? vl ?? "Design collé" : "Design à coller"}</em>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
      </div>

      <div className="sub-head">
        <b>Stack technique</b>
        <span className="tg-hint">Propre à ce projet</span>
      </div>
      <label className="note" style={{ marginTop: 0 }}>
        <input
          type="text"
          value={state.stack}
          aria-label="Stack technique"
          onChange={(e) => { const v = e.target.value; apply(edit(state, (s) => void (s.stack = v))); }}
          placeholder="Laisse vide pour que Claude Code propose une stack et la justifie"
        />
      </label>
      <div className="pills" style={{ margin: "10px 0 28px" }}>
        {STACKS.map((l) => (
          <button
            key={l}
            type="button"
            className={`pill${state.stack === l ? " on" : ""}`}
            aria-pressed={state.stack === l}
            onClick={() => apply(edit(state, (s) => void (s.stack = s.stack === l ? "" : l)))}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="row">
        <button className="btn primary" type="button" onClick={() => onCopy(finalPrompt(state), "Prompt Claude Code copié")}>
          Copier le prompt Claude Code
        </button>
        <button className="btn" type="button" onClick={() => onGo("structure")}>
          Revoir la structure
        </button>
      </div>
      <div className="step-nav">
        <button className="btn" type="button" onClick={onPrev}>
          ← {prevName}
        </button>
        <span />
      </div>
    </section>
  );
}
