/* eslint-disable */
// Lexique v2 : éléments (briques), variantes, pertinence des paramètres locaux et structures types.
// Ajouter une variante = ajouter une ligne dans ELEMENTS (et son ton dans VT).
import { PARAMS } from "./lexique";
import type { Cat, Element, Example, Param, Rel, Tone } from "./lexique-types";

/** Paramètres globaux (dans l'ordre des étapes) et paramètres réglés élément par élément */
export const GLOBAL_IDS = ["type","goal","perso","style","refs","typo","color","shape","sys","a11y","avoid"];
export const LOCAL_IDS = ["layout","space","img","inter"];
export const LOCAL_MAX: Record<string, number> = {layout:2,space:1,img:2,inter:2};

export const ELEMENTS: Element[] = [
{"k":"nav","l":"Navigation","cat":"struct","h":1,"w":8,"d":"Menu, logo, accès rapides","v":[{"k":"sticky","l":"Barre fixe minimale","p":"barre de navigation fixe et minimale en haut, qui se réduit au scroll"},{"k":"side","l":"Sidebar verticale","p":"navigation en sidebar verticale fixe à gauche, avec nom et liens"},{"k":"full","l":"Menu plein écran","p":"bouton menu qui ouvre une navigation plein écran avec grands liens typographiques"},{"k":"pill","l":"Pilule flottante","p":"navigation en pilule flottante centrée, détachée du bord"},{"k":"index","l":"Index numéroté","p":"navigation façon index : liens numérotés (01, 02…) en monospace"}],"c":["Nom / logo","Liens vers les sections","Bouton contact","Sélecteur de langue","Bascule de thème","Lien CV"]},
{"k":"hero","l":"Hero","cat":"hero","h":3,"w":8,"d":"Premier écran, accroche","v":[{"k":"xxl","l":"Nom en typo XXL","p":"hero dominé par le nom en typographie XXL sur toute la largeur"},{"k":"photo","l":"Portrait + accroche","p":"hero avec portrait photo et accroche courte à côté"},{"k":"split","l":"Split texte / visuel","p":"hero en split-screen : texte d'un côté, visuel de l'autre"},{"k":"manifesto","l":"Manifeste en une phrase","p":"hero composé d'une seule phrase-manifeste, sans visuel"},{"k":"interactive","l":"Hero interactif","p":"hero interactif (canvas, 3D ou génératif) qui réagit à la souris"},{"k":"terminal","l":"Invite de commande","p":"hero sous forme d'invite de commande qui tape la présentation"}],"c":["Nom","Titre / métier","Tagline","Photo","CTA principal","CTA secondaire","Disponibilité","Indicateur de scroll"]},
{"k":"projects","l":"Projets","cat":"work","h":3,"w":8,"d":"Liste des projets","v":[{"k":"index","l":"Liste-index + aperçu","p":"projets en liste-index typographique (numéro, titre, année) avec aperçu d'image au survol"},{"k":"asym","l":"Grille asymétrique","p":"projets en grille asymétrique aux tailles volontairement inégales"},{"k":"hscroll","l":"Scroll horizontal","p":"projets en scroll horizontal piloté par le scroll vertical"},{"k":"stack","l":"Cartes empilées","p":"cartes de projets qui s'empilent en sticky au scroll"},{"k":"bento","l":"Bento","p":"projets en tuiles bento de tailles variées"},{"k":"filter","l":"Grille filtrable","p":"grille de projets filtrable par technologie"}],"c":["Visuel","Titre","Année","Stack technique","Rôle","Résumé","Lien démo","Lien GitHub","Filtres"]},
{"k":"case","l":"Étude de cas","cat":"work","h":3,"w":8,"d":"Détail d’un projet","v":[{"k":"longread","l":"Long format éditorial","p":"étude de cas en long format éditorial, une colonne de lecture avec grandes images"},{"k":"chapters","l":"Chapitres + sommaire","p":"étude de cas découpée en chapitres avec sommaire fixe sur le côté"},{"k":"visual","l":"Récit visuel plein écran","p":"étude de cas racontée en séquences visuelles plein écran, peu de texte"},{"k":"sheet","l":"Fiche technique","p":"étude de cas en fiche technique compacte : contexte, stack, rôle, résultats"}],"c":["Contexte","Problème","Process","Captures","Résultats chiffrés","Stack","Rôle","Projet suivant"]},
{"k":"skills","l":"Compétences / stack","cat":"profil","h":2,"w":6,"d":"Technos et savoir-faire","v":[{"k":"badges","l":"Badges par catégorie","p":"compétences en badges regroupés par catégorie (backend, frontend, mobile, devops)"},{"k":"table","l":"Tableau par domaine","p":"compétences dans un tableau sobre par domaine"},{"k":"marquee","l":"Bandeau défilant","p":"technos dans un bandeau défilant en continu"},{"k":"matrix","l":"Matrice niveau × usage","p":"compétences placées sur une matrice niveau de maîtrise × fréquence d'usage"},{"k":"logos","l":"Grille de logos","p":"grille de logos de technologies monochromes"}],"c":["Catégories","Niveau (sans %)","Technos favorites","Outils","Soft skills","Langues"]},
{"k":"about","l":"À propos","cat":"profil","h":2,"w":6,"d":"Qui je suis","v":[{"k":"portrait","l":"Portrait + texte","p":"section à propos avec portrait et texte court"},{"k":"letter","l":"Lettre à la 1re personne","p":"à propos écrit comme une lettre à la première personne"},{"k":"facts","l":"Chiffres & faits","p":"à propos sous forme de faits et chiffres clés"},{"k":"mixed","l":"Texte + centres d’intérêt","p":"texte de présentation suivi des centres d'intérêt illustrés"}],"c":["Photo","Bio courte","Valeurs","Centres d’intérêt","Localisation","Citation"]},
{"k":"exp","l":"Parcours","cat":"profil","h":2,"w":6,"d":"Expériences et formation","v":[{"k":"timeline","l":"Frise verticale","p":"parcours en frise chronologique verticale"},{"k":"cv","l":"Tableau façon CV","p":"parcours en tableau façon CV : dates, poste, lieu"},{"k":"cards","l":"Cartes par étape","p":"parcours en cartes, une par expérience"},{"k":"horizontal","l":"Frise horizontale","p":"parcours en frise horizontale à faire défiler"}],"c":["Expériences pro","Formation","Dates","Lieux","Missions clés","Logos"]},
{"k":"testi","l":"Témoignages","cat":"offre","h":2,"w":6,"d":"Preuve sociale","v":[{"k":"quote","l":"Grande citation unique","p":"une seule grande citation mise en scène"},{"k":"carousel","l":"Carrousel","p":"témoignages en carrousel"},{"k":"wall","l":"Mur de citations","p":"mur de citations en colonnes"},{"k":"logos","l":"Logos + extraits","p":"logos clients accompagnés de courts extraits"}],"c":["Citation","Nom","Rôle / entreprise","Photo","Lien LinkedIn"]},
{"k":"services","l":"Services / offres","cat":"offre","h":2,"w":8,"d":"Ce que je propose","v":[{"k":"cols","l":"Offres en colonnes","p":"offres présentées en colonnes comparables"},{"k":"list","l":"Liste numérotée","p":"offres en liste numérotée typographique"},{"k":"process","l":"Méthode en étapes","p":"méthode de travail en étapes numérotées"},{"k":"pricing","l":"Grille tarifaire","p":"grille tarifaire avec tarifs indicatifs"}],"c":["Nom de l’offre","Description","Livrables","Délai","Tarif indicatif","CTA"]},
{"k":"contact","l":"Contact","cat":"action","h":2,"w":6,"d":"Prise de contact","v":[{"k":"form","l":"Formulaire complet","p":"formulaire de contact complet avec validation"},{"k":"bigmail","l":"Email en très grand","p":"adresse email affichée en très grand, cliquable"},{"k":"split","l":"Formulaire + coordonnées","p":"formulaire d'un côté, coordonnées et réseaux de l'autre"},{"k":"booking","l":"Prise de rendez-vous","p":"prise de rendez-vous intégrée (créneaux)"},{"k":"guided","l":"Conversation guidée","p":"formulaire en conversation guidée, une question à la fois"}],"c":["Formulaire","Email","Téléphone","Localisation","Réseaux","Type de demande","Disponibilité"]},
{"k":"cv","l":"CV","cat":"action","h":1,"w":4,"d":"Téléchargement du CV","v":[{"k":"button","l":"Bouton de téléchargement","p":"bouton de téléchargement du CV bien visible"},{"k":"preview","l":"Aperçu du PDF","p":"aperçu de la première page du CV avant téléchargement"},{"k":"langs","l":"Choix FR / EN","p":"choix de la version FR ou EN du CV"},{"k":"html","l":"CV en HTML","p":"CV intégré en HTML, imprimable"}],"c":["Version FR","Version EN","Date de mise à jour","Taille du fichier"]},
{"k":"footer","l":"Footer","cat":"struct","h":1,"w":8,"d":"Bas de page","v":[{"k":"minimal","l":"Ligne minimale","p":"footer minimal sur une ligne"},{"k":"big","l":"Grand footer signature","p":"grand footer avec le nom en très grand comme signature"},{"k":"cta","l":"Footer d’appel à l’action","p":"footer qui relance l'appel à l'action principal"},{"k":"sitemap","l":"Plan du site","p":"footer avec plan du site en colonnes"}],"c":["Copyright","Réseaux","Retour en haut","Mentions légales","Dernier CTA"]}
];

