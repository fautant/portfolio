import type { SupportType } from "@/lib/validations/design-project";
import type { FieldDef } from "./form-fields";
import type { Family } from "./sections";

export interface SupportFormat {
  k: string;
  label: string;
}

export interface TemplatePage {
  name: string;
  goal: string;
  priority: "mvp" | "later";
  /** Clés du catalogue de sections (`data/outils/sections.ts`) */
  sections: string[];
}

export interface Support {
  type: SupportType;
  label: string;
  description: string;
  family: Family;
  /** Vocabulaire : « page », « écran » ou « face » */
  unit: "page" | "écran" | "face";
  /** false = le document n'a qu'une page : la gestion des pages est masquée */
  multiPage: boolean;
  formats: SupportFormat[];
  defaultFormats: string[];
  pages: TemplatePage[];
  /** Champs du formulaire de contexte propres à ce support */
  contextFields: FieldDef[];
  features: string[];
  /** États à proposer (dashboards, apps) */
  states: string[];
  /** Contraintes techniques d'impression ajoutées à chaque prompt */
  printRules: string[];
  /** Correspondance avec les exemples du Lexique (`type` et `goal`) */
  lexique: { type?: string; goal?: string };
}

const text = (id: string, label: string, extra: Partial<FieldDef> = {}): FieldDef => ({ id, label, type: "text", ...extra });
const area = (id: string, label: string, extra: Partial<FieldDef> = {}): FieldDef => ({ id, label, type: "textarea", ...extra });
const list = (id: string, label: string, extra: Partial<FieldDef> = {}): FieldDef => ({ id, label, type: "list", help: "Une entrée par ligne.", ...extra });
const select = (id: string, label: string, options: readonly string[], extra: Partial<FieldDef> = {}): FieldDef => ({ id, label, type: "select", options, ...extra });
const chips = (id: string, label: string, options: readonly string[], extra: Partial<FieldDef> = {}): FieldDef => ({ id, label, type: "chips", options, ...extra });
const toggle = (id: string, label: string, extra: Partial<FieldDef> = {}): FieldDef => ({ id, label, type: "toggle", ...extra });

const WEB_FORMATS: SupportFormat[] = [
  { k: "desktop", label: "Desktop (1440 px)" },
  { k: "tablet", label: "Tablette (768 px)" },
  { k: "mobile", label: "Mobile (375 px)" },
];
const WEB = { family: "web" as const, formats: WEB_FORMATS, defaultFormats: ["desktop", "mobile"], printRules: [] as string[] };

const std = { nav: "nav", hero: "hero", contact: "contact", cta: "cta", foot: "footer" };

