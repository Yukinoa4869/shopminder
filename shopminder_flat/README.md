# ShopMinder 🛒

Application de listes de courses intelligentes construite avec Next.js, Supabase et Tailwind CSS.

## Fonctionnalités

- ✅ Créer et gérer plusieurs listes de courses
- ✅ Catégoriser les articles par rayons de magasin
- ✅ Marquer les articles comme achetés
- ✅ Synchronisation cloud en temps réel
- ✅ Design adaptatif mobile
- ✅ Authentification utilisateur

## Stack Technique

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Temps réel)
- **Styling**: Tailwind CSS, Radix UI
- **Déploiement**: Netlify

## Démarrage

### Prérequis

- Node.js 18+ 
- npm ou yarn
- Compte Supabase

### Installation

1. Clonez le repository
2. Installez les dépendances : `npm install`
3. Configurez les variables d'environnement (voir .env.example)
4. Lancez le serveur de développement : `npm run dev`

## Déploiement

### Déployer sur Netlify

1. Poussez votre code sur GitHub
2. Connectez votre repository à Netlify
3. Ajoutez les variables d'environnement dans le tableau de bord Netlify
4. Déployez !

### Configuration Supabase

Exécutez le script SQL dans `scripts/create-tables.sql` dans l'éditeur SQL de Supabase.

## Variables d'Environnement

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de votre projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anonyme de votre Supabase |

## Licence

Ce projet est sous licence MIT.