export const CATS: Record<string, Cat> = {"struct":{"l":"Structure","c":"#45413a"},"hero":{"l":"Accroche","c":"#d8431f"},"work":{"l":"Travaux","c":"#2d5f8f"},"profil":{"l":"Profil","c":"#2f7a4a"},"offre":{"l":"Offre","c":"#b07a1f"},"action":{"l":"Action","c":"#8b3f7a"}};

/** Ton de chaque variante : sert au tirage « 3 variantes contrastées » */
export const VT: Record<string, Record<string, Tone>> = {nav:{sticky:'sobre',side:'edito',full:'expe',pill:'sobre',index:'edito'},hero:{xxl:'edito',photo:'sobre',split:'sobre',manifesto:'edito',interactive:'expe',terminal:'expe'},projects:{index:'edito',asym:'edito',hscroll:'expe',stack:'expe',bento:'sobre',filter:'sobre'},case:{longread:'edito',chapters:'sobre',visual:'expe',sheet:'sobre'},skills:{badges:'sobre',table:'edito',marquee:'expe',matrix:'expe',logos:'sobre'},about:{portrait:'sobre',letter:'edito',facts:'sobre',mixed:'expe'},exp:{timeline:'sobre',cv:'edito',cards:'sobre',horizontal:'expe'},testi:{quote:'edito',carousel:'sobre',wall:'expe',logos:'sobre'},services:{cols:'sobre',list:'edito',process:'expe',pricing:'sobre'},contact:{form:'sobre',bigmail:'edito',split:'sobre',booking:'sobre',guided:'expe'},cv:{button:'sobre',preview:'edito',langs:'sobre',html:'expe'},footer:{minimal:'sobre',big:'edito',cta:'expe',sitemap:'sobre'}};
export const TONES: Record<Tone, string> = {sobre:"sobre",edito:"éditoriale",expe:"expérimentale"};
export const toneOf = (ek: string, vk: string): Tone => VT[ek]?.[vk] ?? "sobre";

