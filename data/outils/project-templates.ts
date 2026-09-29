import type { SiteType } from "@/lib/validations/design-project";

export interface TemplatePage {
  name: string;
  goal: string;
  priority: "mvp" | "later";
  sections: string[];
}

export interface ProjectTemplate {
  type: SiteType;
  label: string;
  description: string;
  /** Vocabulaire : "page" pour un site, "écran" pour une app */
  unit: "page" | "écran";
  pages: TemplatePage[];
  features: string[];
  /** États à proposer dans l'outil Maquette (dashboards, apps) */
  states: string[];
}

export const SECTION_LIBRARY = [
  "Hero",
  "Barre de navigation",
  "Présentation / à propos",
  "Liste de projets",
  "Étude de cas détaillée",
  "Stack / compétences",
  "Services / offres",
  "Méthode de travail",
  "Témoignages",
  "Logos clients",
  "Tarifs",
  "FAQ",
  "Appel à l'action",
  "Formulaire de contact",
  "Newsletter",
  "Fonctionnalités",
  "Chiffres clés",
  "Grille de produits",
  "Fiche produit",
  "Panier récapitulatif",
  "Liste d'articles",
  "Article (lecture)",
  "Tableau de données",
  "Filtres / recherche",
  "Graphiques / KPIs",
  "Pied de page",
] as const;

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

export const SITE_TYPE_LABELS: Record<SiteType, string> = {
  "portfolio-dev": "Portfolio développeur",
  "portfolio-ux": "Portfolio UX / design",
  freelance: "Site freelance / vitrine",
  landing: "Landing page produit",
  ecommerce: "E-commerce",
  blog: "Blog éditorial",
  dashboard: "Dashboard / application web",
  mobile: "Application mobile",
};

const std = { hero: "Hero", contact: "Formulaire de contact", cta: "Appel à l'action", foot: "Pied de page", nav: "Barre de navigation" };

