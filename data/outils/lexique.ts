/* eslint-disable */
// Contenu du Lexique du prompt design, extrait tel quel de l'ancienne page statique.
// Ajouter un exemple = ajouter une ligne dans PARAMS.
import type { Param, Preset, Tip } from "./lexique-types";

export const PARAMS: Param[] = [
{ id:"type", tag:"TYPE", title:"Type & contexte", kind:"text",
  lead:"Ce qu'on construit, et pour quel usage. C'est ce qui définit les sections attendues, la quantité de contenu et les conventions à respecter (ou à casser).",
  qs:["Quel format : one-page, multi-pages, app ?","Quelles sections sont indispensables ?","Qu'est-ce que le visiteur doit trouver en premier ?"],
  sample:"Portfolio one-page de développeur front-end : hero, 4 projets sélectionnés, stack, à propos, contact.",
  ex:[
   {k:"dev",l:"Portfolio one-page développeur",p:"portfolio one-page de développeur front-end : hero, projets sélectionnés, stack technique, à propos, contact"},
   {k:"ux",l:"Portfolio UX à études de cas",p:"portfolio de designer UX/UI centré sur 3-4 études de cas détaillées (contexte, problème, process, résultat chiffré)"},
   {k:"creative",l:"Portfolio creative developer",p:"portfolio de creative developer expérimental, où le site lui-même sert de démonstration technique"},
   {k:"gallery",l:"Portfolio visuel / galerie",p:"portfolio visuel type galerie pour photographe ou illustrateur : l'image passe avant le texte"},
   {k:"freelance",l:"Site freelance orienté clients",p:"site vitrine de freelance orienté conversion : offres, méthode de travail, témoignages, prise de rendez-vous"},
   {k:"landing",l:"Landing page produit",p:"landing page de produit SaaS : proposition de valeur, fonctionnalités, preuve sociale, tarifs, CTA"},
   {k:"dashboard",l:"Dashboard / application",p:"interface d'application web type dashboard : navigation latérale, KPIs, tableaux, filtres, états vides"},
   {k:"blog",l:"Blog éditorial",p:"blog éditorial long format où le confort de lecture est prioritaire"}
  ]},
{ id:"goal", tag:"OBJECTIF & PUBLIC", title:"Objectif & public", kind:"text", added:true,
  lead:"Pour qui et pour quoi. Un même portfolio ne se conçoit pas de la même façon pour un recruteur qui scanne 50 profils ou pour un directeur artistique qui cherche un coup de cœur.",
  qs:["Qui visite le site, et combien de temps y reste-t-il ?","Quelle action unique doit-il faire ?","Quelle émotion doit-il garder en partant ?"],
  sample:"Cible : recruteurs tech pressés. Ils doivent comprendre en 30 secondes qui je suis et accéder à mon CV en un clic.",
  ex:[
   {k:"recruiter",l:"Convaincre un recruteur en 30 s",p:"cible : recruteurs tech pressés ; ils doivent comprendre en 30 secondes qui je suis, ce que je fais, et accéder à mon CV"},
   {k:"client",l:"Décrocher des clients",p:"cible : clients potentiels (PME, startups) ; objectif : prise de contact, CTA principal « Discutons de votre projet »"},
   {k:"agency",l:"Séduire une agence créative",p:"cible : directeurs artistiques d'agences ; objectif : prouver une sensibilité visuelle forte et le goût du détail"},
   {k:"memorable",l:"Être mémorable",p:"objectif : laisser une impression durable, prendre un risque créatif assumé plutôt que rassurer"},
   {k:"trust",l:"Inspirer confiance",p:"objectif : inspirer sérieux et fiabilité, mettre en avant résultats chiffrés, logos clients et témoignages"},
   {k:"skill",l:"Le site prouve la compétence",p:"le site doit démontrer par lui-même mes compétences en animation et en intégration front-end"},
   {k:"cta",l:"Un seul CTA clair",p:"une seule action principale, répétée en haut et en bas de page : m'envoyer un email"}
  ]},
{ id:"perso", tag:"PERSONNALITÉ", title:"Personnalité", kind:"text",
  lead:"Le caractère du site, comme s'il était une personne. Choisis 2 ou 3 adjectifs, et surtout place-toi sur des axes : c'est plus précis qu'une liste de qualités.",
  qs:["Si le site était une personne, comment parlerait-elle ?","Où te places-tu sur chaque axe ci-dessous ?","Qu'est-ce que le site ne doit surtout pas être ?"],
  sample:"Personnalité : précise et calme, avec une pointe d'humour dans les micro-textes. Plutôt sérieux (70 %) que ludique.",
  axes:[["Sérieux","Ludique"],["Minimal","Riche"],["Chaleureux","Clinique"],["Classique","Expérimental"],["Discret","Démonstratif"]],
  ex:[
   {k:"serious",l:"Sérieux, précis, fiable",p:"personnalité sérieuse, précise et fiable, zéro superflu"},
   {k:"playful",l:"Ludique, espiègle, énergique",p:"personnalité ludique, espiègle et énergique, avec de l'humour dans les micro-textes"},
   {k:"warm",l:"Chaleureux, humain, accessible",p:"personnalité chaleureuse, humaine et accessible, ton de conversation"},
   {k:"clinical",l:"Froid, technique, clinique",p:"personnalité froide, technique et clinique, comme un instrument de précision"},
   {k:"elegant",l:"Élégant, raffiné, discret",p:"personnalité élégante, raffinée et discrète, le luxe du silence"},
   {k:"bold",l:"Audacieux, provocateur, radical",p:"personnalité audacieuse, provocatrice et radicale, qui assume de diviser"},
   {k:"calm",l:"Calme, poétique, contemplatif",p:"personnalité calme, poétique et contemplative, rythme lent"},
   {k:"geek",l:"Geek, curieux, plein d'easter eggs",p:"personnalité geek et curieuse, avec des easter eggs cachés à découvrir"},
   {k:"craft",l:"Artisanal, fait main, imparfait",p:"personnalité artisanale et imparfaite, qui montre la trace de la main"},
   {k:"futur",l:"Futuriste, spéculatif, immersif",p:"personnalité futuriste et spéculative, expérience immersive"}
  ]},
{ id:"style", tag:"STYLE", title:"Style / direction artistique", kind:"style",
  lead:"La famille esthétique globale. Nommer un style connu donne à l'IA un énorme contexte en un seul mot. Ajoute toujours 2 ou 3 caractéristiques précises pour éviter une caricature.",
  qs:["Quel style correspond à la personnalité choisie ?","Faut-il en mélanger deux (ex. éditorial + brutaliste) ?","Quels traits du style garder, lesquels écarter ?"],
  sample:"Direction néo-brutaliste : bordures noires épaisses, ombres dures décalées, couleurs saturées, mais une typographie soignée.",
  tip:"Mélanger deux styles éloignés (« Swiss + Y2K », « luxe minimal + terminal ») est l'un des meilleurs moyens d'obtenir quelque chose d'original.",
  ex:[
   {k:"swiss",l:"Swiss / International",p:"style suisse (International Typographic Style) : grille stricte, asymétrie, grotesque grasse, beaucoup de blanc, un rouge d'accent"},
   {k:"brutal",l:"Brutalisme web",p:"brutalisme web : HTML brut assumé, polices système, liens bleus soulignés, bordures fines, aucun ornement"},
   {k:"neobrutal",l:"Néo-brutalisme",p:"néo-brutalisme : bordures noires épaisses, ombres dures décalées sans flou, couleurs vives saturées, formes franches"},
   {k:"glass",l:"Glassmorphism",p:"glassmorphism : panneaux translucides floutés (backdrop-blur), bordures claires fines, formes colorées en arrière-plan"},
   {k:"neu",l:"Neumorphism",p:"neumorphism : éléments extrudés du fond avec doubles ombres claire/sombre, palette monochrome douce"},
   {k:"bento",l:"Bento grid",p:"bento grid : contenus organisés en tuiles arrondies de tailles variées, comme une boîte à bento"},
   {k:"edito",l:"Éditorial magazine",p:"style éditorial magazine : grande serif à fort contraste, colonnes, filets, légendes, numéros de rubrique"},
   {k:"y2k",l:"Y2K / chrome",p:"esthétique Y2K : textes chromés, dégradés irisés rose/bleu/lilas, pilules brillantes, étoiles et glows"},
   {k:"term",l:"Rétro terminal",p:"esthétique terminal rétro : fond noir, texte monospace vert phosphore, curseur clignotant, interactions en ligne de commande"},
   {k:"memphis",l:"Memphis",p:"style Memphis années 80 : formes géométriques flottantes, zigzags, trames de points, couleurs pop"},
   {k:"organic",l:"Organique / fait main",p:"style organique : formes blob irrégulières, tons naturels, écriture manuscrite, imperfections volontaires"},
   {k:"luxe",l:"Luxe minimal",p:"luxe minimal : fond noir profond, serif fine italique, capitales très espacées, doré sourd, énormément d'espace"},
   {k:"skeuo",l:"Skeuomorphisme revisité",p:"skeuomorphisme revisité : matières réalistes (métal brossé, boutons physiques, LED), tactilité assumée"},
   {k:"dark",l:"Dark tech (type Linear)",p:"style dark tech premium : fond quasi noir, halos lumineux subtils, textes en dégradé blanc→gris, bordures à 10 % d'opacité"},
   {k:"bauhaus",l:"Bauhaus",p:"style Bauhaus : formes géométriques primaires, rouge/jaune/bleu/noir, compositions en quarts de cercle"}
  ]},
{ id:"refs", tag:"RÉFÉRENCES", title:"Références & inspirations", kind:"ref", added:true,
  tip:"Les aperçus ci-dessous sont des évocations : ils montrent le trait à retenir, pas l'œuvre. Le lien sous chaque carte mène à de vrais exemples. Dans Claude Design, le plus efficace reste de joindre de vraies captures de tes références, avec une phrase qui dit ce que tu en retiens (« retiens la grille, pas les couleurs »).",
  lead:"Des références culturelles précises (mouvements, médias, objets) valent mieux que « comme Apple ». Précise toujours ce que tu retiens de la référence : sinon l'IA la copie en surface.",
  qs:["Quels univers hors du web t'inspirent (print, cinéma, objets) ?","Qu'est-ce que tu retiens exactement de chaque référence ?","Y a-t-il des sites que tu admires, et pourquoi ?"],
  sample:"Inspiration : affiches suisses des années 60 pour la grille et l'asymétrie, mais avec la douceur des couleurs de la papeterie japonaise.",
  ex:[
   {k:"constr",l:"Constructivisme russe",p:"inspiration : affiches constructivistes russes (diagonales dynamiques, rouge et noir, typographie en biais) — retenir l'énergie des diagonales",u:"https://artsandculture.google.com/search?q=constructivism%20poster"},
   {k:"swissposter",l:"Affiches suisses années 60",p:"inspiration : affiches de Josef Müller-Brockmann, grille visible et asymétrie rigoureuse",u:"https://www.google.com/search?tbm=isch&q=Josef+M%C3%BCller-Brockmann+poster"},
   {k:"mag",l:"Magazines print haut de gamme",p:"inspiration : mise en page de magazines print haut de gamme (colonnes, lettrines, légendes, grands blancs)",u:"https://www.google.com/search?tbm=isch&q=editorial+magazine+layout+spread"},
   {k:"awwwards",l:"Sites primés Awwwards",p:"niveau de finition des sites primés sur Awwwards : transitions soignées, typographie expressive, détails d'interaction",u:"https://www.awwwards.com/websites/portfolio/"},
   {k:"os",l:"Interfaces d'OS rétro",p:"inspiration : interfaces d'OS rétro (Mac OS 9, Windows 95) : fenêtres déplaçables, barres de titre, icônes pixel",u:"https://www.google.com/search?tbm=isch&q=Windows+95+Mac+OS+9+interface"},
   {k:"cinema",l:"Génériques de film",p:"inspiration : génériques et titrages de cinéma, rythme lent, typographie centrée, fondus au noir",u:"https://www.artofthetitle.com/"},
   {k:"japan",l:"Graphisme japonais",p:"inspiration : design graphique japonais, mélange de typographie dense et de vide, compositions verticales",u:"https://www.google.com/search?tbm=isch&q=japanese+graphic+design+poster"},
   {k:"nasa",l:"Manuels techniques / NASA",p:"inspiration : manuels techniques et documentation NASA des années 70 : schémas, numérotation, codes de référence",u:"https://www.google.com/search?tbm=isch&q=NASA+graphics+standards+manual+1975"},
   {k:"zine",l:"Fanzines & DIY",p:"inspiration : fanzines photocopiés, collage, scotch, typographie découpée",u:"https://www.google.com/search?tbm=isch&q=photocopied+punk+fanzine+layout"},
   {k:"museum",l:"Signalétique de musée",p:"inspiration : signalétique et cartels de musée : étiquettes, numéros d'œuvres, textes courts et sobres",u:"https://www.google.com/search?tbm=isch&q=museum+wall+label+exhibition+signage"}
  ]},
{ id:"layout", tag:"COMPOSITION", title:"Composition / layout", kind:"wire",
  lead:"L'organisation spatiale des éléments : ce qui domine, où va l'œil, comment on navigue. C'est souvent là que les designs IA se ressemblent tous (hero centré puis grille de cartes).",
  qs:["Quel est l'élément dominant du premier écran ?","Comment sont présentés les projets : grille, liste, scroll ?","Le scroll est-il vertical, horizontal, ou raconté ?"],
  sample:"Hero avec mon nom en typographie XXL qui occupe toute la largeur ; projets en liste-index avec aperçu d'image au survol.",
  ex:[
   {k:"hero",l:"Hero plein écran",p:"hero plein écran avec visuel en fond et titre ancré en bas à gauche"},
   {k:"asym",l:"Grille asymétrique",p:"grille asymétrique avec blocs décalés et tailles volontairement inégales"},
   {k:"split",l:"Split-screen",p:"écran divisé en deux : texte fixe à gauche, contenu qui défile à droite"},
   {k:"bento",l:"Bento",p:"mise en page bento : tuiles de tailles variées qui résument tout le profil sur un seul écran"},
   {k:"hscroll",l:"Scroll horizontal",p:"section projets en scroll horizontal piloté par le scroll vertical"},
   {k:"masonry",l:"Masonry",p:"grille masonry (hauteurs variables) pour les visuels de projets"},
   {k:"xxl",l:"Typographie XXL",p:"typographie XXL qui occupe toute la largeur de l'écran, le texte comme élément graphique principal"},
   {k:"column",l:"Colonne éditoriale",p:"une seule colonne de lecture centrée, étroite, comme un article"},
   {k:"os",l:"Bureau / OS",p:"interface façon bureau d'ordinateur : fenêtres superposées à ouvrir, déplacer et fermer"},
   {k:"sidebar",l:"Sidebar fixe",p:"sidebar fixe à gauche avec nom, navigation et contact ; contenu défilant à droite"},
   {k:"index",l:"Liste-index",p:"projets présentés en liste-index typographique (numéro, titre, année) avec aperçu d'image au survol"},
   {k:"stack",l:"Cartes empilées",p:"cartes de projets qui s'empilent les unes sur les autres au scroll (sticky stacking)"}
  ]},
{ id:"space", tag:"GRILLE & DENSITÉ", title:"Grille, espacement & densité", kind:"wire", added:true,
  lead:"La respiration de la page. L'espace blanc, la grille et le rythme vertical distinguent un design amateur d'un design pro, et l'IA a tendance à tout espacer de façon uniforme.",
  qs:["Beaucoup d'éléments par écran, ou un seul point focal ?","La grille doit-elle être visible, respectée ou cassée ?","Quelle largeur maximale pour le texte ?"],
  sample:"Système d'espacement en 8 px, grille 12 colonnes, sections très aérées (160 px entre elles), texte limité à 65 caractères par ligne.",
  ex:[
   {k:"airy",l:"Très aéré",p:"beaucoup d'espace blanc, 160 px ou plus entre les sections, un seul point focal par écran"},
   {k:"dense",l:"Dense, informationnel",p:"densité d'information élevée, espacements serrés mais parfaitement alignés"},
   {k:"grid12",l:"Grille 12 colonnes visible",p:"grille 12 colonnes stricte, gouttière 24 px, lignes de grille visibles en filigrane, quelques éléments qui la cassent volontairement"},
   {k:"scale8",l:"Échelle de 8 px",p:"système d'espacement basé sur 8 px (8, 16, 24, 32, 48, 64, 96, 128)"},
   {k:"measure",l:"65 caractères par ligne",p:"largeur de texte limitée à environ 65 caractères par ligne pour le confort de lecture"},
   {k:"bleed",l:"Pleine largeur (full-bleed)",p:"images et sections en pleine largeur, bord à bord, sans conteneur centré"},
   {k:"narrow",l:"Conteneur étroit centré",p:"contenu dans un conteneur centré de 720 px, marges latérales généreuses"},
   {k:"rhythm",l:"Rythme alterné",p:"rythme vertical alterné : sections denses puis respirations plein écran"}
  ]},
{ id:"typo", tag:"TYPOGRAPHIE", title:"Typographie", kind:"font",
  lead:"Le paramètre qui porte le plus la personnalité. Nomme des polices précises (Google Fonts de préférence), leur rôle (titres / texte), les graisses et l'échelle de tailles.",
  qs:["Quelle police pour les titres, laquelle pour le texte ?","Quel contraste de tailles entre titre et texte ?","Graisses, interlettrage, capitales, italiques ?"],
  sample:"Titres en Instrument Serif à 120 px, interlettrage -2 % ; texte en DM Sans 17 px ; métadonnées en JetBrains Mono 12 px en capitales.",
  tip:"Un pairing de 2 polices (3 max) suffit. Le contraste entre les deux (serif + sans, large + condensée) crée la hiérarchie.",
  ex:[
   {k:"grotesk",l:"Grotesque de caractère",p:"titres en Space Grotesk (grotesque géométrique au caractère affirmé)",pv:{f:"'Space Grotesk'",w:700,nm:"Space Grotesk 700"}},
   {k:"neogrotesk",l:"Néo-grotesque suisse",p:"néo-grotesque type Helvetica/Inter, graisse 800, interlettrage serré (-0.04em) sur les titres",pv:{f:"Inter",w:800,ls:"-.04em",nm:"Inter 800, -4%"}},
   {k:"didone",l:"Serif éditoriale contrastée",p:"serif didone à fort contraste (Playfair Display) pour les titres, italiques expressives",pv:{f:"'Playfair Display'",w:700,st:"italic",nm:"Playfair Display Italic"}},
   {k:"fraunces",l:"Serif douce et chaleureuse",p:"serif variable chaleureuse (Fraunces) à fort axe optique, ton littéraire",pv:{f:"Fraunces",w:900,nm:"Fraunces 900"}},
   {k:"instrument",l:"Serif fine en très grand",p:"serif fine et élégante (Instrument Serif) en très grand corps, face à une sans-serif discrète",pv:{f:"'Instrument Serif'",w:400,nm:"Instrument Serif"}},
   {k:"mono",l:"Monospace technique",p:"police monospace (JetBrains Mono) très présente : navigation, labels, métadonnées, esthétique code",pv:{f:"'JetBrains Mono'",w:700,nm:"JetBrains Mono"}},
   {k:"syne",l:"Display expérimentale",p:"display large et expérimentale (Syne ExtraBold) pour les titres",pv:{f:"Syne",w:800,nm:"Syne 800"}},
   {k:"bebas",l:"Condensée façon affiche",p:"condensée en capitales (Bebas Neue) en très grand corps, style affiche",pv:{f:"'Bebas Neue'",w:400,tt:"uppercase",nm:"Bebas Neue"}},
   {k:"archivo",l:"Ultra grasse, impact",p:"sans-serif ultra grasse (Archivo Black) pour un impact brutal",pv:{f:"'Archivo Black'",w:400,nm:"Archivo Black"}},
   {k:"hand",l:"Touches manuscrites",p:"annotations manuscrites (Caveat) en marge, comme des notes au crayon",pv:{f:"Caveat",w:700,nm:"Caveat 700"}},
   {k:"pairing",l:"Pairing serif + sans",p:"pairing contrasté : serif éditoriale (Instrument Serif) pour les titres + grotesque neutre (DM Sans) pour le texte",pv:{pair:true,nm:"Instrument Serif + DM Sans"}},
   {k:"scale",l:"Échelle typographique extrême",p:"échelle typographique très contrastée (ratio 1.5), titres hero à 140 px ou plus, texte à 16 px",pv:{scale:true,nm:"ratio 1.5 — 16 → 140 px"}}
  ]},
{ id:"color", tag:"COULEURS", title:"Couleurs", kind:"swatch",
  lead:"Donne des codes hex, un rôle à chaque couleur (fond, texte, accent) et des proportions. Précise aussi le mode clair/sombre. Sans ces précisions, l'IA ressort ses dégradés violets.",
  qs:["Combien de couleurs, et quel rôle pour chacune ?","Quelle proportion pour l'accent ?","Clair, sombre, ou les deux ?"],
  sample:"Règle 60-30-10 : 60 % fond crème #F4EFE6, 30 % vert sapin #1F3B2D, 10 % accent orange #E8672A réservé aux CTA.",
  ex:[
   {k:"monoaccent",l:"Monochrome + 1 accent",p:"palette monochrome (noir #0E0E0E, blanc cassé #F4F2EE, gris #8A8A8A) avec un seul accent orange vif #FF4F1F",pv:{c:["#0E0E0E","#F4F2EE","#8A8A8A","#FF4F1F"]}},
   {k:"pastel",l:"Pastels doux",p:"palette pastel : crème #FDF6EC, rose #F7C8C8, menthe #C9E4DE, bleu ciel #C6DEF1, lilas #DBCDF0",pv:{c:["#FDF6EC","#F7C8C8","#C9E4DE","#C6DEF1","#DBCDF0"]}},
   {k:"neon",l:"Néon sur noir",p:"néons sur fond noir #0A0A0F : vert #39FF14, magenta #FF00E5, cyan #00F0FF, avec glows",pv:{c:["#0A0A0F","#39FF14","#FF00E5","#00F0FF"]}},
   {k:"earth",l:"Terre & naturel",p:"tons terre : sable #F2EBDD, terracotta #C8553D, brun #8C6E4B, olive #3F4A34, presque noir #1E1B18",pv:{c:["#F2EBDD","#C8553D","#8C6E4B","#3F4A34","#1E1B18"]}},
   {k:"bw",l:"Noir & blanc pur",p:"uniquement noir #000 et blanc #FFF, aucune autre couleur, contraste maximal",pv:{c:["#000000","#FFFFFF"]}},
   {k:"navy",l:"Bleu profond & jaune",p:"bleu nuit #0B1D3A dominant, bleu #1F4E8C, blanc bleuté #EAF0F7, accent jaune #F5B700",pv:{c:["#0B1D3A","#1F4E8C","#EAF0F7","#F5B700"]}},
   {k:"duotone",l:"Duotone",p:"palette duotone bleu électrique #1A1AFF et rose pâle #FFE6E6, images traitées en duotone",pv:{c:["#1A1AFF","#FFE6E6"]}},
   {k:"darkmode",l:"Mode sombre nuancé",p:"mode sombre sans noir pur : fond #111113, surfaces #1C1C1F, texte #EDEDED, accent #7C7CFF",pv:{c:["#111113","#1C1C1F","#EDEDED","#7C7CFF"]}},
   {k:"603010",l:"Règle 60-30-10",p:"règle 60-30-10 : 60 % crème #F4EFE6, 30 % vert sapin #1F3B2D, 10 % orange #E8672A",pv:{ratio:[["#F4EFE6",60],["#1F3B2D",30],["#E8672A",10]]}},
   {k:"gradient",l:"Un seul dégradé maîtrisé",p:"un seul dégradé chaud orange #FF8A5B → rose #E6457A, utilisé uniquement dans le hero",pv:{grad:"linear-gradient(135deg,#FF8A5B,#E6457A)"}}
  ]},
{ id:"shape", tag:"FORMES & MATIÈRES", title:"Formes, matières & détails", kind:"shape", added:true,
  lead:"Rayons des coins, bordures, ombres, textures : ces détails décident si l'interface paraît douce, dure, tactile ou numérique. Des paramètres minuscules, mais très visibles.",
  qs:["Coins vifs ou arrondis ? De combien ?","Ombres : aucune, douces, ou dures ?","Une texture (grain, papier) pour casser l'aspect numérique ?"],
  sample:"Coins à 0 px partout, filets de 1 px, aucune ombre, grain léger (5 %) sur tout le fond.",
  ex:[
   {k:"sharp",l:"Angles vifs (0 px)",p:"coins parfaitement vifs (border-radius 0) partout"},
   {k:"round",l:"Très arrondi (24 px+)",p:"coins très arrondis (24 px et plus), formes douces"},
   {k:"pill",l:"Boutons pilule",p:"boutons et tags en forme de pilule (radius 999 px)"},
   {k:"thick",l:"Bordures épaisses",p:"bordures noires épaisses de 3 px sur les éléments interactifs"},
   {k:"hard",l:"Ombres dures décalées",p:"ombres dures décalées de 6 px sans flou (box-shadow 6px 6px 0 #111)"},
   {k:"soft",l:"Ombres douces diffuses",p:"ombres douces et diffuses sur plusieurs couches, élévation subtile"},
   {k:"grain",l:"Grain / bruit",p:"texture de grain (noise) légère sur les fonds et les dégradés"},
   {k:"blur",l:"Flou & transparence",p:"surfaces translucides floutées (backdrop-filter blur 16 px)"},
   {k:"paper",l:"Texture papier",p:"texture papier et imperfections d'impression"},
   {k:"hair",l:"Filets fins / hairlines",p:"filets de 1 px, lignes de grille visibles, esthétique de plan technique"},
   {k:"mix",l:"Coins asymétriques",p:"coins asymétriques (arrondis sur deux angles opposés seulement) comme signature graphique"}
  ]},
{ id:"img", tag:"IMAGERIE", title:"Imagerie & iconographie", kind:"img", added:true,
  lead:"Le type de visuels (photos, illustrations, 3D, rien du tout) et leur traitement. Précise aussi le style d'icônes, sinon l'IA mettra des emojis ou des icônes génériques.",
  qs:["Quels visuels ai-je vraiment (captures de projets, photo de moi) ?","Quel traitement leur appliquer (N&B, duotone, cadrage) ?","Des icônes : oui/non, line ou pleines ?"],
  sample:"Captures de projets présentées dans des mockups navigateur minimalistes, photo de moi en noir & blanc granuleuse, icônes line 1.5 px (Lucide).",
  ex:[
   {k:"bw",l:"Photos N&B granuleuses",p:"photos en noir & blanc au grain argentique, fort contraste"},
   {k:"mockup",l:"Mockups d'appareils",p:"captures de projets dans des mockups navigateur/mobile minimalistes"},
   {k:"3d",l:"Illustrations 3D douces",p:"illustrations 3D douces (clay render), éclairage studio"},
   {k:"flat",l:"Illustrations vectorielles",p:"illustrations vectorielles au trait, dans la palette du site"},
   {k:"gen",l:"Visuels génératifs",p:"visuels génératifs abstraits (shaders WebGL, formes en mouvement) à la place de photos"},
   {k:"none",l:"Aucune image, 100 % typo",p:"aucune image : la typographie et la mise en page portent tout"},
   {k:"line",l:"Icônes line fines",p:"icônes line 1.5 px cohérentes (style Lucide ou Phosphor)"},
   {k:"filled",l:"Icônes pleines",p:"icônes pleines aux formes géométriques simples"},
   {k:"ascii",l:"ASCII / pixel art",p:"visuels en art ASCII ou pixel art"},
   {k:"video",l:"Vidéos en boucle",p:"courtes vidéos muettes en boucle pour présenter les projets au survol"},
   {k:"collage",l:"Collage / découpage",p:"collages de photos découpées, scotch, superpositions"}
  ]},
{ id:"inter", tag:"INTERACTIONS", title:"Interactions & animations", kind:"demo",
  lead:"Comment l'interface réagit et bouge. Nomme l'effet, sa durée et son easing. Trop d'animations tuent l'effet : choisis 2 ou 3 interactions signatures. Les démos ci-dessous réagissent à la souris.",
  qs:["Quelles 2-3 interactions signatures rendront le site mémorable ?","Quel rythme : vif (200 ms) ou lent et fluide (800 ms) ?","Que se passe-t-il au survol d'un projet ?"],
  sample:"Titres révélés ligne par ligne au scroll (600 ms, ease-out), aperçu d'image qui suit le curseur sur la liste des projets, bouton de contact magnétique.",
  ex:[
   {k:"magnetic",l:"Bouton magnétique",p:"boutons magnétiques qui sont attirés par le curseur"},
   {k:"cursor",l:"Curseur personnalisé",p:"curseur personnalisé (cercle) qui grossit au survol des liens"},
   {k:"reveal",l:"Révélation ligne par ligne",p:"titres révélés ligne par ligne avec un masque, au scroll"},
   {k:"stagger",l:"Apparition en cascade",p:"éléments qui apparaissent en cascade (stagger de 50 ms)"},
   {k:"hoverimg",l:"Aperçu image au survol",p:"sur la liste des projets, un aperçu d'image apparaît et suit le curseur"},
   {k:"marquee",l:"Bandeau défilant",p:"bandeau de texte défilant en continu (marquee)"},
   {k:"underline",l:"Soulignement animé",p:"liens soulignés par un trait qui se dessine de gauche à droite"},
   {k:"tilt",l:"Carte inclinable 3D",p:"cartes de projets qui s'inclinent en 3D selon la position du curseur"},
   {k:"scramble",l:"Texte brouillé",p:"effet de texte brouillé qui se décode au survol"},
   {k:"pagetr",l:"Transition de page",p:"transition de page par un rideau de couleur qui balaie l'écran"},
   {k:"parallax",l:"Parallax",p:"parallax léger à plusieurs couches de profondeur"},
   {k:"micro",l:"Micro-interaction",p:"micro-interactions sur les actions (chargement, succès) avec retour visuel"},
   {k:"sticky",l:"Cartes empilées au scroll",p:"cartes qui s'empilent en sticky au scroll",hint:"scrolle dedans"},
   {k:"timing",l:"Timing & easing",p:"durées 300-600 ms, easing cubic-bezier(.22,1,.36,1) (ease-out expo), jamais de linear"}
  ]},
{ id:"a11y", tag:"RESPONSIVE & ACCESSIBILITÉ", title:"Responsive & accessibilité", kind:"text", added:true,
  lead:"Les contraintes non négociables. Un portfolio consulté sur mobile par un recruteur, ou illisible pour une partie du public, perd tout son intérêt, même avec un design superbe.",
  qs:["Le site sera-t-il vu surtout sur mobile ?","Les contrastes sont-ils suffisants ?","Les animations respectent-elles les préférences système ?"],
  sample:"Mobile-first, contrastes WCAG AA, respect de prefers-reduced-motion, états de focus visibles, cibles tactiles de 44 px minimum.",
  ex:[
   {k:"mobile",l:"Mobile-first",p:"conception mobile-first, expérience complète dès 375 px de large"},
   {k:"contrast",l:"Contrastes WCAG AA",p:"contrastes conformes WCAG AA (4.5:1 pour le texte)"},
   {k:"motion",l:"Réduction des animations",p:"respect de prefers-reduced-motion : animations désactivées si demandé"},
   {k:"focus",l:"Focus visibles",p:"navigation clavier complète avec états de focus visibles et stylés"},
   {k:"touch",l:"Cibles tactiles 44 px",p:"cibles tactiles de 44 px minimum"},
   {k:"theme",l:"Thème clair / sombre",p:"thème clair et sombre, qui suit les préférences système, avec un bouton de bascule"},
   {k:"perf",l:"Performance",p:"site léger : score Lighthouse supérieur à 90, polices limitées à 2, images optimisées"},
   {k:"semantic",l:"HTML sémantique",p:"HTML sémantique (header, main, nav, sections titrées), textes alternatifs sur les images"}
  ]},
{ id:"avoid", tag:"À ÉVITER", title:"À éviter", kind:"text", cls:"avoid",
  lead:"Les réflexes de l'« esthétique IA ». Les interdire explicitement est souvent l'instruction qui améliore le plus le résultat.",
  qs:["Qu'est-ce qui rendrait ce site interchangeable avec un autre ?","Quels clichés vois-tu partout sur les portfolios ?","Qu'est-ce que tu as détesté dans les versions précédentes ?"],
  sample:"À éviter : dégradés violet/bleu, emojis en guise d'icônes, grille de 3 cartes identiques, hero centré « Hi, I'm… », animations partout.",
  ex:[
   {k:"purple",l:"Dégradés violet/bleu génériques",p:"pas de dégradés violet/bleu génériques"},
   {k:"emoji",l:"Emojis en guise d'icônes",p:"pas d'emojis en guise d'icônes"},
   {k:"cards",l:"Grille de cartes identiques",p:"pas de grille de 3 cartes identiques avec icône + titre + texte"},
   {k:"hero",l:"Hero centré « Hi, I'm… »",p:"pas de hero centré « Hi, I'm X, a passionate developer »"},
   {k:"inter",l:"Inter / Roboto par défaut",p:"pas d'Inter ni de Roboto par défaut, choisis une typographie qui a du caractère"},
   {k:"glass",l:"Glassmorphism décoratif",p:"pas de glassmorphism ni de flou décoratif sans raison"},
   {k:"lorem",l:"Lorem ipsum",p:"pas de lorem ipsum ni de textes génériques, utilise du contenu réaliste"},
   {k:"stock",l:"Illustrations corporate",p:"pas d'illustrations corporate génériques (personnages plats type unDraw)"},
   {k:"centered",l:"Tout centré",p:"pas de mise en page entièrement centrée et symétrique"},
   {k:"anim",l:"Animations partout",p:"pas d'animations sur chaque élément, seulement 2-3 interactions signatures"},
   {k:"shadow",l:"Ombres et arrondis partout",p:"pas d'ombres portées et de coins arrondis uniformes sur tout"},
   {k:"skills",l:"Barres de compétences en %",p:"pas de barres de progression de compétences en pourcentage"}
  ]}
];