/* Options qui concernent tout le site : déplacées dans l'étape globale « Mise en page & mouvement » */
export const SYS_IDS = ["layout.sidebar","layout.os","layout.column","space.grid12","space.scale8","space.rhythm","inter.cursor","inter.pagetr","inter.timing"];
const byId = (id: string): Example => {
  const [pid = "", k = ""] = id.split(".");
  const e = PARAMS.find((p) => p.id === pid)?.ex.find((x) => x.k === k);
  return { k: id, l: e?.l ?? id, p: e?.p ?? "", from: pid };
};
export const SYS: Param = { id:"sys", tag:"SYSTÈME", title:"Mise en page & mouvement", kind:"mixed", added:true,
  lead:"Les règles qui valent pour tout le site : structure de page, grille, rythme vertical et comportement global des animations. Elles s'appliquent à chaque élément, qui garde ensuite sa propre composition.",
  qs:["La navigation vit-elle dans une sidebar, un bureau à fenêtres, ou une colonne de lecture ?","Quelle grille et quelle échelle d'espacement pour tout le site ?","Quel curseur, quelles transitions de page, quel easing commun ?"],
  sample:"Grille 12 colonnes, espacements en multiples de 8 px, transitions 300-600 ms en ease-out expo, curseur personnalisé discret.",
  ex: SYS_IDS.map(byId) };

