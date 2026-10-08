# MUTLOG

Plateforme béninoise de mutualisation du transport logistique.

MUTLOG met en relation les clients/expéditeurs ayant des marchandises à transporter et les transporteurs disposant de capacités disponibles. Le cœur métier repose sur le rapprochement des demandes et des offres, puis la mutualisation des capacités compatibles.

## Références fonctionnelles

Le développement est piloté par :

- le cahier des charges fonctionnel V1 de MUTLOG ;
- la direction UI/UX cible de MUTLOG ;
- la maquette de référence fournie pour l'interface.

Le métier ne doit pas être modifié silencieusement : toute règle absente des sources doit être identifiée comme proposition technique ou décision métier.

## MVP

Le MVP couvre prioritairement :

- inscription et connexion ;
- profils client et transporteur ;
- véhicules et capacités ;
- demandes de transport ;
- offres de transport ;
- recherche ;
- matching ;
- mutualisation avec validation administrateur ;
- réservation ;
- statuts et suivi opérationnel ;
- commissions ;
- notifications de base ;
- historique ;
- statistiques de base ;
- interface responsive.

Le cycle principal est :

```
Demande → Recherche → Mutualisation → Confirmée → En cours → Livrée → Terminée
```

## Architecture

```
mutlog/
├── frontend/        # React + TypeScript + Vite
├── backend/         # Laravel REST API
├── docs/            # documentation technique et métier
├── docker/          # infrastructure locale
└── README.md
```

### Frontend

- React
- TypeScript
- Vite
- React Router
- Axios
- Lucide React
- Recharts
- Tailwind CSS / shadcn/ui à intégrer dans le socle UI final

### Backend

- Laravel
- Laravel Sanctum
- API REST
- PostgreSQL
- Redis
- queues / notifications
- stockage compatible S3
- WebSockets / Reverb selon les besoins du MVP

## Design system

Référentiel UI :

- Primary: `#0B2A4A`
- Primary 2: `#123E68`
- Accent: `#FF7A00`
- Success: `#16A34A`
- Warning: `#F59E0B`
- Danger: `#DC2626`
- Background: `#F7F9FC`
- Surface: `#FFFFFF`
- Text: `#102033`
- Muted: `#64748B`
- Border: `#E2E8F0`

Le rendu cible privilégie cartes blanches, bordures légères, rayons 10–14 px, ombres discrètes, navigation bleu foncé, actions orange, badges de statut et conception mobile-first.

## Développement local

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

Les secrets et fichiers `.env` ne doivent jamais être commités.

## Qualité

Avant intégration d'une fonctionnalité :

1. vérifier le cahier des charges ;
2. respecter la direction UI/UX ;
3. implémenter les règles métier explicitement définies ;
4. tester le comportement nominal et les erreurs ;
5. vérifier le responsive ;
6. documenter les décisions importantes.

## Git

Les développements se font idéalement par fonctionnalité :

```
main
└── develop
    ├── feature/public-site
    ├── feature/auth
    ├── feature/client
    ├── feature/transporteur
    ├── feature/matching
    ├── feature/mutualisation
    └── feature/admin
```

Une fonctionnalité terminée doit être relue et testée avant intégration dans `develop`, puis dans `main`.

## Propriété

Projet propriétaire MUTLOG.