export const SUPPORTS: Record<SupportType, Support> = {
  "portfolio-dev": {
    ...WEB,
    type: "portfolio-dev",
    label: "Portfolio développeur",
    description: "Présenter ses projets et sa stack pour convaincre recruteurs et clients.",
    unit: "page",
    multiPage: true,
    pages: [
      { name: "Accueil", goal: "Faire comprendre qui je suis en 30 secondes et donner envie de voir la suite", priority: "mvp", sections: [std.nav, std.hero, "projects", "stack", "about", std.cta, std.foot] },
      { name: "Projets", goal: "Parcourir et filtrer tous les projets", priority: "mvp", sections: [std.nav, "filters", "projects", std.foot] },
      { name: "Détail d'un projet", goal: "Raconter un projet : contexte, rôle, stack, résultat", priority: "later", sections: [std.nav, "case-study", "stack", std.cta, std.foot] },
      { name: "Contact", goal: "Rendre la prise de contact immédiate", priority: "mvp", sections: [std.nav, std.contact, std.foot] },
    ],
    contextFields: [
      select("target", "Qui doit être convaincu ?", ["Recruteurs", "Clients freelance", "Les deux"], { required: true }),
      text("projectCount", "Nombre de projets à montrer", { placeholder: "6" }),
      text("stack", "Technologies à mettre en avant", { placeholder: "Symfony, Laravel, Next.js" }),
      text("availability", "Disponibilité", { placeholder: "Stage dès avril, freelance en soirée" }),
    ],
    features: ["Formulaire de contact", "Téléchargement du CV", "Multilingue", "Mode sombre", "Animations avancées"],
    states: [],
    lexique: { type: "dev", goal: "recruiter" },
  },
  "portfolio-ux": {
    ...WEB,
    type: "portfolio-ux",
    label: "Portfolio UX / design",
    description: "Mettre en avant 3 à 4 études de cas détaillées.",
    unit: "page",
    multiPage: true,
    pages: [
      { name: "Accueil", goal: "Accrocher avec une phrase forte et les études de cas phares", priority: "mvp", sections: [std.nav, std.hero, "projects", "testimonials", std.cta, std.foot] },
      { name: "Étude de cas", goal: "Montrer le process : contexte, problème, démarche, résultat chiffré", priority: "mvp", sections: [std.nav, "case-study", "stats", std.cta, std.foot] },
      { name: "À propos", goal: "Humaniser et expliquer la façon de travailler", priority: "mvp", sections: [std.nav, "about", "method", std.foot] },
      { name: "Contact", goal: "Faciliter la prise de contact", priority: "mvp", sections: [std.nav, std.contact, std.foot] },
    ],
    contextFields: [
      select("target", "Qui doit être convaincu ?", ["Agences", "Recruteurs", "Clients directs"], { required: true }),
      text("caseCount", "Nombre d'études de cas", { placeholder: "3" }),
      area("process", "Ta démarche en une phrase", { placeholder: "Recherche, idéation, prototypage, tests" }),
    ],
    features: ["Formulaire de contact", "Téléchargement du CV", "Animations avancées", "Mode sombre"],
    states: [],
    lexique: { type: "ux", goal: "agency" },
  },
  freelance: {
    ...WEB,
    type: "freelance",
    label: "Site freelance / vitrine",
    description: "Convertir des visiteurs en clients : offres, méthode, preuves, rendez-vous.",
    unit: "page",
    multiPage: true,
    pages: [
      { name: "Accueil", goal: "Poser la proposition de valeur et pousser vers la prise de contact", priority: "mvp", sections: [std.nav, std.hero, "services", "method", "testimonials", std.cta, std.foot] },
      { name: "Services", goal: "Détailler chaque offre, son périmètre et son prix indicatif", priority: "mvp", sections: [std.nav, "services", "pricing", "faq", std.foot] },
      { name: "Réalisations", goal: "Prouver par des exemples concrets", priority: "later", sections: [std.nav, "projects", "logos", std.foot] },
      { name: "Contact / devis", goal: "Recueillir un brief exploitable", priority: "mvp", sections: [std.nav, std.contact, "booking", std.foot] },
    ],
    contextFields: [
      area("offer", "Tes offres en quelques mots", { required: true }),
      text("priceRange", "Fourchette de prix", { placeholder: "À partir de 800 €" }),
      chips("proof", "Preuves disponibles", ["Témoignages", "Logos clients", "Études de cas", "Chiffres"]),
    ],
    features: ["Formulaire de contact", "Prise de rendez-vous", "Multilingue", "Analytics", "Newsletter"],
    states: [],
    lexique: { type: "freelance", goal: "client" },
  },
  landing: {
    ...WEB,
    type: "landing",
    label: "Landing page produit",
    description: "Une page qui présente un produit et convertit.",
    unit: "page",
    multiPage: true,
    pages: [
      { name: "Landing", goal: "Expliquer la valeur, rassurer, faire agir", priority: "mvp", sections: [std.nav, std.hero, "logos", "features", "stats", "testimonials", "pricing", "faq", std.cta, std.foot] },
      { name: "Tarifs", goal: "Comparer les offres", priority: "later", sections: [std.nav, "pricing", "faq", std.foot] },
      { name: "Inscription", goal: "Créer un compte ou rejoindre la liste d'attente", priority: "later", sections: [std.contact, std.foot] },
    ],
    contextFields: [
      text("product", "Produit ou service", { required: true }),
      text("promise", "Promesse principale", { required: true, placeholder: "Gagnez 5 h par semaine sur votre facturation" }),
      text("offer", "Offre / prix", { placeholder: "Essai gratuit 14 jours puis 19 €/mois" }),
      list("objections", "Objections à lever", { placeholder: "Est-ce compliqué à mettre en place ?" }),
      chips("proof", "Preuves disponibles", ["Témoignages", "Logos clients", "Chiffres", "Presse", "Avis en ligne"]),
    ],
    features: ["Newsletter", "Analytics", "Animations avancées", "Multilingue"],
    states: [],
    lexique: { type: "landing", goal: "cta" },
  },
  ecommerce: {
    ...WEB,
    type: "ecommerce",
    label: "E-commerce",
    description: "Vendre en ligne : catalogue, fiche produit, panier, paiement.",
    unit: "page",
    multiPage: true,
    pages: [
      { name: "Accueil", goal: "Mettre en avant les produits phares et rassurer", priority: "mvp", sections: [std.nav, std.hero, "products", "testimonials", "newsletter", std.foot] },
      { name: "Catalogue", goal: "Trouver rapidement un produit", priority: "mvp", sections: [std.nav, "filters", "products", std.foot] },
      { name: "Fiche produit", goal: "Donner toutes les infos et faire ajouter au panier", priority: "mvp", sections: [std.nav, "product-detail", "testimonials", "products", std.foot] },
      { name: "Panier", goal: "Vérifier sa commande", priority: "mvp", sections: [std.nav, "cart", std.foot] },
      { name: "Paiement", goal: "Payer sans friction", priority: "mvp", sections: ["cart", std.contact] },
      { name: "Compte client", goal: "Suivre ses commandes", priority: "later", sections: [std.nav, "table", std.foot] },
    ],
    contextFields: [
      text("catalog", "Type de produits", { required: true, placeholder: "Bougies artisanales" }),
      text("productCount", "Taille du catalogue", { placeholder: "~40 produits" }),
      text("shipping", "Livraison et retours", { placeholder: "Livraison offerte dès 50 €, retours 30 jours" }),
      chips("payment", "Moyens de paiement", ["Carte", "PayPal", "Apple Pay", "Virement"]),
    ],
    features: ["Recherche", "Filtres", "Panier", "Paiement en ligne", "Espace membre", "Authentification", "Newsletter"],
    states: ["Panier vide", "Chargement", "Erreur de paiement", "Commande confirmée"],
    lexique: { goal: "trust" },
  },
  blog: {
    ...WEB,
    type: "blog",
    label: "Blog éditorial",
    description: "Un blog où le confort de lecture passe avant tout.",
    unit: "page",
    multiPage: true,
    pages: [
      { name: "Accueil", goal: "Présenter les derniers articles et l'esprit du blog", priority: "mvp", sections: [std.nav, std.hero, "articles", "newsletter", std.foot] },
      { name: "Article", goal: "Lire confortablement", priority: "mvp", sections: [std.nav, "article-read", "articles", "newsletter", std.foot] },
      { name: "Catégorie / archive", goal: "Explorer par thème", priority: "later", sections: [std.nav, "filters", "articles", std.foot] },
      { name: "À propos", goal: "Savoir qui écrit", priority: "later", sections: [std.nav, "about", std.foot] },
    ],
    contextFields: [
      list("topics", "Thématiques", { required: true }),
      select("frequency", "Rythme de publication", ["Quotidien", "Hebdomadaire", "Mensuel", "Irrégulier"]),
      select("tone", "Ton éditorial", ["Expert et sérieux", "Pédagogue", "Personnel et humoristique"]),
    ],
    features: ["Blog / articles", "Recherche", "Newsletter", "Mode sombre", "Multilingue"],
    states: [],
    lexique: { type: "blog" },
  },
  dashboard: {
    ...WEB,
    type: "dashboard",
    label: "Dashboard / application web",
    description: "Application web : navigation latérale, KPIs, tableaux, filtres, états vides.",
    unit: "écran",
    multiPage: true,
    pages: [
      { name: "Connexion", goal: "Se connecter simplement", priority: "mvp", sections: [std.contact] },
      { name: "Tableau de bord", goal: "Voir l'essentiel en un coup d'œil", priority: "mvp", sections: [std.nav, "kpis", "table"] },
      { name: "Liste", goal: "Parcourir, filtrer, trier les éléments", priority: "mvp", sections: [std.nav, "filters", "table"] },
      { name: "Détail", goal: "Consulter et modifier un élément", priority: "mvp", sections: [std.nav, "product-detail", "table"] },
      { name: "Paramètres", goal: "Configurer son compte", priority: "later", sections: [std.nav, std.contact] },
    ],
    contextFields: [
      text("users", "Qui utilise l'application ?", { required: true }),
      list("keyData", "Données clés à afficher"),
      list("tasks", "Actions les plus fréquentes"),
    ],
    features: ["Authentification", "Recherche", "Filtres", "Notifications", "Mode sombre", "Espace membre"],
    states: ["État vide", "Chargement", "Erreur", "Succès"],
    lexique: { type: "dashboard" },
  },
  mobile: {
    ...WEB,
    formats: [{ k: "mobile", label: "Mobile (375 px)" }],
    defaultFormats: ["mobile"],
    type: "mobile",
    label: "Application mobile",
    description: "Application mobile : parcours d'accueil, écrans clés, états.",
    unit: "écran",
    multiPage: true,
    pages: [
      { name: "Onboarding", goal: "Expliquer la valeur en 3 écrans", priority: "mvp", sections: [std.hero, std.cta] },
      { name: "Accueil", goal: "Accéder à l'action principale", priority: "mvp", sections: ["articles", std.nav] },
      { name: "Détail", goal: "Consulter un élément", priority: "mvp", sections: ["product-detail", std.cta] },
      { name: "Profil", goal: "Gérer son compte", priority: "later", sections: ["about", std.contact] },
    ],
    contextFields: [
      select("platform", "Plateforme", ["iOS", "Android", "Les deux"], { required: true }),
      select("usage", "Contexte d'usage", ["En mobilité, une main", "Assis, session longue", "Rapide, quelques secondes"]),
      list("keyActions", "Actions clés de l'application"),
    ],
    features: ["Authentification", "Notifications", "Mode sombre", "Recherche"],
    states: ["État vide", "Chargement", "Erreur réseau", "Succès"],
    lexique: { type: "dashboard" },
  },

  /* ---------- Imprimable ---------- */
  cv: {
    type: "cv",
    label: "CV",
    description: "Un CV lisible en 10 secondes, adapté au poste visé.",
    family: "print",
    unit: "page",
    multiPage: false,
    formats: [{ k: "a4", label: "A4 portrait (210 × 297 mm)" }],
    defaultFormats: ["a4"],
    pages: [{ name: "CV", goal: "Convaincre un recruteur en 10 secondes de l'inviter en entretien", priority: "mvp", sections: ["cv-header", "cv-profile", "cv-experience", "cv-education", "cv-skills", "cv-languages", "cv-interests"] }],
    contextFields: [
      text("role", "Poste visé", { required: true, placeholder: "Développeur fullstack junior" }),
      text("targetCompany", "Entreprise ou secteur ciblé"),
      select("level", "Niveau d'expérience", ["Étudiant", "Junior (< 2 ans)", "Confirmé (2–7 ans)", "Senior (> 7 ans)"], { required: true }),
      select("length", "Longueur", ["1 page", "2 pages"]),
      toggle("ats", "Doit passer les logiciels de tri automatique (ATS)"),
      toggle("photo", "Inclure une photo"),
      select("photoStyle", "Style de photo", ["Ronde", "Carrée", "Détourée"], { showIf: { field: "photo", equals: "yes" } }),
    ],
    features: [],
    states: [],
    printRules: ["Format A4 portrait (210 × 297 mm), marges intérieures ≥ 12 mm", "Texte courant ≥ 9 pt, titres de sections hiérarchisés", "Contraste texte/fond ≥ 4,5:1, lisible en noir et blanc", "Aucun texte incorporé dans une image"],
    lexique: { goal: "recruiter" },
  },
  "lettre-motivation": {
    type: "lettre-motivation",
    label: "Lettre de motivation",
    description: "Une page sobre, dans le même univers que le CV.",
    family: "print",
    unit: "page",
    multiPage: false,
    formats: [{ k: "a4", label: "A4 portrait (210 × 297 mm)" }],
    defaultFormats: ["a4"],
    pages: [{ name: "Lettre", goal: "Donner envie de rencontrer le candidat en une page", priority: "mvp", sections: ["letter-sender", "letter-subject", "letter-body", "letter-closing"] }],
    contextFields: [
      text("role", "Poste visé", { required: true }),
      text("company", "Entreprise", { required: true }),
      area("motivation", "Pourquoi cette entreprise ?"),
      select("tone", "Ton", ["Sobre et formel", "Chaleureux", "Dynamique"]),
      toggle("matchCv", "Reprendre l'en-tête et la palette du CV"),
    ],
    features: [],
    states: [],
    printRules: ["Format A4 portrait, marges ≥ 22 mm", "Corps de texte 10,5–11 pt, interligne ~1,15", "Tient sur une seule page"],
    lexique: { goal: "recruiter" },
  },
  "carte-visite": {
    type: "carte-visite",
    label: "Carte de visite",
    description: "Une carte mémorable, recto seul ou recto-verso.",
    family: "print",
    unit: "face",
    multiPage: true,
    formats: [{ k: "standard", label: "85 × 55 mm (standard)" }, { k: "square", label: "55 × 55 mm (carrée)" }],
    defaultFormats: ["standard"],
    pages: [
      { name: "Recto", goal: "Se faire reconnaître et retenir le nom", priority: "mvp", sections: ["card-logo", "card-identity"] },
      { name: "Verso", goal: "Prolonger avec un lien ou un slogan", priority: "later", sections: ["card-back"] },
    ],
    contextFields: [
      text("name", "Nom et fonction", { required: true }),
      chips("info", "Informations à afficher", ["Email", "Téléphone", "Site", "LinkedIn", "GitHub", "Adresse", "QR code"], { required: true }),
      text("qrUrl", "Adresse encodée par le QR code", { showIf: { field: "info", equals: "QR code" } }),
      select("finish", "Finition envisagée", ["Mat", "Brillant", "Soft-touch", "Papier texturé"]),
    ],
    features: [],
    states: [],
    printRules: ["Format final 85 × 55 mm (ajuster selon le format choisi), fond perdu 3 mm, zone de sécurité 4 mm", "Résolution 300 dpi, couleurs adaptées à l'impression CMJN", "Texte ≥ 7 pt"],
    lexique: {},
  },
  "flyer-affiche": {
    type: "flyer-affiche",
    label: "Flyer / affiche",
    description: "Un visuel lisible à distance pour un événement ou une offre.",
    family: "print",
    unit: "face",
    multiPage: true,
    formats: [{ k: "a6", label: "A6 (105 × 148 mm)" }, { k: "a5", label: "A5 (148 × 210 mm)" }, { k: "a4", label: "A4 (210 × 297 mm)" }, { k: "a3", label: "A3 (297 × 420 mm)" }],
    defaultFormats: ["a5"],
    pages: [
      { name: "Recto", goal: "Attirer l'œil et transmettre le message en 3 secondes", priority: "mvp", sections: ["flyer-visual", "flyer-headline", "flyer-details", "flyer-cta", "flyer-legal"] },
      { name: "Verso", goal: "Détailler le programme ou l'offre", priority: "later", sections: ["flyer-details", "flyer-legal"] },
    ],
    contextFields: [
      text("event", "Événement ou offre", { required: true }),
      text("dateplace", "Date et lieu"),
      text("message", "Message principal en une phrase", { required: true }),
      text("cta", "Action attendue", { placeholder: "Réserver, venir, scanner…" }),
      area("legal", "Mentions obligatoires"),
    ],
    features: [],
    states: [],
    printRules: ["Fond perdu 3 mm, marge de sécurité 5 mm", "Résolution 300 dpi, couleurs adaptées à l'impression CMJN", "Message principal lisible à 2 mètres"],
    lexique: {},
  },
};