export const PRESETS: Preset[] = [
 {name:"Éditorial suisse", vg:"swiss", desc:"Rigueur typographique, grille visible et liste-index de projets. Pour une designer ou un designer UX qui veut paraître pointu et sûr de ses choix.",
  sel:{type:["ux"],goal:["agency"],perso:["serious","elegant"],style:["swiss","edito"],refs:["swissposter","mag"],layout:["xxl","index"],space:["airy","grid12"],typo:["neogrotesk","instrument"],color:["monoaccent"],shape:["sharp","hair"],img:["bw"],inter:["hoverimg","underline","reveal"],a11y:["contrast","motion","mobile"],avoid:["purple","cards","hero","anim"]}},
 {name:"Néo-brutaliste ludique", vg:"neo", desc:"Couleurs franches, bordures épaisses et interface façon bureau. Pour un profil développeur qui veut qu'on se souvienne de lui ou d'elle.",
  sel:{type:["dev"],goal:["memorable"],perso:["playful","geek"],style:["neobrutal","memphis"],refs:["os","zine"],layout:["bento","os"],space:["dense"],typo:["archivo","mono"],color:["pastel"],shape:["thick","hard"],img:["ascii","collage"],inter:["micro","tilt","marquee"],a11y:["mobile","focus"],avoid:["glass","emoji","skills","lorem"]}},
 {name:"Dark tech immersif", vg:"dark", desc:"Sombre, lumineux par touches, et le site est lui-même la démonstration technique. Pour une ou un creative developer.",
  sel:{type:["creative"],goal:["skill"],perso:["futur","clinical"],style:["dark","term"],refs:["awwwards","nasa"],layout:["hero","stack","hscroll"],space:["rhythm","scale8"],typo:["grotesk","mono"],color:["darkmode"],shape:["grain","hair"],img:["gen","video"],inter:["cursor","scramble","pagetr"],a11y:["motion","focus"],avoid:["cards","inter","centered","stock"]}}
];