export const TEMPLATES: Record<SiteType, ProjectTemplate> = {
  "portfolio-dev": {
    type: "portfolio-dev",
    label: SITE_TYPE_LABELS["portfolio-dev"],
    description: "Présenter ses projets et sa stack pour convaincre recruteurs et clients.",
    unit: "page",
    pages: [
      { name: "Accueil", goal: "Faire comprendre qui je suis en 30 secondes et donner envie de voir la suite", priority: "mvp", sections: [std.nav, std.hero, "Liste de projets", "Stack / compétences", "Présentation / à propos", std.cta, std.foot] },
      { name: "Projets", goal: "Parcourir et filtrer tous les projets", priority: "mvp", sections: [std.nav, "Filtres / recherche", "Liste de projets", std.foot] },
      { name: "Détail d'un projet", goal: "Raconter un projet : contexte, rôle, stack, résultat", priority: "later", sections: [std.nav, "Étude de cas détaillée", "Stack / compétences", std.cta, std.foot] },
      { name: "Contact", goal: "Rendre la prise de contact immédiate", priority: "mvp", sections: [std.nav, std.contact, std.foot] },
    ],
    features: ["Formulaire de contact", "Téléchargement du CV", "Multilingue", "Mode sombre", "Animations avancées"],
    states: [],
  },
  "portfolio-ux": {
    type: "portfolio-ux",
    label: SITE_TYPE_LABELS["portfolio-ux"],
    description: "Mettre en avant 3 à 4 études de cas détaillées.",
    unit: "page",
    pages: [
      { name: "Accueil", goal: "Accrocher avec une phrase forte et les études de cas phares", priority: "mvp", sections: [std.nav, std.hero, "Liste de projets", "Témoignages", std.cta, std.foot] },
      { name: "Étude de cas", goal: "Montrer le process : contexte, problème, démarche, résultat chiffré", priority: "mvp", sections: [std.nav, "Étude de cas détaillée", "Chiffres clés", std.cta, std.foot] },
      { name: "À propos", goal: "Humaniser et expliquer la façon de travailler", priority: "mvp", sections: [std.nav, "Présentation / à propos", "Méthode de travail", std.foot] },
      { name: "Contact", goal: "Faciliter la prise de contact", priority: "mvp", sections: [std.nav, std.contact, std.foot] },
    ],
    features: ["Formulaire de contact", "Téléchargement du CV", "Animations avancées", "Mode sombre"],
    states: [],
  },
  freelance: {
    type: "freelance",
    label: SITE_TYPE_LABELS.freelance,
    description: "Convertir des visiteurs en clients : offres, méthode, preuves, rendez-vous.",
    unit: "page",
    pages: [
      { name: "Accueil", goal: "Poser la proposition de valeur et pousser vers la prise de contact", priority: "mvp", sections: [std.nav, std.hero, "Services / offres", "Méthode de travail", "Témoignages", std.cta, std.foot] },
      { name: "Services", goal: "Détailler chaque offre, son périmètre et son prix indicatif", priority: "mvp", sections: [std.nav, "Services / offres", "Tarifs", "FAQ", std.foot] },
      { name: "Réalisations", goal: "Prouver par des exemples concrets", priority: "later", sections: [std.nav, "Liste de projets", "Logos clients", std.foot] },
      { name: "Contact / devis", goal: "Recueillir un brief exploitable", priority: "mvp", sections: [std.nav, std.contact, "Prise de rendez-vous", std.foot] },
    ],
    features: ["Formulaire de contact", "Prise de rendez-vous", "Multilingue", "Analytics", "Newsletter"],
    states: [],
  },
  landing: {
    type: "landing",
    label: SITE_TYPE_LABELS.landing,
    description: "Une page qui présente un produit et convertit.",
    unit: "page",
    pages: [
      { name: "Landing", goal: "Expliquer la valeur, rassurer, faire agir", priority: "mvp", sections: [std.nav, std.hero, "Logos clients", "Fonctionnalités", "Chiffres clés", "Témoignages", "Tarifs", "FAQ", std.cta, std.foot] },
      { name: "Tarifs", goal: "Comparer les offres", priority: "later", sections: [std.nav, "Tarifs", "FAQ", std.foot] },
      { name: "Inscription", goal: "Créer un compte ou rejoindre la liste d'attente", priority: "later", sections: [std.contact, std.foot] },
    ],
    features: ["Newsletter", "Analytics", "Animations avancées", "Multilingue"],
    states: [],
  },
  ecommerce: {
    type: "ecommerce",
    label: SITE_TYPE_LABELS.ecommerce,
    description: "Vendre en ligne : catalogue, fiche produit, panier, paiement.",
    unit: "page",
    pages: [
      { name: "Accueil", goal: "Mettre en avant les produits phares et rassurer", priority: "mvp", sections: [std.nav, std.hero, "Grille de produits", "Témoignages", "Newsletter", std.foot] },
      { name: "Catalogue", goal: "Trouver rapidement un produit", priority: "mvp", sections: [std.nav, "Filtres / recherche", "Grille de produits", std.foot] },
      { name: "Fiche produit", goal: "Donner toutes les infos et faire ajouter au panier", priority: "mvp", sections: [std.nav, "Fiche produit", "Témoignages", "Grille de produits", std.foot] },
      { name: "Panier", goal: "Vérifier sa commande", priority: "mvp", sections: [std.nav, "Panier récapitulatif", std.foot] },
      { name: "Paiement", goal: "Payer sans friction", priority: "mvp", sections: ["Panier récapitulatif", std.contact] },
      { name: "Compte client", goal: "Suivre ses commandes", priority: "later", sections: [std.nav, "Tableau de données", std.foot] },
    ],
    features: ["Recherche", "Filtres", "Panier", "Paiement en ligne", "Espace membre", "Authentification", "Newsletter"],
    states: ["Panier vide", "Chargement", "Erreur de paiement", "Commande confirmée"],
  },
  blog: {
    type: "blog",
    label: SITE_TYPE_LABELS.blog,
    description: "Un blog où le confort de lecture passe avant tout.",
    unit: "page",
    pages: [
      { name: "Accueil", goal: "Présenter les derniers articles et l'esprit du blog", priority: "mvp", sections: [std.nav, std.hero, "Liste d'articles", "Newsletter", std.foot] },
      { name: "Article", goal: "Lire confortablement", priority: "mvp", sections: [std.nav, "Article (lecture)", "Liste d'articles", "Newsletter", std.foot] },
      { name: "Catégorie / archive", goal: "Explorer par thème", priority: "later", sections: [std.nav, "Filtres / recherche", "Liste d'articles", std.foot] },
      { name: "À propos", goal: "Savoir qui écrit", priority: "later", sections: [std.nav, "Présentation / à propos", std.foot] },
    ],
    features: ["Blog / articles", "Recherche", "Newsletter", "Mode sombre", "Multilingue"],
    states: [],
  },
  dashboard: {
    type: "dashboard",
    label: SITE_TYPE_LABELS.dashboard,
    description: "Application web : navigation latérale, KPIs, tableaux, filtres, états vides.",
    unit: "écran",
    pages: [
      { name: "Connexion", goal: "Se connecter simplement", priority: "mvp", sections: ["Formulaire de contact"] },
      { name: "Tableau de bord", goal: "Voir l'essentiel en un coup d'œil", priority: "mvp", sections: [std.nav, "Graphiques / KPIs", "Tableau de données"] },
      { name: "Liste", goal: "Parcourir, filtrer, trier les éléments", priority: "mvp", sections: [std.nav, "Filtres / recherche", "Tableau de données"] },
      { name: "Détail", goal: "Consulter et modifier un élément", priority: "mvp", sections: [std.nav, "Fiche produit", "Tableau de données"] },
      { name: "Paramètres", goal: "Configurer son compte", priority: "later", sections: [std.nav, "Formulaire de contact"] },
    ],
    features: ["Authentification", "Recherche", "Filtres", "Notifications", "Mode sombre", "Espace membre"],
    states: ["État vide", "Chargement", "Erreur", "Succès"],
  },
  mobile: {
    type: "mobile",
    label: SITE_TYPE_LABELS.mobile,
    description: "Application mobile : parcours d'accueil, écrans clés, états.",
    unit: "écran",
    pages: [
      { name: "Onboarding", goal: "Expliquer la valeur en 3 écrans", priority: "mvp", sections: [std.hero, std.cta] },
      { name: "Accueil", goal: "Accéder à l'action principale", priority: "mvp", sections: ["Liste d'articles", std.nav] },
      { name: "Détail", goal: "Consulter un élément", priority: "mvp", sections: ["Fiche produit", std.cta] },
      { name: "Profil", goal: "Gérer son compte", priority: "later", sections: ["Présentation / à propos", "Formulaire de contact"] },
    ],
    features: ["Authentification", "Notifications", "Mode sombre", "Recherche"],
    states: ["État vide", "Chargement", "Erreur réseau", "Succès"],
  },
};

