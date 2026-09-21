# Consignes de travail — All4Sport

## Collaboration

- Communiquer en français, simplement et brièvement.
- Limiter les changements au périmètre demandé ; conserver le code et les configurations existants hors de ce périmètre.
- Avant toute modification, consulter `git status --short` et préserver les changements déjà présents, sans les annuler ni les écraser.
- Ne pas ajouter de dépendances, d'outils ou de refonte sans nécessité pour la demande en cours.
- Ne pas enregistrer de secrets dans le dépôt ou dans les comptes rendus.

## Repères du projet

- `README.md` décrit le lancement et le lien entre Symfony, Twig et React.
- `backend_symfony/` : backend Symfony ; consulter `composer.json` pour les contraintes PHP et Symfony, et `composer.lock` pour les versions verrouillées.
- Lire `backend_symfony/AGENTS.md` avant toute intervention dans ce dossier ; il précise les conventions backend.
- `frontend_react/` : interface React en JavaScript/JSX avec Vite et Oxlint ; consulter son `package.json` pour les scripts et dépendances.
- La route `/` dans `backend_symfony/src/Controller/FrontController.php` rend `backend_symfony/templates/front/index.html.twig`.
- Twig fournit l'élément `root` ; `frontend_react/src/main.jsx` y monte `App.jsx`.
- Le Vite utilisé pour cette interface est configuré dans `frontend_react/vite.config.js`. Une configuration Vite distincte existe aussi dans le backend : vérifier l'usage avant de la modifier.
- La compilation React écrit dans `backend_symfony/public/build/` et vide ce dossier. Ne pas y placer de fichiers sources ni modifier les fichiers générés à la main.

## Commandes disponibles

Exécuter les commandes depuis le dossier indiqué, avec les dépendances déjà installées. Adapter les vérifications à la modification ; une modification documentaire seule ne nécessite pas de lancer l'application.

| Dossier | Commande | Usage |
| --- | --- | --- |
| `backend_symfony/` | `symfony serve` | Serveur Symfony local |
| `backend_symfony/` | `php bin/phpunit` | Tests backend |
| `frontend_react/` | `npm run dev` | Serveur Vite local |
| `frontend_react/` | `npm run lint` | Analyse du JavaScript avec Oxlint |
| `frontend_react/` | `npm run build` | Compilation de React pour Symfony |

Pour vérifier l'intégration dans le navigateur, utiliser `http://127.0.0.1:8000/` avec Symfony et Vite démarrés. La configuration actuelle de Vite autorise cette origine et utilise le port `5173`.

## Vérification et restitution

- Respecter les conventions des fichiers voisins ; ne pas reformater des fichiers sans rapport avec la demande.
- Pour une modification fonctionnelle, effectuer les vérifications pertinentes et signaler celles qui n'ont pas pu être exécutées.
- Vérifier le diff et l'état Git final pour repérer tout changement involontaire.
- Résumer les fichiers ajoutés ou modifiés et les vérifications effectuées, en distinguant les changements préexistants.

Référence du format : [documentation officielle OpenAI sur AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md).