export const MAX: Record<string, number> = {type:1,goal:1,perso:2,style:2,refs:2,layout:3,space:2,typo:2,color:1,shape:3,img:2,inter:3,a11y:Infinity,avoid:Infinity};

export const HARD: [string, string][] = [
 ["shape.sharp","shape.round"],["shape.sharp","shape.pill"],["shape.sharp","shape.mix"],["shape.hard","shape.soft"],
 ["space.airy","space.dense"],["space.bleed","space.narrow"],
 ["perso.serious","perso.playful"],["perso.calm","perso.bold"],["perso.warm","perso.clinical"],
 ...["bw","mockup","3d","flat","gen","video","ascii","collage"].map((k): [string, string] => ["img.none","img."+k]),
 ["img.none","inter.hoverimg"],["img.none","layout.masonry"],["img.none","type.gallery"],
 ...["grotesk","neogrotesk","didone","fraunces","instrument","mono","syne","bebas","archivo","hand"].map((k): [string, string] => ["typo.pairing","typo."+k]),
 ["style.neobrutal","shape.soft"],
 ["avoid.inter","typo.neogrotesk"],
 ["avoid.glass","style.glass"],["avoid.glass","shape.blur"],
 ["avoid.centered","layout.column"],
 ["avoid.shadow","shape.soft"],["avoid.shadow","shape.round"]
];