export const SUPPORT_LABELS = Object.fromEntries(Object.values(SUPPORTS).map((s) => [s.type, s.label])) as Record<SupportType, string>;

/** Mots du support : « une page », « un écran », « une face » */
export function unitWords(s: Support): { sing: string; plur: string; un: string; le: string } {
  return s.unit === "écran"
    ? { sing: "écran", plur: "écrans", un: "un écran", le: "l’écran" }
    : { sing: s.unit, plur: s.unit + "s", un: `une ${s.unit}`, le: `la ${s.unit}` };
}

export const ALL_FEATURES = [
  "Formulaire de contact",
  "Téléchargement du CV",
  "Multilingue",
  "Mode sombre",
  "Blog / articles",
  "Recherche",
  "Filtres",
  "Authentification",
  "Espace membre",
  "Paiement en ligne",
  "Panier",
  "Prise de rendez-vous",
  "Newsletter",
  "Animations avancées",
  "Analytics",
  "Notifications",
] as const;

/** Questions guidées par bloc des étapes Structure et Contexte */
export const GUIDED_QUESTIONS = {
  identity: ["En une phrase : que fait ce projet, pour qui ?", "Dans quel secteur ou univers s'inscrit-il ?", "Qu'est-ce qui le distingue d'un support similaire ?"],
  audience: ["Qui regarde ce support, et combien de temps y consacre-t-il ?", "Quel besoin ou quelle peur a chaque lecteur en arrivant ?", "Quelle est l'action unique à lui faire faire ?"],
  structure: ["Quelles sections sont indispensables ?", "Dans quel ordre le lecteur les découvre-t-il ?", "Quelle mise en page (variante) sert le mieux chaque section ?"],
  features: ["Quelles fonctionnalités le visiteur attend-il ?", "Lesquelles peuvent attendre une V2 ?", "As-tu déjà les vrais contenus (textes, images, projets) ?"],
  constraints: ["Quelles langues et quel niveau d'accessibilité vises-tu ?", "Quelle échéance, quelle techno cible ?"],
  identity2: ["As-tu déjà un logo, des couleurs, des polices imposées ?", "Quels supports aimes-tu, et qu'en retiens-tu exactement (la typo ? le rythme ?) ?"],
} as const;

export function newId(): string {
  return Math.random().toString(36).slice(2, 10);
}
