import { AX, HARD, MAX, PARAMS, RAND, TAGS, TENSION, VG, WF, REFV, IMGV, DEMO } from "@/data/outils/lexique";
import type { Example, LexiqueState, Param, ParamState, Tip } from "@/data/outils/lexique-types";
import { TIPS } from "@/data/outils/lexique";

/* ---------- Index ---------- */
const EX: Record<string, Record<string, Example>> = {};
PARAMS.forEach((p) => {
  const m: Record<string, Example> = {};
  p.ex.forEach((e) => (m[e.k] = e));
  EX[p.id] = m;
});

const HARD_MAP = new Map<string, Set<string>>();
const TEN_MAP = new Map<string, Map<string, string>>();
HARD.forEach(([a, b]) => {
  (HARD_MAP.get(a) ?? HARD_MAP.set(a, new Set()).get(a)!).add(b);
  (HARD_MAP.get(b) ?? HARD_MAP.set(b, new Set()).get(b)!).add(a);
});
TENSION.forEach(([a, b, m]) => {
  (TEN_MAP.get(a) ?? TEN_MAP.set(a, new Map()).get(a)!).set(b, m);
  (TEN_MAP.get(b) ?? TEN_MAP.set(b, new Map()).get(b)!).set(a, m);
});

export const STORAGE_KEY = "lexique-prompt-design-v1";
export const maxOf = (pid: string): number => MAX[pid] ?? 1;
export const paramOf = (pid: string): Param => PARAMS.find((p) => p.id === pid) ?? PARAMS[0]!;
export const example = (pid: string, k: string): Example | undefined => EX[pid]?.[k];
export const hardOf = (id: string): Set<string> => HARD_MAP.get(id) ?? new Set();
export const tensionsOf = (id: string): Map<string, string> => TEN_MAP.get(id) ?? new Map();

export function lbl(id: string): string {
  const [p = "", k = ""] = id.split(".");
  return EX[p]?.[k]?.l ?? id;
}
export const q = (s: string): string => `« ${s} »`;
export const esc = (s: string): string =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] ?? c);
export const pad = (n: number): string => String(n).padStart(2, "0");

/* ---------- État ---------- */
const empty = (): ParamState => ({ sel: [], note: "" });
export const slot = (s: LexiqueState, pid: string): ParamState => s[pid] ?? empty();

export function emptyState(): LexiqueState {
  const s: LexiqueState = {};
  PARAMS.forEach((p) => (s[p.id] = empty()));
  return s;
}

function clone(s: LexiqueState): LexiqueState {
  const n: LexiqueState = {};
  PARAMS.forEach((p) => {
    const c = slot(s, p.id);
    n[p.id] = { sel: [...c.sel], note: c.note };
  });
  return n;
}

export const selIds = (s: LexiqueState): string[] => PARAMS.flatMap((p) => slot(s, p.id).sel.map((k) => `${p.id}.${k}`));
export const filled = (s: LexiqueState, pid: string): boolean => {
  const c = slot(s, pid);
  return c.sel.length > 0 || !!c.note.trim();
};

/** Ajoute un choix en respectant les règles ; renvoie le nouvel état et les libellés remplacés */
export function select(s: LexiqueState, pid: string, k: string): { state: LexiqueState; replaced: string[] } {
  const next = clone(s);
  const replaced: string[] = [];
  hardOf(`${pid}.${k}`).forEach((o) => {
    const [op = "", ok = ""] = o.split(".");
    const cur = next[op];
    const i = cur ? cur.sel.indexOf(ok) : -1;
    if (cur && i > -1) {
      cur.sel.splice(i, 1);
      replaced.push(lbl(o));
    }
  });
  const target = next[pid] ?? (next[pid] = empty());
  while (target.sel.length >= maxOf(pid)) {
    const out = target.sel.shift();
    if (out === undefined) break;
    replaced.push(lbl(`${pid}.${out}`));
  }
  target.sel.push(k);
  return { state: next, replaced };
}

export function deselect(s: LexiqueState, pid: string, k: string): LexiqueState {
  const next = clone(s);
  const t = next[pid];
  if (t) t.sel = t.sel.filter((x) => x !== k);
  return next;
}

export function setSel(s: LexiqueState, pid: string, sel: string[]): LexiqueState {
  const next = clone(s);
  const t = next[pid] ?? (next[pid] = empty());
  t.sel = [...sel];
  return next;
}

export function setNote(s: LexiqueState, pid: string, note: string): LexiqueState {
  const next = clone(s);
  const t = next[pid] ?? (next[pid] = empty());
  t.note = note;
  return next;
}

export function activeTensions(s: LexiqueState): [string, string, string][] {
  const ids = selIds(s);
  const res: [string, string, string][] = [];
  ids.forEach((a, i) =>
    ids.slice(i + 1).forEach((b) => {
      const m = tensionsOf(a).get(b);
      if (m) res.push([a, b, m]);
    }),
  );
  return res;
}

