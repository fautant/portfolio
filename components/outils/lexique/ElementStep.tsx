"use client";

import { useState, type CSSProperties } from "react";
import { CATS, GLOBAL_IDS, LETTERS, LOCAL_IDS, LOCAL_MAX, REL, TONES } from "@/data/outils/lexique-v2";
import type { LexiqueV2State } from "@/data/outils/lexique-types";
import {
  allBricks, animAvoided, catOf, contentIssues, contrastedVariants, eIds, edit, elPrompt, elementOf, emptyEl, example, fIds, flagOf,
  gIds, gSlot, implied, interCount, lbl, locate, pad, paramOf, pickVariant, q, refinePrompt, setCompare, setElField, toggleContent,
  toggleLocal, toggleVariant, toneOf, vIds, type Result,
} from "@/lib/outils/lexique";
import { Dice, ExCard, FlagLine } from "./ParamStep";

interface ElementStepProps {
  state: LexiqueV2State;
  uid: string;
  step: string;
  nextKey: string;
  nextName: string;
  prevName: string;
  apply: (r: LexiqueV2State | Result) => void;
  onToast: (msg: string) => void;
  onGo: (key: string) => void;
  onCopy: (text: string, msg: string) => void;
  onPrev: () => void;
  onNext: () => void;
}