/* Pertinence des paramètres par élément : r = recommandé, p = possible ; le reste est masqué */
export const REL: Record<string, Record<string, Rel>> = {
 nav:{space:{p:["airy","dense"]},img:{r:["line","filled"]},inter:{r:["underline","magnetic","scramble"],p:["micro"]}},
 hero:{layout:{r:["hero","xxl","split"],p:["asym","bento"]},space:{r:["airy","bleed"],p:["narrow","dense"]},img:{r:["bw","3d","gen","video","none"],p:["flat","ascii","collage","mockup"]},inter:{r:["reveal","scramble","parallax","magnetic"],p:["stagger","marquee","tilt"]}},
 projects:{layout:{r:["masonry"],p:["split","xxl"]},space:{r:["airy","dense","bleed"],p:["narrow"]},img:{r:["mockup","video","bw"],p:["3d","gen","collage","flat","ascii","none"]},inter:{r:["hoverimg","tilt","sticky","stagger"],p:["reveal","parallax","underline"]}},
 case:{layout:{r:["split","xxl","hero"],p:["asym","masonry"]},space:{r:["measure","narrow","bleed"],p:["airy"]},img:{r:["mockup","video","bw"],p:["collage","3d","flat","gen"]},inter:{r:["reveal","sticky","parallax"],p:["stagger","hoverimg"]}},
 skills:{layout:{r:["bento","asym"],p:["split","xxl","masonry"]},space:{r:["dense","airy"],p:["narrow"]},img:{r:["line","filled","none"],p:["ascii","flat"]},inter:{r:["stagger"],p:["tilt","reveal","scramble"]}},
 about:{layout:{r:["split","asym"],p:["xxl","bento"]},space:{r:["airy","measure","narrow"],p:["dense"]},img:{r:["bw","collage","flat"],p:["3d","ascii","none","line"]},inter:{r:["reveal","parallax"],p:["stagger","scramble","tilt"]}},
 exp:{layout:{r:["split","index"],p:["asym","stack"]},space:{r:["dense","measure"],p:["airy","narrow"]},img:{r:["line","filled","none"],p:["flat","ascii"]},inter:{r:["stagger","reveal","sticky"],p:["underline","scramble"]}},
 testi:{layout:{r:["xxl","masonry"],p:["hscroll","stack","split","asym"]},space:{r:["airy"],p:["dense","narrow","bleed"]},img:{r:["bw","none"],p:["line","filled","collage"]},inter:{r:["reveal","marquee"],p:["stagger","tilt","parallax"]}},
 services:{layout:{r:["split","index","bento"],p:["asym","stack"]},space:{r:["airy","dense"],p:["narrow"]},img:{r:["line","filled","none"],p:["3d","flat"]},inter:{r:["stagger","tilt","reveal"],p:["magnetic","hoverimg","underline","micro"]}},
 contact:{layout:{r:["split","xxl"],p:["hero"]},space:{r:["airy","narrow"],p:["bleed"]},img:{r:["line","none"],p:["filled","bw","3d","gen"]},inter:{r:["magnetic","micro","underline"],p:["scramble","reveal"]}},
 cv:{img:{r:["line","filled","mockup"],p:["none"]},inter:{r:["magnetic","micro"],p:["underline"]}},
 footer:{layout:{r:["xxl"],p:["split","index"]},space:{r:["bleed","dense"],p:["airy"]},img:{r:["line","none"],p:["filled","ascii"]},inter:{r:["underline","marquee","magnetic"],p:["scramble"]}}
};