export const TENSION: [string, string, string][] = [
 ["perso.calm","perso.playful","rythme posé contre énergie : lequel donne le tempo ?"],
 ["perso.elegant","perso.bold","raffinement discret contre provocation."],
 ["perso.clinical","style.organic","un style fait main adoucit une personnalité clinique."],
 ["perso.serious","style.memphis","le Memphis est ludique par nature."],
 ["perso.serious","style.y2k","l'esthétique Y2K est très décalée pour un ton sérieux."],
 ["perso.elegant","style.neobrutal","le néo-brutalisme est volontairement brut."],
 ["style.brutal","style.glass","le brutalisme refuse l'ornement que le glassmorphism apporte."],
 ["style.brutal","style.neu","le brutalisme refuse les effets de matière du neumorphism."],
 ["style.brutal","style.skeuo","brut et dépouillé contre matières réalistes."],
 ["style.brutal","shape.soft","des ombres douces adoucissent l'aspect brut."],
 ["style.luxe","color.neon","le luxe minimal repose sur des tons sourds."],
 ["style.luxe","color.pastel","le luxe minimal est plutôt sombre et contrasté."],
 ["style.luxe","space.dense","le luxe minimal a besoin d'espace."],
 ["style.term","color.pastel","l'esthétique terminal attend du noir et du phosphore."],
 ["style.term","color.earth","l'esthétique terminal attend du noir et du phosphore."],
 ["style.neu","a11y.contrast","le neumorphism a des contrastes naturellement faibles."],
 ["style.neu","shape.sharp","le neumorphism repose sur des formes arrondies."],
 ["style.glass","shape.hard","ombres dures et transparence floutée se contredisent visuellement."],
 ["style.bento","shape.sharp","les tuiles bento sont généralement arrondies."],
 ["space.airy","layout.bento","le bento condense beaucoup d'informations sur un écran."],
 ["layout.column","space.bleed","colonne étroite contre sections bord à bord : précise où s'applique chacun."],
 ["layout.os","layout.column","un bureau à fenêtres et une colonne de lecture sont deux logiques."],
 ["goal.recruiter","layout.os","un recruteur pressé n'a pas le temps d'explorer des fenêtres."],
 ["goal.recruiter","layout.hscroll","le scroll horizontal ralentit la lecture en diagonale."],
 ["goal.trust","perso.bold","la provocation peut nuire à la confiance."],
 ["a11y.perf","img.video","des vidéos alourdissent le site."],
 ["a11y.perf","img.gen","le WebGL génératif pèse sur les performances."],
 ["avoid.stock","img.flat","des illustrations vectorielles peuvent vite paraître génériques : précise un style."],
 ["avoid.purple","style.dark","le style dark tech utilise souvent un halo violet : précise une autre teinte."],
 ["avoid.purple","color.darkmode","l'accent #7C7CFF de cette palette est violet."]
];