export function ElementStep({ state, uid, step, nextKey, nextName, prevName, apply, onToast, onGo, onCopy, onPrev, onNext }: ElementStepProps) {
  const [more, setMore] = useState<Record<string, boolean>>({});
  const loc = locate(state)[uid];
  if (!loc) return null;
  const { page: p } = loc;
  const ek = loc.k;
  const e = elementOf(ek);
  const d = state.el[uid] ?? emptyEl();
  const multi = state.mode === "multi";
  const bricks = allBricks(state);
  const pos = bricks.findIndex((x) => x.uid === uid);
  const doneN = bricks.filter((b) => state.el[b.uid]?.done).length;
  const twin = bricks.find((x) => x.uid !== uid && x.k === ek && state.el[x.uid]?.done);
  const nV = d.v.length;
  const ci = contentIssues(d, ek);
  const ctx = { uid, cur: step };
  const vOther = [...gIds(state), ...fIds(state)];
  const lOther = [...vOther, ...vIds(d, ek)];
  const imp = implied(d, ek);
  const nI = interCount(state);
  const animOn = animAvoided(state);
  const col = { "--c": catOf(ek).c } as CSSProperties;

  const validate = () => {
    const hasD = !!d.design.trim();
    apply(edit(state, (s) => { (s.el[uid] ?? (s.el[uid] = emptyEl())).done = true; s.step = nextKey; }));
    window.scrollTo(0, 0);
    onToast(hasD ? `${q(e.l)} validé` : `${q(e.l)} validé sans design collé`);
  };
  const validateLabel = nextKey === "final" ? "Valider et finaliser" : `Valider et passer à ${q(nextName)}`;
  const stateTxt = d.done ? (d.design ? "✓ Validé, design enregistré" : "✓ Validé, sans design collé") : d.design ? "Design collé, pas encore validé" : "Pas encore validé";

  const globalGroups = GLOBAL_IDS.flatMap((pid) => {
    const sl = gSlot(state, pid);
    if (pid === "type") return [{ tag: "TYPE", txt: ["Portfolio", "Développeur fullstack", state.mode === "multi" ? "Multi-pages" : state.mode === "one" ? "One-page" : ""].filter(Boolean).join(" · ") }];
    const t = [...sl.sel.map((k) => lbl(pid === "sys" ? k : `${pid}.${k}`)), sl.note.trim() ? q(sl.note.trim()) : ""].filter(Boolean);
    return t.length ? [{ tag: paramOf(pid).tag, txt: t.join(" · ") }] : [];
  });

  return (
    <section className="block param is-current" id={`el-${uid}`}>
      <div className="param-head">
        <div className="el-brick" style={col}>
          <i aria-hidden="true" />
          {pad(pos + 1)}
        </div>
        <div>
          <span className="tag">
            Élément {pos + 1}/{bricks.length}
            {multi ? ` · page « ${p.name} »` : ""} · {CATS[e.cat]?.l}
          </span>
          <h2>{e.l}</h2>
        </div>
        <div className="counter">
          <b>
            {doneN}
            <span>/{bricks.length}</span>
          </b>
          <small>
            éléments
            <br />
            validés
          </small>
        </div>
      </div>

      <div className="el-ctx">
        <span>{multi ? `${p.name} :` : "Page :"}</span>
        {p.bricks.map((x) => (
          <button key={x.uid} type="button" aria-current={x.uid === uid ? "step" : undefined} onClick={() => onGo(`el:${x.uid}`)}>
            <i style={{ background: catOf(x.k).c }} />
            {elementOf(x.k).l}
            {state.el[x.uid]?.done && <b>✓</b>}
          </button>
        ))}
      </div>

      {twin && !d.done && (
        <div className="el-reuse">
          <span>
            Tu as déjà validé {q(e.l)} sur la page {q(locate(state)[twin.uid]?.page.name ?? "")}. Tu peux reprendre le même design ici.
          </span>
          <button
            type="button"
            onClick={() => { apply(edit(state, (s) => void (s.el[uid] = { ...structuredClone(s.el[twin.uid]!), done: false }))); onToast("Choix et design repris"); }}
          >
            Reprendre ses choix et son design
          </button>
        </div>
      )}

      <div className="sub-head">
        <b>Variante</b>
        <span className={`cap-mini ${nV ? "full" : ""}`}>{d.cmp ? `${nV}/4 à comparer` : `${nV}/1 choix`}</span>
        <div className="seg" role="group" aria-label="Mode">
          <button type="button" aria-pressed={!d.cmp} onClick={() => apply(setCompare(state, uid, false))}>Je sais ce que je veux</button>
          <button type="button" aria-pressed={!!d.cmp} onClick={() => apply(setCompare(state, uid, true))}>Comparer des variantes</button>
        </div>
      </div>
      {d.cmp && (
        <div className="toolbar">
          <span>Coche 2 à 4 variantes : Claude Design fera une proposition par variante, étiquetées A, B, C…</span>
          <button className="btn dice" type="button" onClick={() => apply(contrastedVariants(state, uid, ek))}>
            <Dice />
            Je ne sais pas : choisis 3 variantes contrastées
          </button>
        </div>
      )}
      <div className="grid grid-var">
        {e.v.map((x) => {
          const on = d.v.includes(x.k);
          const flag = flagOf(state, `v.${ek}.${x.k}`, on, eIds(d), vOther, false, null, ctx);
          return (
            <article key={x.k} className={`ex${on ? " on" : ""}${!on && flag?.blocked ? " blocked" : ""}`}>
              <button className="ex-btn" type="button" aria-pressed={on} onClick={() => apply(toggleVariant(state, uid, ek, x.k))}>
                <span className="ex-l">{x.l}</span>
                <span className={`ex-add${on && d.cmp ? " letter" : ""}`} aria-hidden="true" data-l={on && d.cmp ? LETTERS[d.v.indexOf(x.k)] : undefined} />
                <span className="ex-p">{x.p}</span>
                <span className="tone">{TONES[toneOf(ek, x.k)]}</span>
              </button>
              {flag && <FlagLine flag={flag} onGo={onGo} />}
            </article>
          );
        })}
      </div>

      <div className="sub-head">
        <b>Contenu à inclure</b>
        <span className="cap-mini">{d.c.length} choix · sans limite</span>
      </div>
      <div className="pills">
        {e.c.map((l) => {
          const on = d.c.includes(l);
          const miss = ci.req.includes(l);
          const ban = ci.ban.includes(l);
          return (
            <button
              key={l}
              type="button"
              className={`pill${on ? " on" : ""}${miss ? " miss" : ""}${ban ? " ban" : ""}`}
              aria-pressed={on}
              title={miss ? `Prévu par la variante ${q(ci.vl)}` : ban ? `Contredit la variante ${q(ci.vl)}` : undefined}
              onClick={() => apply(toggleContent(state, uid, l))}
            >
              {ban ? "⚠" : on ? "✓" : "+"} {l}
            </button>
          );
        })}
      </div>
      {(ci.req.length > 0 || ci.ban.length > 0) && (
        <p className="pills-hint">
          {[ci.req.length ? `La variante ${q(ci.vl)} prévoit : ${ci.req.join(", ")}` : "", ci.ban.length ? `Contredit la variante : ${ci.ban.join(", ")}` : ""].filter(Boolean).join(" · ")}.
        </p>
      )}

      <div className="sub-head">
        <b>Paramètres de l’élément</b>
      </div>
      <p className="sub-lead">
        Seules les options adaptées à cet élément sont proposées ; les règles de tout le site sont dans l’étape globale « Mise en page &amp; mouvement ». Laisse un paramètre vide pour que Claude Design décide. Les démos réagissent à la souris ; fais défiler chaque rangée.
      </p>
      <div className="locals">
        {LOCAL_IDS.map((pid) => {
          const rel = REL[ek]?.[pid];
          if (!rel) return null;
          const pp = paramOf(pid);
          const notImp = (k: string) => !imp.includes(`${pid}.${k}`);
          const sel = (d.p[pid] ?? []).filter(notImp);
          const max = LOCAL_MAX[pid] ?? 1;
          const full = sel.length >= max;
          const card = (k: string) => {
            const x = example(pid, k);
            if (!x) return null;
            const on = sel.includes(k);
            const first = sel[0] ? `${pid}.${sel[0]}` : null;
            return (
              <ExCard
                key={k}
                compact
                param={pp}
                ex={x}
                on={on}
                flag={flagOf(state, `${pid}.${k}`, on, eIds(d), lOther, full, first, ctx)}
                onToggle={() => apply(toggleLocal(state, uid, pid, k))}
                onGo={onGo}
              />
            );
          };
          const rec = (rel.r ?? []).filter(notImp);
          const others = (rel.p ?? []).filter(notImp);
          const noRec = rec.length === 0;
          const open = noRec || !!more[pid] || others.some((k) => sel.includes(k));
          const impL = imp.filter((o) => o.startsWith(pid + ".")).map((o) => q(lbl(o)));
          return (
            <div className="local" key={pid}>
              <div className="local-head">
                <span className="tag">[{pp.tag}]</span>
                <b>{pp.title}</b>
                <span className={`cap-mini ${full ? "full" : ""}`}>
                  {sel.length}/{max}
                </span>
                {!sel.length && <span className="local-free">Libre</span>}
              </div>
              {pid === "inter" && nI > 0 && (
                <p className={`local-note${animOn && nI > 3 ? " warn" : ""}`}>
                  Sur tout le site : {nI} interaction{nI > 1 ? "s" : ""} différente{nI > 1 ? "s" : ""}
                  {animOn ? " (2 ou 3 au maximum avec « Animations partout » à éviter)" : ""}.
                </p>
              )}
              {impL.length > 0 && <p className="local-note ok">Déjà inclus par la variante : {impL.join(", ")}</p>}
              {!noRec && (
                <>
                  <span className="row-label">Recommandé pour {e.l}</span>
                  <div className="hrow">{rec.map(card)}</div>
                </>
              )}
              {!noRec && others.length > 0 && (
                <button type="button" className="more-btn" onClick={() => setMore({ ...more, [pid]: !open })}>
                  {open ? "Masquer les autres options" : `Voir aussi (${others.length}) : possible, moins courant`}
                </button>
              )}
              {open && others.length > 0 && <div className="hrow">{others.map(card)}</div>}
            </div>
          );
        })}
      </div>

      <div className="inherit">
        <div className="inherit-head">
          <h3>Hérité de la direction globale</h3>
          <button type="button" onClick={() => onGo(`g:${GLOBAL_IDS[0]}`)}>Modifier le global</button>
        </div>
        {globalGroups.map((gg) => (
          <div className="inherit-row" key={gg.tag}>
            <b>[{gg.tag}]</b>
            {gg.txt}
          </div>
        ))}
      </div>

      <label className="note" style={{ marginBottom: 30 }}>
        <span>Ta précision pour [{e.l.toUpperCase()}]</span>
        <input
          type="text"
          value={d.note}
          onChange={(ev) => apply(setElField(state, uid, "note", ev.target.value))}
          placeholder="Ex. : le nom doit rester lisible sur mobile, sous 3 lignes"
        />
      </label>

      {d.cmp ? (
        <div className={`loop${d.done ? " done" : ""}`}>
          <span className="tag">[BOUCLE CLAUDE DESIGN · EN DEUX TEMPS]</span>
          <div className="loop-grid">
            <div>
              <b className="loop-n">01 — EXPLORER</b>
              <p>Une proposition par variante cochée, côte à côte, sur le même contenu : seule la variante change.</p>
              <button
                className="btn primary"
                type="button"
                disabled={nV < 2}
                onClick={() => onCopy(elPrompt(state, uid, "explore"), "Prompt d’exploration copié : colle-le dans Claude Design")}
              >
                {nV >= 2 ? `Copier le prompt d’exploration (${nV} variantes)` : "Coche au moins 2 variantes"}
              </button>
            </div>
            <div>
              <b className="loop-n">02 — CHOISIR</b>
              <p>Quelle proposition retiens-tu ?</p>
              <div className="letters">
                {d.v.map((k, j) => (
                  <button key={k} type="button" aria-pressed={d.pick === k} onClick={() => apply(pickVariant(state, uid, ek, k))}>
                    <b>{LETTERS[j]}</b>
                    {e.v.find((y) => y.k === k)?.l ?? k}
                  </button>
                ))}
              </div>
              <input
                type="text"
                className="loop-input"
                value={d.keep ?? ""}
                onChange={(ev) => apply(setElField(state, uid, "keep", ev.target.value))}
                placeholder="À garder des autres propositions (optionnel)"
              />
            </div>
            <div>
              <b className="loop-n">03 — AFFINER</b>
              <p>À coller dans la même conversation Claude Design : il transforme la proposition retenue en version finale.</p>
              <button className="btn primary" type="button" disabled={!d.pick} onClick={() => onCopy(refinePrompt(state, uid), "Prompt d’affinage copié")}>
                {d.pick ? `Copier le prompt d’affinage (${LETTERS[d.v.indexOf(d.pick)]})` : "Choisis d’abord une proposition"}
              </button>
            </div>
          </div>
          <div className="loop-paste">
            <b className="loop-n">04 — COLLER LE DESIGN RETENU</b>
            <textarea
              value={d.design}
              onChange={(ev) => apply(setElField(state, uid, "design", ev.target.value))}
              placeholder="Colle ici la version affinée : description, valeurs clés (couleurs, tailles, espacements), voire le code HTML. Ce texte sera transmis tel quel à Claude Code."
            />
          </div>
          <div className="loop-foot">
            <b className="loop-n">05 — VALIDER</b>
            <button className="btn accent" type="button" onClick={validate}>{validateLabel}</button>
            <span className={d.done ? "ok" : ""}>{stateTxt}</span>
          </div>
        </div>
      ) : (
        <div className={`loop${d.done ? " done" : ""}`}>
          <span className="tag">[BOUCLE CLAUDE DESIGN]</span>
          <div className="loop-grid direct">
            <div>
              <b className="loop-n">01 — COPIER</b>
              <p>Le prompt contient la direction globale, la place de l’élément dans la page et les éléments déjà validés.</p>
              <button className="btn primary" type="button" onClick={() => onCopy(elPrompt(state, uid), `Prompt ${q(e.l)} copié : colle-le dans Claude Design`)}>
                Copier le prompt · {e.l}
              </button>
            </div>
            <div className="loop-paste wide">
              <b className="loop-n">02 — COLLER LE DESIGN RETENU</b>
              <textarea
                value={d.design}
                onChange={(ev) => apply(setElField(state, uid, "design", ev.target.value))}
                placeholder="Colle ici la direction choisie dans Claude Design : description, valeurs clés (couleurs, tailles, espacements), voire le code HTML. Ce texte sera transmis tel quel à Claude Code."
              />
            </div>
          </div>
          <div className="loop-foot">
            <b className="loop-n">03 — VALIDER</b>
            <button className="btn accent" type="button" onClick={validate}>{validateLabel}</button>
            <span className={d.done ? "ok" : ""}>{stateTxt}</span>
          </div>
        </div>
      )}

      <div className="step-nav">
        <button className="btn" type="button" onClick={onPrev}>
          ← {prevName}
        </button>
        <button className="link-next" type="button" onClick={onNext}>
          Passer sans valider : {nextName} →
        </button>
      </div>
    </section>
  );
}
