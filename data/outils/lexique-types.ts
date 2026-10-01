/** Aperçu visuel d'un exemple de typographie ou de palette */
export interface Pv {
  nm?: string;
  f?: string;
  w?: string | number;
  st?: string;
  ls?: string;
  tt?: string;
  pair?: boolean;
  scale?: boolean;
  c?: string[];
  grad?: string;
  ratio?: [string, number][];
}

export interface Example {
  k: string;
  l: string;
  p: string;
  u?: string;
  hint?: string;
  pv?: Pv;
  /** Étape « Mise en page & mouvement » : paramètre d'origine de l'option (sa vignette en vient) */
  from?: string;
}

export type ParamKind = "text" | "style" | "wire" | "ref" | "img" | "demo" | "shape" | "font" | "swatch" | "mixed";

export interface Param {
  id: string;
  tag: string;
  title: string;
  kind: ParamKind;
  added?: boolean;
  cls?: string;
  lead: string;
  qs: string[];
  sample: string;
  tip?: string;
  axes?: [string, string][];
  ex: Example[];
}

export interface Tip {
  k: string;
  t: string;
  d: string;
  p: string;
}

/* ---------- v2 : éléments (briques) ---------- */

export type Tone = "sobre" | "edito" | "expe";

export interface Variant {
  k: string;
  l: string;
  p: string;
}

export interface Element {
  k: string;
  l: string;
  cat: string;
  /** Hauteur de la brique (1 à 3) */
  h: number;
  /** Largeur en vue de dessus, sur 8 */
  w: number;
  d: string;
  v: Variant[];
  /** Contenus possibles */
  c: string[];
}

export interface Cat {
  l: string;
  c: string;
}

/** Pertinence d'un paramètre local pour un élément : r = recommandé, p = possible */
export interface Rel {
  r?: string[];
  p?: string[];
}

export interface Brick {
  uid: string;
  k: string;
}

export interface Page {
  id: string;
  name: string;
  bricks: Brick[];
}

export interface GlobalSlot {
  sel: string[];
  note: string;
}

export interface ElementState {
  /** Variante (mode direct : 1) ou variantes à comparer (2 à 4) */
  v: string[];
  c: string[];
  p: Record<string, string[]>;
  note: string;
  design: string;
  done: boolean;
  cmp?: boolean;
  pick?: string;
  keep?: string;
}

export type Mode = "one" | "multi";
export type View = "facade" | "relief" | "plaque";

export interface LexiqueV2State {
  v: 2;
  step: string;
  mode: Mode | null;
  view: View | null;
  /** Paramètres globaux ; sys.sel contient des ids complets (param.clé) */
  g: Record<string, GlobalSlot>;
  pages: Page[];
  /** Plateau actif */
  active: string;
  el: Record<string, ElementState>;
  stack: string;
}