/** Rejoue une sélection pour qu'elle respecte les règles (état sauvegardé, anciennes versions) */
export function sanitize(raw: unknown): LexiqueState {
  let s = emptyState();
  if (!raw || typeof raw !== "object") return s;
  const r = raw as Record<string, { sel?: unknown; note?: unknown } | undefined>;
  PARAMS.forEach((p) => {
    const item = r[p.id];
    if (!item) return;
    s = setNote(s, p.id, typeof item.note === "string" ? item.note : "");
    (Array.isArray(item.sel) ? item.sel : [])
      .filter((k): k is string => typeof k === "string" && !!EX[p.id]?.[k])
      .forEach((k) => (s = select(s, p.id, k).state));
  });
  return s;
}

export function presetState(sel: Record<string, string[]>): LexiqueState {
  let s = emptyState();
  Object.entries(sel).forEach(([pid, ks]) => ks.forEach((k) => (s = select(s, pid, k).state)));
  return s;
}

/* ---------- Personnalité (axes) ---------- */
const AXES = paramOf("perso").axes ?? [];
export function axesOf(s: LexiqueState): { v: number; l: string; r: string }[] {
  const sel = slot(s, "perso").sel;
  return AXES.map((a, j) => {
    const v = sel.length ? sel.reduce((t, k) => t + (AX[k]?.[j] ?? 0), 0) / sel.length : 0;
    return { v, l: a[0], r: a[1] };
  });
}
export function axisLabel({ v, l, r }: { v: number; l: string; r: string }): { txt: string; side?: string; pct: number | null } {
  if (Math.abs(v) < 0.15) return { txt: "Équilibré", pct: null };
  const pct = Math.round(50 + Math.abs(v) * 50);
  const side = (v < 0 ? l : r).toLowerCase();
  return { txt: `${Math.abs(v) > 0.7 ? "Très" : "Plutôt"} ${side} · ${pct} %`, side, pct };
}

/* ---------- Prompt ---------- */
export function buildPrompt(s: LexiqueState, tipsOn: Record<string, boolean>): string {
  const lines: string[] = [];
  PARAMS.forEach((p) => {
    const st = slot(s, p.id);
    const frags = st.sel.map((k) => EX[p.id]?.[k]?.p ?? "");
    if (p.id === "perso" && st.sel.length) {
      const pos = axesOf(s)
        .map(axisLabel)
        .filter((x) => x.pct)
        .map((x) => `${x.txt.split(" · ")[0]?.toLowerCase()} (${x.pct} %)`);
      if (pos.length) frags.push("positionnement : " + pos.join(", "));
    }
    if (st.note.trim()) frags.push(st.note.trim());
    if (frags.length) lines.push(`[${p.tag}] ${frags.join(" ; ")}.`);
  });
  if (!lines.length) return "";
  const method = TIPS.filter((t) => tipsOn[t.k]).map((t) => "- " + t.p);
  return (
    "Conçois l'interface suivante en respectant précisément chaque paramètre :\n\n" +
    lines.join("\n\n") +
    (method.length ? "\n\n[MÉTHODE]\n" + method.join("\n") : "") +
    (tipsOn.variants ? "\n\nGénère ensuite les 3 directions." : "\n\nGénère ensuite le design.")
  );
}

export const defaultTips = (): Record<string, boolean> => Object.fromEntries(TIPS.map((t: Tip) => [t.k, true]));
export function sanitizeTips(raw: unknown): Record<string, boolean> {
  const tips = defaultTips();
  if (raw && typeof raw === "object") {
    const r = raw as Record<string, unknown>;
    TIPS.forEach((t) => {
      if (typeof r[t.k] === "boolean") tips[t.k] = r[t.k] as boolean;
    });
  }
  return tips;
}

/* ---------- Choix cohérents ---------- */
const tagsOf = (id: string): string[] => {
  const [p = "", k = ""] = id.split(".");
  return (TAGS[p]?.[k] ?? "").split(" ").filter(Boolean);
};

/** Choisit des exemples pour une étape : sans contradiction, en évitant les tensions,
 *  en privilégiant les univers déjà présents dans la sélection */
export function chooseFor(s: LexiqueState, pid: string, avoidCur: boolean, full: boolean): { chosen: string[]; guides: string[] } {
  const p = paramOf(pid);
  const r = RAND[pid] ?? 1;
  let n = Array.isArray(r) ? r[0] + Math.floor(Math.random() * (r[1] - r[0] + 1)) : r;
  n = Math.min(n, maxOf(pid));
  if (full) n = maxOf(pid);
  const others = selIds(s).filter((id) => !id.startsWith(pid + "."));
  const oset = new Set(others);
  const weight: Record<string, number> = {};
  others.forEach((id) => tagsOf(id).forEach((t) => (weight[t] = (weight[t] ?? 0) + 1)));
  const cur = slot(s, pid).sel;
  const scored = p.ex
    .map((e) => e.k)
    .filter((k) => ![...hardOf(`${pid}.${k}`)].some((o) => oset.has(o)))
    .map((k) => {
      const id = `${pid}.${k}`;
      const ten = [...tensionsOf(id).keys()].some((o) => oset.has(o));
      let sc = tagsOf(id).reduce((t, g) => t + 2 * (weight[g] ?? 0), 0);
      if (ten) sc -= 3;
      if (avoidCur && cur.includes(k)) sc -= 1.5;
      return { k, ten, sc: sc + Math.random() * 4 };
    })
    .sort((a, b) => b.sc - a.sc);
  const chosen: string[] = [];
  for (const { k, ten } of scored) {
    if (chosen.length >= n) break;
    if (n === Infinity && ten) continue;
    if (chosen.some((c) => hardOf(`${pid}.${c}`).has(`${pid}.${k}`))) continue;
    chosen.push(k);
  }
  const chosenTags = new Set(chosen.flatMap((k) => tagsOf(`${pid}.${k}`)));
  const guides = others.filter((id) => tagsOf(id).some((t) => chosenTags.has(t))).slice(0, 2);
  return { chosen, guides };
}