/** Questions guidées par bloc de l'outil Projet */
export const GUIDED_QUESTIONS = {
  identity: ["En une phrase : que fait ce projet, pour qui ?", "Dans quel secteur ou univers s'inscrit-il ?", "Qu'est-ce qui le distingue d'un site similaire ?"],
  audience: ["Qui visite le site, et combien de temps y reste-t-il ?", "Quel besoin ou quelle peur a chaque visiteur en arrivant ?", "Quelle est l'action unique à leur faire faire ?"],
  pages: ["Quelles pages sont indispensables au lancement (MVP) ?", "Que doit contenir chaque page pour atteindre son objectif ?", "Dans quel ordre le visiteur découvre-t-il les pages ?"],
  features: ["Quelles fonctionnalités le visiteur attend-il ?", "Lesquelles peuvent attendre une V2 ?", "As-tu déjà les vrais contenus (textes, images, projets) ?"],
  constraints: ["Sur quel appareil sera-t-il le plus utilisé ?", "Quelles langues et quel niveau d'accessibilité vises-tu ?", "Quelle échéance, quelle techno cible ?"],
  identity2: ["As-tu déjà un logo, des couleurs, des polices imposées ?", "Quels sites aimes-tu, et qu'en retiens-tu exactement (la typo ? le rythme ?) ?"],
} as const;

export function newId(): string {
  return Math.random().toString(36).slice(2, 10);
}
