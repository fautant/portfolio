# CLAUDE.md - Portfolio Félix AUTANT

## 👤 About the Developer

**Félix AUTANT** - Développeur Web Fullstack  
3ème année en Informatique  
Spécialisation : Développement Web (Symfony, Laravel)

## 🎯 Project Overview

Portfolio personnel interactif et multilingue (FR/EN) présentant mes compétences, projets et offrant une plateforme de contact pour des opportunités de collaboration freelance.

### Objectifs

- Présenter mes compétences techniques en développement web fullstack
- Mettre en avant mes projets GitHub
- Faciliter la prise de contact (recruteurs, clients freelance)
- Optimiser le référencement pour être visible par les recruteurs (SEO)
- Offrir une expérience utilisateur moderne et animée

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS + Framer Motion (animations)
- **UI Components**: shadcn/ui (système de design cohérent)
- **Internationalisation**: next-intl (gestion FR/EN)
- **Icons**: Lucide React

### Backend & Services

- **Auth**: Better-Auth (gestion sessions, OAuth optionnel)
- **Database**: Supabase (PostgreSQL)
    - Table: `contact_messages` (formulaire de contact)
    - Table: `project_proposals` (demandes de collaboration)
    - Table: `newsletter_subscribers` (optionnel)
- **Email**: Resend (envoi d'emails transactionnels)
- **Payments**: Stripe via Better-Auth plugin (si services payants)
- **Analytics**: Vercel Analytics (tracking visiteurs)

### Deployment

- **Hosting**: Vercel (plan gratuit suffisant initialement)
- **CDN**: Vercel Edge Network
- **Domain**: Nom de domaine personnalisé recommandé

### Developer Tools

- **TypeScript**: Strict mode activé
- **ESLint**: Configuration Next.js + règles custom
- **Prettier**: Formatage automatique du code
- **Husky**: Pre-commit hooks pour qualité du code

## 📂 Architecture

```
/app
  /(locale)           # Routes internationalisées
    /[locale]
      /page.tsx       # Homepage avec hero, compétences, projets
      /projects       # Liste complète des projets
      /contact        # Formulaire de contact
      /proposal       # Formulaire proposition de projet freelance
      /cv             # CV téléchargeable (PDF)
  /api
    /contact          # Endpoint formulaire contact
    /proposal         # Endpoint proposition projet
    /newsletter       # Endpoint inscription newsletter (optionnel)
/components
  /sections           # Sections réutilisables (Hero, Skills, Projects)
  /ui                 # Composants shadcn/ui
  /forms              # Formulaires (Contact, Proposal)
  /animations         # Composants animés (Framer Motion)
/lib
  /supabase          # Client Supabase
  /resend            # Client Resend
  /better-auth       # Configuration Better-Auth
  /utils             # Fonctions utilitaires
/public
  /cv                # CV PDF (versions FR/EN)
  /projects          # Images/assets des projets
  /icons             # Favicons, logos
/messages
  /en.json           # Traductions anglaises
  /fr.json           # Traductions françaises
```

## 🎨 Design & Theme

### Palette de Couleurs (inspirée du CV)

- **Primary (Rose)**: `#FF5C93` - Boutons principaux, liens, éléments interactifs
- **Secondary (Orange)**: `#FF9357` - Sections headers, badges de compétences
- **Accent (Jaune/Gold)**: `#E8B844` - Highlights, hover states, animations
- **Background Light**: `#F5E6D3` - Fond clair (mode light)
- **Background Dark**: `#1A1A1A` - Fond sombre (mode dark)
- **Text Dark**: `#4A4A4A` - Texte principal
- **Text Light**: `#F5F5F5` - Texte sur fond sombre

**Design System**:

- Thème **dual mode** : Light (beige/crème) et Dark (avec accents colorés)
- **Dégradés** : Utiliser des transitions entre rose → orange → jaune
- **Formes organiques** : Cercles et courbes comme dans le CV
- **Typographie** : Police moderne et lisible (Inter, Poppins, ou Manrope)

### Animations

- **Scroll Animations**: Apparition progressive des sections (Framer Motion)
- **Hover Effects**: Survol des cartes projets, boutons
- **Page Transitions**: Transitions fluides entre pages
- **Micro-interactions**: Animations sur formulaires, boutons

### Sections Portfolio

1. **Hero Section**
    - **Titre principal**: "Félix AUTANT" avec effet typing animé
    - **Sous-titre**: "Développeur Junior Fullstack"
    - **Tagline**: "Spécialisé en Symfony & Laravel • Étudiant en 3ème année à l'IUT Informatique d'Anglet"
    - Photo professionnelle (celle du CV avec fond rose/jaune)
    - **CTAs principaux**:
        - "Voir mes projets" (bouton rose #FF5C93)
        - "Me contacter" (bouton orange #FF9357)
        - "Télécharger CV" (bouton outline jaune #E8B844)
    - Animation typing effect pour: "Symfony • Laravel • Next.js • Android"
    - Formes organiques en arrière-plan (cercles rose/jaune comme le CV)
    - Particles.js subtiles pour dynamisme

2. **Skills Section**
    - **Langages**: HTML, CSS, JavaScript, TypeScript, PHP, Java, C++, C, Python, SQL, NoSQL, Docker, Git
    - **Frameworks Backend**: Symfony ⭐, Laravel ⭐, Angular
    - **Frontend**: React, Next.js, Tailwind CSS, Bootstrap, TWIG
    - **Mobile**: Android Studio (Java & SQL)
    - **Outils DevOps**: Docker, Git, GitHub, PHPMyAdmin, Trello, MySQL
    - **Soft Skills**: Esprit d'équipe, Organisé, Adaptabilité
    - Visualisation avec badges animés colorés (rose/orange/jaune)
    - Niveau de maîtrise visible avec étoiles ou barres
    - Catégorisation claire: Backend (Symfony/Laravel), Frontend, Mobile, DevOps

3. **Projects Section**
    - Projets mis en avant (exemples de votre CV):
        - **Jeewago** - Site d'analyse HBJO (PHP, SQL, HTML, CSS, JS)
        - **TimeHarmony** - App web de gestion d'agendas (PHP, HTML, CSS, JS, Bootstrap, TWIG, MySQL)
        - **App Android** - Gestion de plats et recettes (Java & SQL)
        - **Lecteur de diaporama** - Application logicielle (C++ & SQL, Qt Creator)
        - **Déploiement Docker** - Laravel avec MySQL (Dockerfiles, docker-compose)
    - Cards interactives avec image, description courte, stack technique
    - Liens vers GitHub et démos live (si disponibles)
    - Filtres par technologie (Symfony, Laravel, Android, etc.)
    - Animation au survol avec effet de lift et dégradé rose→orange

4. **Contact Section**
    - Formulaire avec validation Zod (nom, email, message, type de demande)
    - Email direct visible: **autantfelix@gmail.com**
    - Téléphone: **06 02 27 92 83**
    - Localisation: Anglet (64600), France
    - Liens vers réseaux sociaux:
        - GitHub avec icône
        - LinkedIn avec icône
        - (optionnel) Portfolio de photographie si souhaité

5. **Proposal Section** (Freelance)
    - Formulaire dédié projets freelance
    - Champs: budget estimé, deadline, description détaillée
    - Upload de fichiers (brief projet)

6. **CV Download**
    - Bouton téléchargement CV PDF
    - Versions FR et EN disponibles

## 🚀 Commands

```bash
# Development
pnpm dev              # Start dev server (localhost:3000)
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm type-check       # Check TypeScript errors

# Database (Supabase)
pnpm db:push          # Push schema changes to Supabase
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed database with initial data

# Testing
pnpm test             # Run unit tests (Vitest)
pnpm test:e2e         # Run E2E tests (Playwright)
pnpm test:coverage    # Generate coverage report

# Code Quality
pnpm format           # Format code with Prettier
pnpm format:check     # Check formatting without changes
```

## 📋 Environment Variables

```env
# Next.js
NEXT_PUBLIC_SITE_URL=https://felixautant.dev

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Resend (Email)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=contact@felixautant.dev

# Better-Auth
BETTER_AUTH_SECRET=your_secret_key_here
BETTER_AUTH_URL=https://felixautant.dev

# Stripe (si nécessaire)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Analytics (optionnel)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id
```

## 💻 Code Style & Conventions

### TypeScript

- **Strict mode** activé dans `tsconfig.json`
- Types explicites pour toutes les fonctions et composants
- Éviter `any`, préférer `unknown` si type inconnu
- Utiliser interfaces pour objets, types pour unions/intersections

### React/Next.js

- **Server Components** par défaut (Next.js 16)
- Client Components uniquement si interactivité nécessaire (`'use client'`)
- Named exports préférés aux default exports
- Composants fonctionnels uniquement (pas de class components)
- Hooks personnalisés dans `/hooks` avec préfixe `use`

### Async/Await

- Préférer `async/await` aux callbacks
- Gérer les erreurs avec `try/catch`
- Utiliser `Promise.all()` pour requêtes parallèles

### Naming Conventions

- **Components**: PascalCase (`ContactForm.tsx`)
- **Functions**: camelCase (`handleSubmit`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- **Files**: kebab-case pour pages (`contact-form.tsx`)

### CSS/Tailwind

- Utiliser Tailwind classes plutôt que CSS custom
- Créer des variants dans `tailwind.config.ts` pour styles réutilisables
- Éviter les classes inline trop longues (extraire en composants)

## 🚨 Common Mistakes to Avoid

### Security

- ❌ **Ne JAMAIS exposer les clés API côté client**
    - Utiliser variables d'environnement `NEXT_PUBLIC_` uniquement pour clés publiques
    - Garder clés secrètes (Supabase service role, Resend) côté serveur uniquement
- ❌ **Ne pas utiliser Better-Auth credentials sans HTTPS**
    - Toujours utiliser HTTPS en production
- ❌ **Ne pas valider les inputs uniquement côté client**
    - Valider AUSSI côté serveur (API routes)

### Next.js 16 Specifics

- ✅ Utiliser **proxy.ts** pour protection des routes API
- ✅ Utiliser Server Actions pour mutations (au lieu d'API routes si possible)
- ✅ Optimiser images avec `next/image` (pas `<img>`)
- ✅ Utiliser `loading.tsx` pour suspense automatique

### Database (Supabase)

- ❌ Ne pas exposer la `service_role_key` côté client
- ✅ Utiliser Row Level Security (RLS) sur Supabase
- ✅ Créer des indexes pour requêtes fréquentes

### Emails (Resend)

- ❌ Ne pas envoyer d'emails depuis le client
- ✅ Toujours envoyer depuis API routes ou Server Actions
- ✅ Valider emails avec regex avant envoi
- ✅ Rate limiting sur endpoints d'envoi d'emails

### Internationalisation

- ✅ Toujours passer par `messages/[locale].json` (jamais de texte hardcodé)
- ✅ Utiliser `next-intl` hooks dans composants clients
- ✅ Gérer le fallback vers FR si locale non supportée

### Performance

- ✅ Lazy load composants lourds avec `dynamic()`
- ✅ Utiliser `loading.tsx` pour feedback utilisateur
- ✅ Optimiser images (WebP, lazy loading)
- ✅ Minimiser les requêtes Supabase (batching, caching)

## 🧪 Testing Strategy

### Unit Tests (Vitest)

- Tester fonctions utilitaires (`/lib/utils`)
- Tester validation de formulaires
- Tester formatage de données
- Coverage minimum: 80%

### Component Tests (Vitest + React Testing Library)

- Tester interactions formulaires
- Tester affichage conditionnel
- Tester appels API mockés

### E2E Tests (Playwright)

- Parcours complet: Homepage → Projects → Contact
- Test formulaire contact (soumission succès/erreur)
- Test formulaire proposition freelance
- Test téléchargement CV
- Test changement de langue FR/EN
- Test responsive (mobile, tablet, desktop)

### Test avant implémentation (TDD)

```bash
# 1. Écrire le test
pnpm test contact-form.test.ts

# 2. Implémenter la feature
# ...

# 3. Vérifier que le test passe
pnpm test contact-form.test.ts
```

## 📊 SEO Optimization (pour recruteurs)

### Metadata essentiels

```typescript
// app/layout.tsx
export const metadata = {
    title: 'Félix AUTANT - Développeur Web Fullstack | Symfony, Laravel, Next.js',
    description:
        'Portfolio de Félix AUTANT, développeur web fullstack spécialisé en Symfony et Laravel. Étudiant en 3ème année informatique, disponible pour projets freelance.',
    keywords: [
        'développeur fullstack',
        'symfony',
        'laravel',
        'nextjs',
        'portfolio développeur',
        'freelance développeur web',
    ],
    authors: [{ name: 'Félix AUTANT' }],
    openGraph: {
        title: 'Félix AUTANT - Développeur Web Fullstack',
        description: 'Portfolio et projets de développement web',
        url: 'https://felixautant.dev',
        siteName: 'Portfolio Félix AUTANT',
        images: [{ url: '/og-image.png' }],
        locale: 'fr_FR',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Félix AUTANT - Développeur Web Fullstack',
        description: 'Portfolio et projets de développement web',
        images: ['/og-image.png'],
    },
};
```

### Structured Data (JSON-LD)

- Ajouter schema.org Person
- Ajouter schema.org WebSite
- Ajouter schema.org CreativeWork pour projets

### Sitemap & robots.txt

- Générer sitemap.xml automatiquement
- Configurer robots.txt pour crawler Google

### Performance

- Lighthouse score > 90 sur toutes métriques
- Core Web Vitals optimisés

## 🎓 Symfony & Laravel Integration

Bien que le portfolio soit en Next.js, tu peux mettre en avant tes compétences Symfony/Laravel:

### Projets à afficher

- Liste projets GitHub avec stack technique visible
- Démos live hébergées (si possible)
- Code snippets dans sections projets

### Blog technique (optionnel)

- Articles sur Symfony/Laravel best practices
- Tutoriels de développement
- Cas d'usage réels

## 📝 Content Suggestions

### Sections "À propos"

- **Parcours académique**:
    - BUT Informatique (3ème année) - IUT Informatique à Anglet (2023-2026)
    - BAC STI2D option Système d'Information et Numérique - Lycée privé La Salle à Alès (2021)
    - Mention Assez Bien
    - Permis B
- **Compétences techniques détaillées**:
    - **Backend**: Symfony (expert), Laravel (expert), PHP
    - **Frontend**: HTML, CSS, JavaScript, TypeScript, Angular, React, Next.js
    - **Mobile**: Android Studio (Java & SQL)
    - **DevOps**: Docker, Git, GitHub
    - **Bases de données**: MySQL, SQL, NoSQL
    - **Outils**: PHPMyAdmin, Trello, Qt Creator
- **Expériences** (stages, projets):
    - Développeur Fullstack chez Jeewago à Anglet (Avril-Juin 2025)
    - Multiples projets web, mobile et logiciels
    - Déploiement d'applications avec Docker
- **Centres d'intérêt**:
    - 📸 **Photographie** (passion principale)
    - 🏃 **Randonnée**
    - 📚 **Lecture**
    - Section dédiée avec icônes et photos personnelles si souhaité

- **Soft Skills**:
    - Esprit d'équipe
    - Organisé
    - Adaptabilité
- **Langues**:
    - Français (natif)
    - Anglais (B2)

### Projets à mettre en avant

Pour chaque projet:

- **Titre & Description**: Problème résolu
- **Stack technique**: Techno utilisées
- **Rôle**: Ta contribution spécifique
- **Résultats**: Métriques ou impact
- **Liens**: GitHub + démo live

### Call-to-Actions

- "Télécharger mon CV"
- "Voir mes projets"
- "Me contacter"
- "Proposer un projet freelance"

## 🚀 Deployment Checklist

### Avant le déploiement

- [ ] Toutes les variables d'environnement configurées sur Vercel
- [ ] Base de données Supabase en production créée
- [ ] Domaine personnalisé configuré (recommandé)
- [ ] Analytics Vercel activées
- [ ] Tests E2E passent tous
- [ ] Lighthouse score > 90
- [ ] SEO metadata complets
- [ ] Sitemap généré
- [ ] CV PDF uploadés (FR + EN)
- [ ] Images optimisées (WebP)

### Après le déploiement

- [ ] Tester tous les formulaires en production
- [ ] Vérifier réception emails (Resend)
- [ ] Tester changement de langue
- [ ] Vérifier responsive sur vrais devices
- [ ] Soumettre sitemap à Google Search Console
- [ ] Partager portfolio sur LinkedIn, GitHub

## 📚 Resources & Documentation

- [Next.js 16 Docs](https://nextjs.org/docs)
- [Better-Auth Guide](https://better-auth.com)
- [Supabase Docs](https://supabase.com/docs)
- [Resend API Reference](https://resend.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Vercel Deployment](https://vercel.com/docs)

## 📄 License

Ce portfolio est sous license MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

**Contact**: [autantfelix@gmail.com](mailto:autantfelix@gmail.com)  
**Téléphone**: 06 02 27 92 83  
**Adresse**: 55 rue de Mirambeau, 64600 Anglet  
**GitHub**: [github.com/felixautant](https://github.com/felixautant)  
**LinkedIn**: [linkedin.com/in/felixautant](https://linkedin.com/in/felixautant)

---

_Dernière mise à jour: Janvier 2026_