export const VG: Record<string, string> = {
 swiss:`<div class="vg vg-swiss"><i class="sq"></i><b>Studio<br>Portfolio<br>2026</b><span>01 — Travaux</span><span class="n">Paris</span></div>`,
 brutal:`<div class="vg vg-brutal"><b>PORTFOLIO.HTML</b><a>→ projets (12)</a><a>→ contact</a><hr><small>dernière mise à jour : 29/09</small></div>`,
 neobrutal:`<div class="vg vg-neo"><i class="star">✱</i><div class="card"><b>Salut !</b><span class="b2">Voir mes projets →</span></div></div>`,
 neo:`<div class="vg vg-neo"><i class="star">✱</i><div class="card"><b>Salut !</b><span class="b2">Voir mes projets →</span></div></div>`,
 glass:`<div class="vg vg-glass"><i class="o1"></i><i class="o2"></i><div class="g"><b>Portfolio</b><span>Designer produit</span></div></div>`,
 neu:`<div class="vg vg-neu"><div class="k">▶</div><div class="bar"><i></i></div></div>`,
 bento:`<div class="vg vg-bento"><i class="a">Hello, je code.</i><i class="b"></i><i class="c"></i><i class="d"></i><i></i></div>`,
 edito:`<div class="vg vg-edito"><small>N°12 — Automne</small><b>L’art de <em>ralentir</em></b><p>Une sélection de travaux menés entre Paris et Lyon, de l’identité au produit numérique.</p></div>`,
 y2k:`<div class="vg vg-y2k"><b>PORTFOLIO</b><span class="p">★ entrer ★</span></div>`,
 term:`<div class="vg vg-term"><span>~/portfolio $ whoami</span><span>&gt; félix — développeur front</span><span>&gt; 12 projets trouvés</span><span>~/portfolio $ <i></i></span></div>`,
 memphis:`<div class="vg vg-memphis"><i class="zz"></i><i class="ci"></i><i class="tr"></i><b>Hey!</b></div>`,
 organic:`<div class="vg vg-organic"><i class="bl"></i><i class="bl2"></i><b>Bonjour,</b><span>je dessine des interfaces douces.</span></div>`,
 luxe:`<div class="vg vg-luxe"><span>Maison</span><b>Portfolio</b><span>— Est. 2026 —</span></div>`,
 skeuo:`<div class="vg vg-skeuo"><div class="pan"><span class="led"></span><span class="knob"></span><span class="sw">ON</span></div></div>`,
 dark:`<div class="vg vg-dark"><i class="glow"></i><span class="pill">Disponible · 2026</span><b>Construire plus vite.</b><span class="s">Creative developer basé à Lyon</span></div>`,
 bauhaus:`<div class="vg vg-bauhaus"><i class="r"></i><i class="y"></i><i class="b"></i><i class="k">B</i></div>`
};

