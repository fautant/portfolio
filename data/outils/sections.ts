import type { FieldDef } from "./form-fields";

export type Family = "web" | "print";

export interface SectionVariant {
  k: string;
  label: string;
  desc: string;
}

export interface SectionDef {
  key: string;
  label: string;
  families: Family[];
  /** Rôle de la section, repris dans le prompt */
  description: string;
  variants: SectionVariant[];
  fields: FieldDef[];
  /** Critères de qualité injectés dans le prompt de la section */
  checklist: string[];
}

const v = (k: string, label: string, desc: string): SectionVariant => ({ k, label, desc });
const text = (id: string, label: string, placeholder?: string): FieldDef => ({ id, label, type: "text", placeholder });
const area = (id: string, label: string, placeholder?: string): FieldDef => ({ id, label, type: "textarea", placeholder });
const list = (id: string, label: string, placeholder?: string): FieldDef => ({ id, label, type: "list", placeholder, help: "Une entrée par ligne." });
const toggle = (id: string, label: string): FieldDef => ({ id, label, type: "toggle" });

const WEB: Family[] = ["web"];
const PRINT: Family[] = ["print"];
const BOTH: Family[] = ["web", "print"];

const DEFS: SectionDef[] = [
  /* ---------- Web ---------- */
  { key: "nav", label: "Barre de navigation", families: WEB, description: "Permettre d'aller partout en un clic, sur ordinateur comme sur mobile.", variants: [v("bar", "Barre classique", "Logo à gauche, liens à droite"), v("centered", "Centrée", "Logo au centre, liens répartis de chaque côté"), v("floating", "Flottante", "Capsule arrondie détachée du haut de page")], fields: [list("links", "Liens du menu", "Accueil\nProjets\nContact"), text("cta", "Bouton d'action dans la barre", "Me contacter")], checklist: ["Menu mobile clairement conçu (burger ou tiroir)", "Lien actif visible", "Zones de clic ≥ 44 px"] },
  { key: "hero", label: "Hero", families: WEB, description: "Faire comprendre en 5 secondes qui, quoi, pour qui, et proposer l'action principale.", variants: [v("split", "Texte + visuel", "Titre à gauche, image ou illustration à droite"), v("centered", "Centré", "Titre centré, sous-titre, deux boutons"), v("fullscreen", "Plein écran", "Image ou fond immersif, texte superposé"), v("type", "Typographique", "Très grand titre, aucun visuel")], fields: [text("headline", "Titre principal"), text("sub", "Sous-titre"), text("primaryCta", "Bouton principal"), text("secondaryCta", "Bouton secondaire")], checklist: ["Un seul message dominant", "Un bouton principal évident", "Titre lisible sur mobile sans dépasser 3 lignes"] },
  { key: "about", label: "Présentation / à propos", families: WEB, description: "Humaniser et donner confiance en présentant la personne ou l'équipe.", variants: [v("photo", "Photo + texte", "Portrait à côté d'un court récit"), v("timeline", "Parcours", "Frise chronologique du parcours"), v("values", "Valeurs", "Trois ou quatre valeurs avec icônes")], fields: [area("story", "Ce qu'il faut raconter"), toggle("photo", "Une photo est disponible")], checklist: ["Texte court et scannable", "Ton cohérent avec l'émotion recherchée"] },
  { key: "projects", label: "Liste de projets", families: WEB, description: "Montrer les réalisations les plus convaincantes.", variants: [v("grid", "Grille de cartes", "Cartes avec image, titre, stack"), v("list", "Liste éditoriale", "Lignes larges, numérotées, image au survol"), v("featured", "Un projet phare", "Un grand projet mis en avant puis une grille")], fields: [text("count", "Nombre de projets à montrer", "6"), list("names", "Projets à inclure")], checklist: ["Chaque carte a un titre, une accroche et la stack", "Etat de survol défini"] },
  { key: "case-study", label: "Étude de cas détaillée", families: WEB, description: "Raconter un projet : contexte, rôle, démarche, résultat.", variants: [v("narrative", "Récit vertical", "Sections successives avec grandes images"), v("sidebar", "Fiche latérale", "Colonne d'infos clés fixe à côté du récit")], fields: [text("project", "Projet concerné"), area("result", "Résultat ou chiffre à mettre en avant")], checklist: ["Rôle et périmètre explicites", "Au moins un résultat chiffré ou concret"] },
  { key: "stack", label: "Stack / compétences", families: WEB, description: "Lister les technologies et compétences, avec un niveau lisible.", variants: [v("tags", "Badges", "Badges groupés par catégorie"), v("levels", "Niveaux", "Barres ou étoiles de maîtrise"), v("cards", "Cartes par domaine", "Une carte par domaine (backend, frontend, outils)")], fields: [list("skills", "Compétences (avec niveau si utile)", "Symfony (expert)\nLaravel (expert)")], checklist: ["Regroupement par catégorie", "Les compétences phares sont mises en avant"] },
  { key: "services", label: "Services / offres", families: WEB, description: "Détailler ce qui est proposé et ce que le client obtient.", variants: [v("cards", "Cartes", "Une carte par offre avec icône"), v("rows", "Lignes détaillées", "Offre, périmètre et livrables en lignes"), v("tiers", "Formules", "Offres comparées côte à côte")], fields: [list("offers", "Offres", "Site vitrine\nApplication sur mesure")], checklist: ["Bénéfice client avant description technique", "Chaque offre mène à une action"] },
  { key: "method", label: "Méthode de travail", families: WEB, description: "Rassurer en montrant les étapes de la collaboration.", variants: [v("steps", "Étapes numérotées", "3 à 5 étapes horizontales"), v("timeline", "Frise verticale", "Étapes reliées sur une ligne")], fields: [list("steps", "Étapes", "Cadrage\nMaquette\nDéveloppement\nLivraison")], checklist: ["Étapes courtes avec durée ou livrable"] },
  { key: "testimonials", label: "Témoignages", families: WEB, description: "Apporter une preuve sociale crédible.", variants: [v("cards", "Cartes", "Grille de citations avec nom et rôle"), v("quote", "Citation unique", "Une grande citation qui défile"), v("wall", "Mur", "Mosaïque de courts avis")], fields: [text("count", "Nombre de témoignages", "3"), toggle("real", "Ce sont de vrais témoignages")], checklist: ["Nom, rôle et photo sur chaque avis", "Pas de faux avis présentés comme réels"] },
  { key: "logos", label: "Logos clients", families: WEB, description: "Montrer avec qui le travail a été fait.", variants: [v("strip", "Bandeau", "Logos en une ligne, niveaux de gris"), v("grid", "Grille", "Logos en grille aérée")], fields: [list("names", "Clients ou partenaires")], checklist: ["Logos harmonisés en taille et en couleur"] },
  { key: "pricing", label: "Tarifs", families: WEB, description: "Présenter les prix et aider à choisir.", variants: [v("tiers", "Trois formules", "Cartes, une mise en avant"), v("table", "Tableau comparatif", "Lignes de fonctionnalités par formule"), v("single", "Prix unique", "Une offre, un prix, une liste d'inclus")], fields: [text("count", "Nombre de formules", "3"), text("highlight", "Formule à mettre en avant"), toggle("toggleBilling", "Bascule mensuel / annuel")], checklist: ["Formule recommandée évidente", "Ce qui est inclus est listé", "Bouton d'action sur chaque formule"] },
  { key: "faq", label: "FAQ", families: WEB, description: "Lever les objections et réduire les questions.", variants: [v("accordion", "Accordéon", "Questions repliables"), v("two-col", "Deux colonnes", "Titre à gauche, questions à droite")], fields: [list("questions", "Questions à traiter")], checklist: ["Questions les plus bloquantes en premier"] },
  { key: "cta", label: "Appel à l'action", families: WEB, description: "Faire agir en fin de parcours.", variants: [v("band", "Bandeau", "Bloc coloré pleine largeur avec un bouton"), v("card", "Carte", "Carte centrée avec texte et bouton"), v("split", "Texte + formulaire", "Argument à gauche, champ email à droite")], fields: [text("headline", "Phrase d'accroche"), text("button", "Texte du bouton")], checklist: ["Une seule action proposée"] },
  { key: "contact", label: "Formulaire de contact", families: WEB, description: "Rendre la prise de contact immédiate.", variants: [v("form", "Formulaire seul", "Champs sur une colonne"), v("split", "Infos + formulaire", "Coordonnées à gauche, formulaire à droite")], fields: [list("fields", "Champs du formulaire", "Nom\nEmail\nType de demande\nMessage"), list("info", "Coordonnées affichées")], checklist: ["États de champ (focus, erreur, succès) définis", "Message de confirmation prévu"] },
  { key: "booking", label: "Prise de rendez-vous", families: WEB, description: "Permettre de réserver un créneau.", variants: [v("embed", "Agenda intégré", "Calendrier et créneaux"), v("cta", "Bouton vers agenda", "Bloc incitatif avec lien externe")], fields: [text("tool", "Outil de réservation", "Cal.com, Calendly…"), text("duration", "Durée d'un rendez-vous")], checklist: ["Fuseau horaire précisé"] },
  { key: "newsletter", label: "Newsletter", families: WEB, description: "Collecter des emails.", variants: [v("inline", "En ligne", "Champ et bouton sur une ligne"), v("card", "Carte", "Bloc avec promesse et bénéfice")], fields: [text("promise", "Ce que l'abonné reçoit")], checklist: ["Promesse de fréquence", "Mention de désinscription"] },
  { key: "features", label: "Fonctionnalités", families: WEB, description: "Expliquer ce que fait le produit.", variants: [v("grid", "Grille d'icônes", "Trois à six fonctionnalités"), v("alternate", "Alterné", "Texte et capture en alternance"), v("tabs", "Onglets", "Une fonctionnalité par onglet")], fields: [list("items", "Fonctionnalités", "Nom : bénéfice")], checklist: ["Bénéfice avant fonctionnalité"] },
  { key: "stats", label: "Chiffres clés", families: WEB, description: "Prouver par des nombres.", variants: [v("row", "Ligne de chiffres", "Trois ou quatre grands nombres"), v("cards", "Cartes", "Chiffre, légende et icône")], fields: [list("figures", "Chiffres", "120 projets\n98 % de satisfaction")], checklist: ["Chiffres vérifiables uniquement"] },
  { key: "products", label: "Grille de produits", families: WEB, description: "Parcourir le catalogue.", variants: [v("grid", "Grille régulière", "Vignettes de taille égale"), v("masonry", "Mosaïque", "Vignettes de hauteur variable"), v("carousel", "Carrousel", "Défilement horizontal")], fields: [text("perRow", "Produits par ligne", "4")], checklist: ["Prix, nom et image toujours visibles", "Etat de survol et ajout rapide"] },
  { key: "product-detail", label: "Fiche produit", families: WEB, description: "Donner toutes les infos et faire ajouter au panier.", variants: [v("gallery", "Galerie + achat", "Images à gauche, achat à droite"), v("stacked", "Vertical", "Image, infos et achat en pile")], fields: [list("attributes", "Attributs (taille, couleur…)")], checklist: ["Bouton d'achat toujours visible", "Livraison et retours rappelés"] },
  { key: "cart", label: "Panier récapitulatif", families: WEB, description: "Vérifier la commande avant paiement.", variants: [v("page", "Page dédiée", "Liste et récapitulatif côte à côte"), v("drawer", "Tiroir latéral", "Panneau qui glisse")], fields: [], checklist: ["Total, frais et taxes clairs", "Panier vide prévu"] },
  { key: "articles", label: "Liste d'articles", families: WEB, description: "Parcourir les publications.", variants: [v("cards", "Cartes", "Image, titre, extrait"), v("list", "Liste éditoriale", "Titre, date, extrait, sans image"), v("featured", "Une à la une", "Article principal puis grille")], fields: [text("perPage", "Articles affichés", "9")], checklist: ["Date, temps de lecture et catégorie visibles"] },
  { key: "article-read", label: "Article (lecture)", families: WEB, description: "Lire confortablement.", variants: [v("narrow", "Colonne étroite", "Largeur de lecture ~65 caractères"), v("toc", "Avec sommaire", "Sommaire latéral collant")], fields: [], checklist: ["Interligne et taille de texte confortables", "Styles de titres, citations, code et images définis"] },
  { key: "table", label: "Tableau de données", families: WEB, description: "Afficher et trier des enregistrements.", variants: [v("dense", "Dense", "Lignes compactes"), v("comfortable", "Aéré", "Lignes hautes avec actions au survol")], fields: [list("columns", "Colonnes")], checklist: ["Tri, pagination et état vide définis"] },
  { key: "filters", label: "Filtres / recherche", families: WEB, description: "Trouver rapidement.", variants: [v("bar", "Barre horizontale", "Recherche + filtres en ligne"), v("side", "Panneau latéral", "Filtres dans une colonne")], fields: [list("filters", "Filtres proposés")], checklist: ["Filtres actifs visibles et réinitialisables"] },
  { key: "kpis", label: "Graphiques / KPIs", families: WEB, description: "Voir l'essentiel en un coup d'œil.", variants: [v("tiles", "Tuiles + graphique", "Indicateurs en haut, un graphique principal"), v("grid", "Grille de graphiques", "Plusieurs graphiques de même poids")], fields: [list("metrics", "Indicateurs à afficher")], checklist: ["Couleurs de graphique accessibles", "États chargement et vide"] },
  { key: "footer", label: "Pied de page", families: WEB, description: "Terminer proprement : liens, contact, mentions.", variants: [v("simple", "Simple", "Une ligne : logo, liens, copyright"), v("columns", "Colonnes", "Plusieurs colonnes de liens")], fields: [list("links", "Liens et mentions")], checklist: ["Liens légaux présents"] },

  /* ---------- CV ---------- */
  { key: "cv-header", label: "En-tête du CV", families: PRINT, description: "Nom, titre visé et coordonnées, lisibles en un regard.", variants: [v("left", "Aligné à gauche", "Nom en grand, titre dessous, coordonnées en ligne"), v("photo", "Avec photo", "Photo ronde à côté du nom"), v("band", "Bandeau coloré", "Bloc pleine largeur en haut de page")], fields: [text("name", "Nom complet"), text("title", "Titre / poste visé"), list("contacts", "Coordonnées", "Email\nTéléphone\nVille\nLinkedIn\nGitHub")], checklist: ["Nom = élément le plus grand de la page", "Coordonnées sur le texte, jamais uniquement en icônes"] },
  { key: "cv-profile", label: "Profil / accroche", families: PRINT, description: "Résumer en deux ou trois lignes la valeur du candidat.", variants: [v("paragraph", "Paragraphe", "Trois lignes de texte"), v("keywords", "Mots-clés", "Une phrase + 4 mots-clés")], fields: [area("text", "Texte du profil")], checklist: ["3 lignes maximum", "Reprend les mots de l'offre visée"] },
  { key: "cv-experience", label: "Expériences", families: PRINT, description: "Détailler les expériences avec résultats.", variants: [v("timeline", "Frise", "Dates à gauche, missions à droite"), v("compact", "Liste compacte", "Poste, entreprise, dates sur une ligne"), v("cards", "Blocs", "Un bloc encadré par expérience")], fields: [list("jobs", "Expériences (poste — entreprise — dates — missions)")], checklist: ["Ordre antichronologique", "Verbes d'action et résultats chiffrés", "3 puces maximum par expérience"] },
  { key: "cv-education", label: "Formation", families: PRINT, description: "Diplômes et parcours scolaire.", variants: [v("list", "Liste simple", "Diplôme, école, année"), v("timeline", "Frise", "Années à gauche")], fields: [list("items", "Formations (diplôme — établissement — année)")], checklist: ["Diplôme le plus récent en premier"] },
  { key: "cv-skills", label: "Compétences", families: PRINT, description: "Compétences techniques et transversales.", variants: [v("tags", "Badges", "Compétences en pastilles par catégorie"), v("levels", "Niveaux", "Barres ou points de niveau"), v("lists", "Listes", "Colonnes de texte par catégorie")], fields: [list("skills", "Compétences par catégorie", "Backend : PHP, Symfony, Laravel\nFrontend : React, Next.js")], checklist: ["Catégories claires", "Rester lisible en noir et blanc"] },
  { key: "cv-languages", label: "Langues", families: PRINT, description: "Langues parlées et niveau.", variants: [v("text", "Texte", "Langue — niveau"), v("dots", "Points", "Niveau représenté par 5 points")], fields: [list("items", "Langues", "Français (natif)\nAnglais (B2)")], checklist: ["Niveau exprimé (CECRL)"] },
  { key: "cv-projects", label: "Projets", families: PRINT, description: "Projets personnels ou académiques.", variants: [v("list", "Liste", "Nom, stack, une ligne d'impact"), v("cards", "Blocs", "Petit bloc par projet")], fields: [list("items", "Projets (nom — stack — impact)")], checklist: ["Liens raccourcis lisibles à l'impression"] },
  { key: "cv-interests", label: "Centres d'intérêt", families: PRINT, description: "Personnaliser en une ligne.", variants: [v("icons", "Icônes + texte", "Petites icônes"), v("text", "Texte", "Une ligne séparée par des points")], fields: [list("items", "Centres d'intérêt")], checklist: ["Une ligne maximum"] },

  /* ---------- Lettre ---------- */
  { key: "letter-sender", label: "Expéditeur et destinataire", families: PRINT, description: "Blocs d'adresses et date, conformes aux usages.", variants: [v("classic", "Classique", "Expéditeur en haut à gauche, destinataire à droite"), v("modern", "Moderne", "En-tête coloré reprenant le CV")], fields: [text("sender", "Expéditeur (nom, adresse, contact)"), text("recipient", "Destinataire (nom, entreprise, adresse)"), text("place", "Lieu et date")], checklist: ["Alignements précis et marges régulières"] },
  { key: "letter-subject", label: "Objet", families: PRINT, description: "Annoncer clairement la candidature.", variants: [v("bold", "Gras", "Ligne « Objet : » en gras"), v("boxed", "Encadré", "Filet fin au-dessus et en dessous")], fields: [text("subject", "Objet")], checklist: ["Une ligne, référence du poste incluse"] },
  { key: "letter-body", label: "Corps de la lettre", families: PRINT, description: "Trois paragraphes : accroche, preuves, motivation.", variants: [v("plain", "Sobre", "Texte justifié à gauche, paragraphes espacés"), v("accent", "Accentué", "Un filet coloré et une première phrase en exergue")], fields: [area("points", "Arguments à développer")], checklist: ["Corps de texte 10,5–11 pt, interligne ~1,15", "Tient sur une page"] },
  { key: "letter-closing", label: "Formule de politesse et signature", families: PRINT, description: "Conclure et signer.", variants: [v("simple", "Simple", "Formule puis nom"), v("signature", "Avec signature", "Espace réservé à la signature manuscrite")], fields: [text("closing", "Formule de politesse")], checklist: ["Espace suffisant pour signer"] },

  /* ---------- Carte de visite ---------- */
  { key: "card-logo", label: "Logo / visuel de face", families: PRINT, description: "Face d'identité de la carte.", variants: [v("logo", "Logo centré", "Logo sur fond uni"), v("pattern", "Motif", "Motif graphique et petit logo"), v("photo", "Photo", "Visuel plein cadre")], fields: [toggle("hasLogo", "Un logo existe")], checklist: ["Éléments critiques dans la zone de sécurité", "Fond perdu 3 mm prévu"] },
  { key: "card-identity", label: "Identité et coordonnées", families: PRINT, description: "Nom, fonction et moyens de contact.", variants: [v("stacked", "Empilé", "Nom, fonction puis coordonnées"), v("columns", "Deux colonnes", "Identité à gauche, contacts à droite")], fields: [text("name", "Nom"), text("role", "Fonction"), list("contacts", "Coordonnées")], checklist: ["Texte ≥ 7 pt", "Contraste fort avec le fond"] },
  { key: "card-back", label: "Verso", families: PRINT, description: "Face secondaire : QR code, slogan ou motif.", variants: [v("qr", "QR code", "QR code central et court texte"), v("tagline", "Slogan", "Slogan sur fond de marque"), v("empty", "Épuré", "Fond uni")], fields: [text("tagline", "Slogan"), text("qr", "URL du QR code")], checklist: ["QR code assez grand (≥ 15 mm) et contrasté"] },

  /* ---------- Flyer / affiche ---------- */
  { key: "flyer-visual", label: "Visuel principal", families: PRINT, description: "Attirer l'œil à distance.", variants: [v("photo", "Photo plein cadre", "Image plein format avec voile"), v("illustration", "Illustration", "Illustration ou formes graphiques"), v("type", "Typographique", "Lettrage géant, pas d'image")], fields: [area("idea", "Idée du visuel")], checklist: ["Lisible à 2 mètres", "Un seul point focal"] },
  { key: "flyer-headline", label: "Titre de l'événement", families: PRINT, description: "Le message principal.", variants: [v("big", "Très grand", "Titre sur deux lignes"), v("stacked", "Titre + accroche", "Titre et phrase d'accroche")], fields: [text("title", "Titre"), text("tagline", "Accroche")], checklist: ["Titre = plus grand élément textuel"] },
  { key: "flyer-details", label: "Infos pratiques", families: PRINT, description: "Date, lieu, horaires, prix.", variants: [v("icons", "Icônes", "Une ligne par info avec icône"), v("block", "Bloc encadré", "Tout dans un cadre")], fields: [text("date", "Date et horaires"), text("place", "Lieu"), text("price", "Prix / entrée")], checklist: ["Date et lieu lisibles au premier coup d'œil"] },
  { key: "flyer-cta", label: "Appel à l'action", families: PRINT, description: "Dire quoi faire ensuite.", variants: [v("qr", "QR code", "QR code + court texte"), v("text", "Texte", "Site ou numéro en grand")], fields: [text("action", "Action demandée"), text("url", "Lien / numéro")], checklist: ["QR code ≥ 20 mm et contrasté"] },
  { key: "flyer-legal", label: "Mentions", families: PRINT, description: "Mentions légales, organisateur, partenaires.", variants: [v("footer", "Pied discret", "Ligne en bas en petit"), v("logos", "Bandeau de logos", "Logos des partenaires")], fields: [area("text", "Mentions à inclure")], checklist: ["Taille ≥ 6 pt mais discret"] },

  /* ---------- Libre ---------- */
  { key: "custom", label: "Section libre", families: BOTH, description: "Section définie par l'utilisateur.", variants: [], fields: [], checklist: [] },
];

export const SECTION_CATALOG: Record<string, SectionDef> = Object.fromEntries(DEFS.map((d) => [d.key, d]));

/** Sections proposées dans le sélecteur, selon la famille du support */
export function sectionsFor(family: Family): SectionDef[] {
  return DEFS.filter((d) => d.key !== "custom" && d.families.includes(family));
}

const BY_LABEL = new Map(DEFS.map((d) => [d.label.toLowerCase(), d.key]));

/** Retrouve la clé du catalogue d'après un ancien libellé libre (migration des projets existants) */
export function keyFromLabel(label: string): string {
  return BY_LABEL.get(label.trim().toLowerCase()) ?? "custom";
}

export function getSectionDef(key: string): SectionDef {
  return SECTION_CATALOG[key] ?? SECTION_CATALOG.custom!;
}

export function defaultVariant(def: SectionDef): string {
  return def.variants[0]?.k ?? "";
}