/** Combinaison aléatoire cohérente ; conserve le type de projet déjà choisi */
export function surprise(state: LexiqueState): LexiqueState {
  const keepType = slot(state, "type").sel.slice();
  let s = emptyState();
  if (keepType.length) s = setSel(s, "type", keepType);
  PARAMS.forEach((p) => {
    if (p.id === "type" && keepType.length) return;
    s = setSel(s, p.id, chooseFor(s, p.id, false, false).chosen);
  });
  return s;
}

/** Étapes sans limite : sélectionne tout ce qui ne contredit pas les autres choix */
export function selectAll(s: LexiqueState, pid: string): { state: LexiqueState; skipped: string[]; cleared: boolean; count: number } {
  const p = paramOf(pid);
  const others = new Set(selIds(s).filter((id) => !id.startsWith(pid + ".")));
  const ok = p.ex.map((e) => e.k).filter((k) => ![...hardOf(`${pid}.${k}`)].some((o) => others.has(o)));
  const skipped = p.ex.map((e) => e.k).filter((k) => !ok.includes(k));
  const cur = slot(s, pid).sel;
  if (ok.every((k) => cur.includes(k))) return { state: setSel(s, pid, []), skipped: [], cleared: true, count: 0 };
  return { state: setSel(s, pid, ok), skipped, cleared: false, count: ok.length };
}

/* ---------- Aperçus (HTML statique écrit par nous, jamais de saisie utilisateur) ---------- */
export function isDark(hex: string): boolean {
  const n = parseInt(hex.slice(1), 16);
  const r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  return (r * 299 + g * 587 + b * 114) / 1000 < 140;
}

export function preview(p: Param, ex: Example): string {
  const k = p.kind;
  if (k === "style") return VG[ex.k] ?? "";
  if (k === "wire") return WF[ex.k] ?? "";
  if (k === "ref") return REFV[ex.k] ?? "";
  if (k === "img") return IMGV[ex.k] ?? "";
  if (k === "demo") return DEMO[ex.k] ?? "";
  if (k === "shape") return `<div class="shp shp-${ex.k}"><div class="o">${ex.k === "grain" ? "Grain" : ex.k === "paper" ? "Fait main" : "Bouton"}</div></div>`;
  const v = ex.pv;
  if (k === "font" && v) {
    if (v.pair) return `<div class="fs"><span style="font:400 40px/1 'Instrument Serif',serif">Titre élégant</span><span style="font:400 13px/1.4 'DM Sans',sans-serif;color:var(--ink-2)">Et un texte courant neutre, très lisible, qui laisse respirer les titres.</span><span class="nm">${v.nm ?? ""}</span></div>`;
    if (v.scale) return `<div class="fs" style="justify-content:flex-end;gap:2px"><span style="font:800 56px/.85 Inter,sans-serif;letter-spacing:-.05em">Hero</span><span style="font:700 20px/1 Inter,sans-serif">Sous-titre</span><span style="font:400 11px Inter,sans-serif;color:var(--ink-2)">Texte courant en 16 px</span></div>`;
    const st = `font-family:${v.f};font-weight:${v.w};font-style:${v.st || "normal"};letter-spacing:${v.ls || "normal"};text-transform:${v.tt || "none"}`;
    return `<div class="fs"><span class="aa" style="${st}">Aa</span><span class="ln" style="${st}">Créer des interfaces</span><span class="nm">${v.nm ?? ""}</span></div>`;
  }
  if (k === "swatch" && v) {
    if (v.grad) return `<div class="sw-grad" style="background:${v.grad}"></div>`;
    if (v.ratio) return `<div class="sw-wrap">${v.ratio.map(([c, r]) => `<i class="${isDark(c) ? "dk" : ""}" style="background:${c};flex:${r}">${r}%</i>`).join("")}</div>`;
    return `<div class="sw-wrap">${(v.c ?? []).map((c) => `<i class="${isDark(c) ? "dk" : ""}" style="background:${c}">${c}</i>`).join("")}</div>`;
  }
  return "";
}

/** Étapes du Lexique déjà remplies (pour la progression) */
export const filledCount = (s: LexiqueState): number => PARAMS.filter((p) => filled(s, p.id)).length;
export const PARAM_COUNT = PARAMS.length;