/* Variante qui inclut déjà une option de paramètre (ne pas la proposer deux fois) */
export const IMPLY: Record<string, string[]> = {"v.hero.xxl":["layout.xxl"],"v.hero.split":["layout.split"],"v.projects.stack":["inter.sticky"],"v.projects.index":["inter.hoverimg"],"v.case.visual":["layout.hero"]};

/* Contenu attendu (req) ou exclu (ban) par une variante */
export const VC: Record<string, Record<string, { req?: string[]; ban?: string[] }>> = {
 nav:{side:{req:["Nom / logo"]},index:{req:["Liens vers les sections"]}},
 hero:{xxl:{req:["Nom"]},photo:{req:["Photo"]},manifesto:{ban:["Photo"]}},
 projects:{index:{req:["Titre","Année","Visuel"]},filter:{req:["Filtres","Stack technique"]}},
 case:{visual:{req:["Captures"]},sheet:{req:["Stack","Rôle","Résultats chiffrés"]}},
 skills:{badges:{req:["Catégories"]},logos:{req:["Technos favorites"]}},
 about:{portrait:{req:["Photo"]},letter:{req:["Bio courte"]},mixed:{req:["Centres d’intérêt"]}},
 exp:{timeline:{req:["Dates"]},cv:{req:["Dates","Lieux"]}},
 testi:{quote:{req:["Citation","Nom"]},logos:{req:["Rôle / entreprise"]}},
 services:{cols:{req:["Nom de l’offre","Description"]},pricing:{req:["Tarif indicatif"]},process:{req:["Livrables"]}},
 contact:{form:{req:["Formulaire"]},bigmail:{req:["Email"],ban:["Formulaire"]},split:{req:["Formulaire","Email"]},booking:{req:["Disponibilité"]},guided:{req:["Formulaire"]}},
 cv:{langs:{req:["Version FR","Version EN"]}},
 footer:{minimal:{req:["Copyright"]},cta:{req:["Dernier CTA"]}}
};

/* ---------- Étape « Type & contexte » ---------- */
/** [clé, libellé, description, disponible] */
export const RESULTS: [string, string, string, boolean?][] = [["portfolio","Portfolio","Présenter ses projets, son profil et ses compétences.",true],["cv","CV en ligne","Un CV interactif sur une seule page."],["blog","Blog","Articles et notes techniques."],["landing","Landing page","Présenter un produit ou une offre."],["vitrine","Site vitrine","Présenter une activité de freelance."]];
export const PROFILES: [string, string, string, boolean?][] = [["fullstack","Développeur fullstack","Front et back : interfaces, API, bases de données.",true],["front","Développeur front-end","Interfaces, intégration, animation."],["back","Développeur back-end","API, architecture, données."],["ux","Designer UX/UI","Études de cas et process."],["creative","Creative developer","Le site sert lui-même de démo technique."],["photo","Photographe","L’image passe avant le texte."],["illu","Illustrateur","Galerie et univers graphique."]];
export const FORMATS: ["one" | "multi", string, string][] = [["one","One-page","Un seul plateau : toutes les sections à la suite, navigation par ancres."],["multi","Multi-pages","Un plateau par page : Accueil, Projets, À propos, Contact…"]];

/* ---------- Structure ---------- */
export const STRUCT_PRESETS: Record<"one" | "multi", { name: string; k: string[] }[]> = {
  one: [{ name:"Page unique", k:["nav","hero","projects","skills","about","contact","footer"] }],
  multi: [
    { name:"Accueil", k:["nav","hero","projects","contact","footer"] },
    { name:"Projets", k:["nav","projects","case","footer"] },
    { name:"À propos", k:["nav","about","exp","skills","cv","footer"] },
    { name:"Contact", k:["nav","contact","footer"] }
  ]
};
export const VIEWS: ["facade" | "relief" | "plaque", string][] = [["facade","Façade"],["relief","Relief 3D"],["plaque","Vue de dessus"]];

/* ---------- Code ---------- */
export const STACKS = ["Next.js + Tailwind CSS + Framer Motion","Astro + CSS natif","HTML / CSS / JS sans framework","SvelteKit","React + Vite"];
export const LETTERS = "ABCD";
