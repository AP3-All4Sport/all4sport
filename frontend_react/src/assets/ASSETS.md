# Assets du header et du footer

Tous les visuels affichés sont des SVG locaux, sans dépendance ni requête à un CDN.
Sources récupérées le 15 septembre 2026 :

- Icônes d'interface : [Lucide](https://github.com/lucide-icons/lucide/tree/main/icons).
  Fichiers : search, user-round, shopping-bag, truck, credit-card, package-open, heart, arrow-up.
  Licence ISC et MIT dans `icons/lucide-license.txt`.
- Réseaux sociaux : [Simple Icons](https://github.com/simple-icons/simple-icons/tree/develop/icons).
  Fichiers : instagram, facebook, youtube, tiktok.
  Licence CC0 dans `icons/simple-icons-license.txt` ; les marques appartiennent à leurs titulaires.
- Moyens de paiement : [Active Merchant / Shopify](https://github.com/activemerchant/payment_icons/tree/master/app/assets/images/payment_icons).
  Sources visa.svg, master.svg, american_express.svg, paypal.svg, apple_pay.svg et klarna.svg.
  Noms locaux harmonisés avec le composant Icon. Licence MIT dans `icons/payment-license.txt`.
- Logo All4Sport : vectorisation locale du PNG préexistant `brand/all4sport-logo.png`.
  Le SVG utilise uniquement des tracés et des dégradés, sans image matricielle intégrée.
  Les couleurs ont été simplifiées en noir, argent et orange ; le PNG original est conservé.

Les destinations des futures pages, du panier, du site corporate et des réseaux sociaux
ne sont pas encore définies. Elles sont donc affichées comme indisponibles, sans faux lien.
Le compte pointe vers la route existante `/login`. Le formulaire de recherche indique
son indisponibilité à la soumission ; aucun moteur de recherche n'est ajouté.

L'ancien écran de diagnostic de la base est conservé dans
`../components/DatabaseStatus.jsx` avec sa feuille de style, mais n'est plus monté par App.