const t = (w: number): string => `<i class="t" style="width:${w}%"></i>`;
export const WF: Record<string, string> = {
 hero:`<div class="wf" style="grid-template-rows:6px 1fr"><i></i><i class="d" style="position:relative"><i class="T" style="position:absolute;left:10px;bottom:22px;width:60%;background:var(--wf-bg)"></i><i class="t" style="position:absolute;left:10px;bottom:10px;width:35%;background:var(--wf-bg)"></i></i></div>`,
 asym:`<div class="wf" style="grid-template-columns:2fr 1fr;grid-template-rows:1fr 1fr"><i class="d" style="grid-row:span 2"></i><i style="margin:10px 0 0 -14px"></i><i style="margin:0 14px 8px 0"></i></div>`,
 split:`<div class="wf" style="grid-template-columns:1fr 1fr"><i class="col" style="justify-content:center"><i class="T" style="width:80%"></i>${t(90)}${t(70)}${t(40)}</i><i class="col"><i class="d" style="flex:1"></i><i class="d" style="flex:1"></i><i style="flex:.4"></i></i></div>`,
 bento:`<div class="wf" style="grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(3,1fr)"><i class="d" style="grid-column:span 2;grid-row:span 2;border-radius:8px"></i><i style="border-radius:8px"></i><i class="hl" style="border-radius:8px"></i><i style="grid-column:span 2;border-radius:8px"></i><i style="border-radius:8px"></i><i style="grid-column:span 2;border-radius:8px"></i><i class="d" style="border-radius:8px"></i></div>`,
 hscroll:`<div class="wf" style="grid-template-rows:auto 1fr"><i class="T" style="width:40%"></i><i class="row" style="overflow:hidden"><i class="d" style="flex:0 0 42%"></i><i style="flex:0 0 42%"></i><i class="d" style="flex:0 0 42%"></i></i></div>`,
 masonry:`<div class="wf" style="grid-template-columns:repeat(3,1fr)"><i class="col"><i class="d" style="height:60px"></i><i style="height:40px"></i></i><i class="col"><i style="height:30px"></i><i class="d" style="height:70px"></i></i><i class="col"><i class="d" style="height:45px"></i><i style="height:55px"></i></i></div>`,
 xxl:`<div class="wf" style="align-content:center"><i class="d" style="height:34px;width:100%"></i><i class="d" style="height:34px;width:72%"></i><i class="t" style="width:30%;margin-top:4px"></i></div>`,
 column:`<div class="wf" style="justify-items:center;align-content:center"><i class="T" style="width:46%"></i>${t(50)}${t(50)}${t(50)}${t(44)}${t(50)}${t(30)}</div>`,
 os:`<div class="wf" style="display:block"><i style="position:absolute;left:12px;top:14px;width:55%;height:70px;border:1px solid var(--wf-d);background:var(--wf-bg)"><i class="d" style="height:9px;border-radius:0"></i></i><i style="position:absolute;left:38%;top:44px;width:55%;height:72px;border:1px solid var(--wf-d);background:var(--wf-bg)"><i class="hl" style="height:9px;border-radius:0"></i></i><i class="d" style="position:absolute;left:12px;bottom:10px;width:12px;height:12px"></i><i class="d" style="position:absolute;left:30px;bottom:10px;width:12px;height:12px"></i></div>`,
 sidebar:`<div class="wf" style="grid-template-columns:32% 1fr"><i class="col" style="background:var(--wf-b);padding:6px"><i class="T" style="width:80%;background:var(--wf-d)"></i><i class="t" style="width:60%;background:var(--wf-d)"></i><i class="t" style="width:50%;background:var(--wf-d)"></i><i class="t" style="width:55%;background:var(--wf-d)"></i></i><i class="col"><i class="d" style="flex:1"></i><i class="d" style="flex:1"></i></i></div>`,
 index:`<div class="wf" style="align-content:center;gap:9px"><i class="row" style="gap:10px;align-items:center"><i class="t" style="width:6%"></i><i class="T" style="width:48%;height:9px"></i></i><i class="row" style="gap:10px;align-items:center"><i class="t hl" style="width:6%"></i><i class="T hl" style="width:58%;height:9px"></i></i><i class="row" style="gap:10px;align-items:center"><i class="t" style="width:6%"></i><i class="T" style="width:40%;height:9px"></i></i><i class="row" style="gap:10px;align-items:center"><i class="t" style="width:6%"></i><i class="T" style="width:52%;height:9px"></i></i><i class="d" style="position:absolute;right:18px;top:30px;width:60px;height:44px;transform:rotate(4deg);box-shadow:0 6px 14px rgba(0,0,0,.2)"></i></div>`,
 stack:`<div class="wf" style="display:block"><i style="position:absolute;left:14%;right:14%;top:14px;height:70px"></i><i class="d" style="position:absolute;left:12%;right:12%;top:30px;height:70px"></i><i class="hl" style="position:absolute;left:10%;right:10%;top:46px;height:74px"></i></div>`,
 airy:`<div class="wf" style="align-content:center;justify-items:center;gap:12px"><i class="T" style="width:30%"></i>${t(20)}</div>`,
 dense:`<div class="wf" style="grid-template-columns:repeat(4,1fr);gap:3px">${Array.from({length:16},(_,i)=>`<i class="${i%5===0?'d':''}"></i>`).join('')}</div>`,
 grid12:`<div class="wf" style="grid-template-columns:repeat(12,1fr);gap:3px;background-image:repeating-linear-gradient(90deg,var(--wf-b) 0 1px,transparent 1px calc(100%/12))"><i class="d" style="grid-column:1/8;height:30px;align-self:end"></i><i style="grid-column:9/13;height:60px"></i><i class="hl" style="grid-column:4/11;height:14px;align-self:start"></i></div>`,
 scale8:`<div class="wf" style="display:flex;align-items:flex-end;gap:6px;padding-bottom:18px">${[8,16,24,32,48,64,96].map(h=>`<i class="d" style="width:12%;height:${h}px"></i>`).join('')}</div>`,
 measure:`<div class="wf" style="align-content:center;padding-left:18px">${t(62)}${t(64)}${t(60)}${t(63)}${t(40)}<i class="hl" style="position:absolute;left:calc(18px + 64% - 8px);top:10px;bottom:10px;width:1px"></i></div>`,
 bleed:`<div class="wf" style="padding:0;grid-template-rows:1fr 30px 1fr;gap:0"><i class="d" style="border-radius:0"></i><i style="background:transparent;padding:8px 10px"><i class="t" style="width:40%"></i></i><i style="border-radius:0"></i></div>`,
 narrow:`<div class="wf" style="justify-items:center;align-content:center"><i style="width:44%;height:100%;background:var(--wf-b);display:flex;flex-direction:column;gap:5px;padding:8px"><i class="T" style="width:70%"></i><i class="t" style="background:var(--wf-d)"></i><i class="t" style="background:var(--wf-d)"></i><i class="t" style="width:60%;background:var(--wf-d)"></i></i></div>`,
 rhythm:`<div class="wf" style="grid-template-rows:1fr 2fr 1fr;gap:4px"><i class="row" style="gap:3px"><i style="flex:1"></i><i style="flex:1"></i><i style="flex:1"></i><i style="flex:1"></i></i><i class="d"></i><i class="row" style="gap:3px"><i style="flex:1"></i><i style="flex:1"></i><i style="flex:1"></i></i></div>`
};

