# Symfony + React 

Le principe : **Symfony gère le backend, Twig charge la page et React affiche l’interface.** Vite s’occupe du JavaScript et du rechargement pendant qu’on développe.

## 1. Ce qu’il faut installer

- **PHP**, dans une version compatible avec `backend/composer.json`.
- **Composer**, pour les dépendances Symfony.
- **Symfony CLI**, pour lancer le serveur local avec les commandes ci-dessous.
- **Node.js et npm**, dans une version compatible avec la version de Vite du projet.
- **Git**, si vous récupérez le projet depuis un dépôt.

Pour vérifier dans un terminal :

```bash
php -v
composer --version
symfony version
node -v
npm -v
```

Si une commande n’est pas reconnue, installez l’outil concerné ou vérifiez son PATH, puis rouvrez le terminal.

## 2. Récupérer le projet

Clonez le dépôt avec son adresse Git. Ouvrez ensuite le dossier principal dans votre éditeur.

Les dossiers **`backend_symfony` et `frontend_react` doivent rester côte à côte**. Si votre dossier React porte un autre nom, adaptez les commandes.

| Emplacement | À quoi ça sert ? |
| --- | --- |
| `backend_symfony/` | Projet Symfony et dépendances PHP |
| `backend_symfony/src/Controller/` | Contrôleurs et routes Symfony |
| `backend_symfony/templates/` | Pages Twig |
| `backend_symfony/public/build/` | Fichiers générés par Vite pour Symfony |
| `frontend_react/` | Projet React et dépendances JavaScript |
| `frontend_react/src/App.jsx` | Composant principal de l’interface |
| `frontend_react/src/main.jsx` | Point d’entrée qui affiche React dans la page |
| `frontend_react/vite.config.js` | Configuration de Vite et du lien avec Symfony |

**Pas besoin de recréer les projets Symfony ou React quand vous récupérez le code.**

## 3. Installer les dépendances — au premier lancement

Ouvrez un terminal à la racine du projet, puis :

```bash
cd backend_symfony
composer install
```

Ouvrez un deuxième terminal à la racine du projet :

```bash
cd frontend_react
npm install
```

## 4. Lancer le projet — à chaque session

### Terminal 1 : Symfony

Dans le dossier `backend_symfony` :

```bash
symfony serve
```

### Terminal 2 : React / Vite

Dans le dossier `frontend_react` :

```bash
npm run dev
```

**Gardez les deux terminaux ouverts.**

### Ouvrir le site

Allez sur **[http://127.0.0.1:8000/](http://127.0.0.1:8000/)**.

C’est cette adresse qui teste le chargement de React par Twig. Utilisez exactement `127.0.0.1` et HTTP avec la configuration actuelle : l’origine autorisée par Vite est `http://127.0.0.1:8000`.

| Serveur | Adresse | Rôle |
| --- | --- | --- |
| Symfony | `http://127.0.0.1:8000` | Sert la page Twig et les routes backend |
| Vite | `http://127.0.0.1:5173` | Sert le JavaScript et le CSS en développement |

Si le composant de test est en place, vous devez voir **« React est chargé depuis Twig ! »**.

Pour arrêter : faites **Ctrl + C** dans chacun des deux terminaux. Si Symfony continue de tourner en arrière-plan, utilisez `symfony server:stop` dans `backend_symfony`.

## 5. Comment les deux projets sont reliés

1. Le navigateur demande `/` à Symfony.
2. `FrontController.php` renvoie `front/index.html.twig`.
3. Twig crée une `<div id="root"></div>` et ajoute les scripts de Vite.
4. `frontend_react/src/main.jsx` trouve cette div et y affiche `<App />`.

Les noms doivent correspondre :

| Fichier | Configuration attendue |
| --- | --- |
| `frontend_react/vite.config.js` | Entrée nommée `app`, qui pointe vers `./src/main.jsx` |
| `frontend_react/vite.config.js` | `base: '/build/'` et sortie vers `../backend_symfony/public/build/` |
| `frontend_react/vite.config.js` | Plugins React et Symfony activés |
| `backend_symfony/config/packages/pentatrion_vite.yaml` | `build_directory: build` sous `pentatrion_vite:` |
| `backend_symfony/src/Controller/FrontController.php` | Route `/` qui rend `front/index.html.twig` |
| `backend_symfony/templates/front/index.html.twig` | Div `root` et fonctions Twig ci-dessous |

Dans la page Twig :

```twig
{# Dans le head #}
{{ vite_entry_link_tags('app') }}

{# Dans le body #}
<div id="root"></div>
{{ vite_entry_script_tags('app', { dependency: 'react' }) }}
```

L’option `dependency: 'react'` prépare le rechargement de React en développement. Voir la [documentation des fonctions Twig](https://symfony-vite.pentatrion.com/guide/twig-functions.html).

Le fichier `frontend_react/index.html` n’est pas le HTML utilisé pour la route Symfony `/` : c’est Twig qui fournit cette page.

## 6. Où coder ?

- **Interface, composants, boutons et styles** : dans `frontend_react/src/`.
- **Routes, traitements, accès aux données et sécurité** : dans `backend_symfony/src/`.
- **Structure HTML qui accueille React** : dans `backend_symfony/templates/front/index.html.twig`.

Pour tester les modifications, changez un texte dans `frontend_react/src/App.jsx`, enregistrez et regardez la page. Vite met normalement l’interface à jour automatiquement.

React pourra récupérer les données de Symfony avec un appel comme `fetch('/api/produits')`, **une fois cette route créée dans Symfony**. Comme la page est ouverte sur Symfony, cette URL relative vise le backend.

## 7. Compiler le frontend

Dans `frontend_react` :

```bash
npm run build
```

Vite génère les fichiers dans `backend_symfony/public/build/`. Avec `emptyOutDir: true`, ce dossier est vidé avant la compilation : n’y mettez pas de fichiers écrits à la main.

Le bundle peut ensuite charger les fichiers compilés sans serveur Vite. **Cette commande compile le frontend ; elle ne déploie pas Symfony ni la base de données.** Voir la [configuration du plugin](https://symfony-vite.pentatrion.com/guide/configuration.html).

## 8. Travailler à plusieurs

- Partagez le code, les configurations, `composer.json`, `composer.lock`, `package.json` et `package-lock.json`.
- Gardez `backend_symfony/vendor/`, `frontend_react/node_modules/`, les caches et les fichiers locaux de connexion hors de Git via les `.gitignore`.
- Après avoir récupéré des changements de dépendances, relancez `composer install` dans `backend_symfony` et `npm install` dans `frontend_react`.
- Avant d’envoyer vos changements, ouvrez `127.0.0.1:8000/` et vérifiez la console du navigateur.

## Le pense-bête 🚀

Deux terminaux ouverts :
**Terminal backend :**

```bash
symfony serve
```

**Terminal frontend :**

```bash
npm run dev
```

**Navigateur : [http://127.0.0.1:8000/](http://127.0.0.1:8000/)**