export const REFV: Record<string, string> = {
 constr:`<div class="rf rf-constr"><i class="ci"></i><b class="band">En avant !</b><i class="thin"></i></div>`,
 swissposter:`<div class="rf rf-swiss"><i class="rings"></i><i class="dot"></i><b>Musica<br>Viva</b><span>Tonhalle — 1960</span></div>`,
 mag:`<div class="rf rf-mag"><p class="txt">La lumière entre par la gauche. Le reste est affaire de patience et de papier.</p><figure><i class="img"></i><figcaption>Atelier, Lyon — 2025</figcaption></figure><span class="folio">42 — PORTFOLIO</span></div>`,
 awwwards:`<div class="rf rf-aww"><div class="an"><span>Studio</span><span>Index (12)</span><span>Contact</span></div><i class="card"></i><i class="cur"></i><b>WORK</b></div>`,
 os:`<div class="rf rf-os"><div class="win"><div class="tb">portfolio.exe <i>✕</i></div><div class="bd">Bienvenue dans mon portfolio.<br><span class="bt">Ouvrir</span></div></div><span class="ico">Projets</span></div>`,
 cinema:`<div class="rf rf-cine"><small>Un film de</small><b>Portfolio</b><small>En salle — 2026</small></div>`,
 japan:`<div class="rf rf-jp"><i class="sun"></i><span class="v">デザイン展</span><p class="blk">2026.10.04 — 11.30<br>東京 / Tokyo<br>Graphic design exhibition. Open 10:00–18:00.</p></div>`,
 nasa:`<div class="rf rf-nasa"><i class="stripe"></i><span class="hd">SECT. 1.4 — GRAPHISME</span><i class="c"></i><i class="ln l1"></i><i class="ln l2"></i><span class="lb b1">01 RAYON</span><span class="lb b2">02 AXE</span><span class="ref">RÉF. 1430.2-A</span></div>`,
 zine:`<div class="rf rf-zine"><i class="photo"></i><i class="tape t1"></i><i class="tape t2"></i><p class="cut"><span>M</span><span>O</span><span>N</span><br><span>Z</span><span>I</span><span>N</span><span>E</span></p></div>`,
 museum:`<div class="rf rf-mus"><i class="art"></i><p class="lab"><b>12</b><br><i>Sans titre (bleu)</i>, 1968<br>Huile sur toile<br>Don de l’artiste</p></div>`
};

export const ICO: Record<string, string> = {
 home:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
 search:'<circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L21 21"/>',
 mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
 heart:'<path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 5.65-7 10-7 10z"/>',
 arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>'
};

export const ICO_FILL: Record<string, string> = {
 home:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" fill="currentColor"/>',
 search:'<circle cx="10.5" cy="10.5" r="7.5" fill="currentColor"/><path d="M16 16l5 5" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/>',
 mail:'<rect x="2.5" y="4.5" width="19" height="15" rx="3" fill="currentColor"/><path d="M5 8l7 5 7-5" fill="none" stroke="var(--wf-bg)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
 heart:'<path d="M12 21s-8-4.8-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.2-8 11-8 11z" fill="currentColor"/>',
 arrow:'<circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M7 12h10M13 8l4 4-4 4" fill="none" stroke="var(--wf-bg)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
};

export const icoRow = (set: Record<string, string>, line?: boolean): string => Object.values(set).map(p=>`<svg viewBox="0 0 24 24" width="30" height="30" ${line?'fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"':''}>${p}</svg>`).join('');

export const IMGV: Record<string, string> = {
 bw:`<div class="iv iv-bw"><i class="head"></i><i class="body"></i><span>© Portrait, 2026</span></div>`,
 mockup:`<div class="iv iv-mock"><div class="br"><div class="bb"><i></i><i></i><i></i><span>monsite.fr</span></div><div class="bs"><b></b><em></em><em></em><u></u></div></div><div class="ph"><b></b><em></em><em></em></div></div>`,
 "3d":`<div class="iv iv-3d"><i class="s1"></i><i class="s2"></i><i class="cube"></i><i class="sh"></i></div>`,
 flat:`<div class="iv iv-flat"><svg viewBox="0 0 220 130" preserveAspectRatio="xMidYMid slice"><rect width="220" height="130" fill="#FCE9D8"/><circle cx="160" cy="44" r="22" fill="#F4A259"/><path d="M0 100 Q55 58 110 92 T220 80 V130 H0Z" fill="#5B8E7D"/><path d="M0 112 Q70 86 140 108 T220 104 V130 H0Z" fill="#2F5D50"/><rect x="48" y="66" width="6" height="26" fill="#6B4226"/><circle cx="51" cy="60" r="15" fill="#8CB369"/><path d="M120 40 l10 -6 l10 6" fill="none" stroke="#2F5D50" stroke-width="2" stroke-linecap="round"/></svg></div>`,
 gen:`<div class="iv iv-gen"><i class="g1"></i><i class="g2"></i><i class="g3"></i></div>`,
 none:`<div class="iv iv-none"><b>Aucune<br>image.</b><span>Juste des mots, bien placés.</span></div>`,
 line:`<div class="iv iv-ico">${icoRow(ICO,true)}</div>`,
 filled:`<div class="iv iv-ico">${icoRow(ICO_FILL,false)}</div>`,
 ascii:`<div class="iv iv-ascii"><pre>+----------------+
|   PORTFOLIO    |
+----------------+
    /\\_/\\
   ( o.o )  hello
    &gt; ^ &lt;</pre></div>`,
 video:`<div class="iv iv-video"><i class="scene"></i><i class="play"></i><span class="vtc">0:07 / 0:12</span><span class="mute">muet</span><i class="pbar"><b></b></i></div>`,
 collage:`<div class="iv iv-col"><i class="p1"></i><i class="p2"></i><i class="torn"></i><i class="cir"></i><i class="tp"></i><b>Travaux</b></div>`
};

export const DEMO: Record<string, string> = {
 magnetic:`<div class="dm"><span class="hint">approche le curseur</span><button class="mag" type="button" tabindex="-1">Me contacter</button></div>`,
 cursor:`<div class="dm dm-cur"><span class="hint">bouge dans la zone</span><span class="cur"></span><span class="lk">Voir le projet</span></div>`,
 reveal:`<div class="dm in" data-replay><span class="hint">survole pour rejouer</span><div class="rv"><span><b>Design</b></span><span><b>&amp; code,</b></span><span><b>depuis 2019.</b></span></div></div>`,
 stagger:`<div class="dm in" data-replay><span class="hint">survole pour rejouer</span><div class="stg">${'<i></i>'.repeat(8)}</div></div>`,
 hoverimg:`<div class="dm"><span class="fl"></span><ul class="hl-list"><li data-c="#D8431F">Nébula <span>2026</span></li><li data-c="#2F6B4F">Atelier Brun <span>2025</span></li><li data-c="#3B4CCA">Orbit App <span>2024</span></li><li data-c="#C99A2E">Folio <span>2023</span></li></ul></div>`,
 marquee:`<div class="dm"><div class="mq"><div>Disponible pour projets<span>✦</span>Design<span>✦</span>Code<span>✦</span>Disponible pour projets<span>✦</span>Design<span>✦</span>Code<span>✦</span></div></div></div>`,
 underline:`<div class="dm"><span class="hint">survole</span><span class="ul">Travaux choisis</span></div>`,
 tilt:`<div class="dm"><span class="hint">bouge sur la carte</span><div class="tc">Projet 01</div></div>`,
 scramble:`<div class="dm"><span class="hint">survole</span><span class="scr" data-t="CREATIVE DEV">CREATIVE DEV</span></div>`,
 pagetr:`<div class="dm"><div class="pgt"><span class="pg">Accueil</span><button class="go" type="button">Changer de page →</button></div><span class="curtain"></span></div>`,
 parallax:`<div class="dm"><span class="hint">bouge dans la zone</span><div class="px"><i class="l1" data-d="6"></i><i class="l2" data-d="16"></i><i class="l3" data-d="28"></i><b data-d="-10">Profondeur</b></div></div>`,
 micro:`<div class="dm"><span class="hint">clique</span><button class="mb" type="button">Envoyer</button></div>`,
 sticky:`<div class="dm dm-sticky"><span class="hint" style="position:sticky;display:block;z-index:3">scrolle dedans ↓</span><div class="stk"><div>Projet 01</div><div>Projet 02</div><div>Projet 03</div></div></div>`,
 timing:`<div class="dm"><span class="hint">survole</span><div class="tm"><span>linear</span><div class="tr"><i></i></div><span>cubic-bezier(.22,1,.36,1)</span><div class="tr e"><i></i></div></div></div>`
};

export const TIPS: Tip[] = [
 {k:"values",t:"Des valeurs plutôt que des adjectifs",d:"« Coloré » laisse l’IA deviner. « Fond #F4EFE6, accent #E8672A utilisé sur 10 % de la surface » ne lui laisse aucune marge d’interprétation.",p:"Respecte à la lettre les valeurs précises données (codes hex, tailles, durées) : ne les réinterprète pas."},
 {k:"concept",t:"Une idée forte par direction",d:"Chaque version doit reposer sur un concept unique (« le portfolio est un magazine », « le site est un OS »). Tout le reste en découle.",p:"Construis chaque direction autour d'un concept fort et unique (par exemple « le portfolio est un magazine ») dont découlent tous les choix."},
 {k:"variants",t:"Demande des variantes contrastées",d:"Plusieurs directions très différentes t'aident à comparer et à choisir, au lieu d'accepter la première proposition.",p:"Propose 3 directions radicalement différentes (une sobre, une expérimentale, une ludique) qui ne partagent ni palette ni typographie."},
 {k:"content",t:"Du contenu réaliste",d:"Avec du lorem ipsum, le design reste fictif et générique. Idéalement, colle ensuite tes vrais textes et projets à la suite du prompt.",p:"Utilise un contenu réaliste et crédible, jamais de lorem ipsum ; je remplacerai ensuite par mes vrais textes et projets."},
 {k:"iterate",t:"Itère un paramètre à la fois",d:"Une fois une direction choisie, ne change qu’un paramètre à la fois (la typo, puis les couleurs…) pour comprendre l’effet de chacun.",p:"Rends chaque paramètre clairement identifiable dans le résultat : je ferai ensuite varier un seul paramètre à la fois."},
 {k:"antipatterns",t:"Nomme les anti-patterns",d:"L’IA revient à ses réflexes si tu ne les interdis pas explicitement. Cette consigne complète la section « À éviter ».",p:"Si un choix te pousse vers un réflexe générique (dégradé violet, grille de cartes identiques, hero centré), écarte-le et propose mieux."},
 {k:"justify",t:"Demande de justifier les choix",d:"Expliquer pourquoi les choix servent l'objectif force une cohérence entre les paramètres.",p:"Avant de générer, explique en 3 lignes comment tes choix servent l'objectif."},
 {k:"refs",t:"Montre, ne décris pas seulement",d:"Si l’outil l’accepte, joins des captures de sites que tu aimes en précisant ce que tu en retiens (la typo, pas les couleurs, par exemple).",p:"Si je joins des captures de référence, n'en retiens que l'aspect que je précise, sans les copier."}
];

export const AX: Record<string, number[]> = {
 serious:[-.8,-.2,.2,-.3,-.4], playful:[.9,.3,-.3,.4,.6], warm:[.2,.1,-.9,-.1,0], clinical:[-.6,-.6,.9,.1,-.3],
 elegant:[-.4,-.7,.1,-.4,-.7], bold:[.3,.5,.2,.8,.9], calm:[-.3,-.6,-.4,-.2,-.8], geek:[.6,.4,0,.5,.3],
 craft:[.2,.2,-.8,.2,-.2], futur:[-.1,.4,.5,.9,.7]
};

export const TAGS: Record<string, Record<string, string>> = {
 type:{creative:"tech",gallery:"edito calm",blog:"edito",dashboard:"tech swiss"},
 goal:{memorable:"fun",trust:"swiss",skill:"tech",agency:"edito"},
 perso:{serious:"swiss edito",playful:"fun",warm:"warm",clinical:"tech swiss",elegant:"luxe edito calm",bold:"fun",calm:"calm warm luxe",geek:"tech retro fun",craft:"warm retro",futur:"tech"},
 style:{swiss:"swiss",brutal:"retro swiss",neobrutal:"fun retro",glass:"tech",neu:"calm",bento:"tech swiss",edito:"edito",y2k:"fun retro",term:"tech retro",memphis:"fun retro",organic:"warm",luxe:"luxe calm",skeuo:"retro",dark:"tech",bauhaus:"swiss retro"},
 refs:{constr:"swiss retro",swissposter:"swiss",mag:"edito",awwwards:"tech",os:"retro fun",cinema:"luxe calm",japan:"calm swiss",nasa:"tech swiss",zine:"fun retro warm",museum:"edito calm"},
 layout:{hero:"tech luxe",asym:"swiss edito",split:"edito",bento:"tech fun",hscroll:"tech",masonry:"warm edito",xxl:"swiss fun",column:"edito calm",os:"retro fun",sidebar:"swiss",index:"swiss edito",stack:"tech"},
 space:{airy:"calm luxe edito",dense:"tech fun",grid12:"swiss",scale8:"swiss tech",measure:"edito",bleed:"tech luxe",narrow:"edito calm",rhythm:"edito"},
 typo:{grotesk:"tech fun",neogrotesk:"swiss",didone:"edito luxe",fraunces:"warm edito",instrument:"luxe edito calm",mono:"tech retro",syne:"fun",bebas:"fun retro",archivo:"fun",hand:"warm",pairing:"edito luxe",scale:"swiss edito"},
 color:{monoaccent:"swiss",pastel:"fun warm calm",neon:"tech fun",earth:"warm",bw:"swiss edito",navy:"edito",duotone:"fun swiss",darkmode:"tech","603010":"warm edito",gradient:"fun tech"},
 shape:{sharp:"swiss edito",round:"warm calm",pill:"fun tech",thick:"fun retro",hard:"fun retro",soft:"calm tech",grain:"warm edito",blur:"tech",paper:"warm retro",hair:"swiss tech",mix:"fun"},
 img:{bw:"edito luxe",mockup:"tech",'3d':"fun tech",flat:"warm fun",gen:"tech",none:"swiss edito",line:"tech swiss",filled:"fun",ascii:"retro tech",video:"tech",collage:"retro fun warm"},
 inter:{magnetic:"tech",cursor:"tech fun",reveal:"edito luxe",stagger:"fun",hoverimg:"edito swiss",marquee:"fun",underline:"edito luxe calm",tilt:"fun tech",scramble:"tech retro",pagetr:"tech luxe",parallax:"tech",micro:"fun",sticky:"tech",timing:"calm"}
};

export const RAND: Record<string, number | [number, number]> = {type:1,goal:1,perso:1,style:[1,2],refs:1,layout:[1,2],space:1,typo:[1,2],color:1,shape:2,img:1,inter:[2,3],a11y:3,avoid:4};

