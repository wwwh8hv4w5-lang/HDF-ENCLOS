# HDF ENCLOS 1.4.0

Jeu 3D de survie et de vie de village dans le navigateur (WebGL 2), construit sur le moteur HDF WALL / FSM3D.

**Jouer en ligne : https://wwwh8hv4w5-lang.github.io/HDF-ENCLOS/**

![Aperçu](apercu.png)

> **Réservé aux adultes (18 ans et plus).** Le jeu contient de la violence, des agressions, des meurtres, des enlèvements et des thèmes psychologiquement durs. Un écran d'accueil le rappelle avant de jouer.

## 1.4.0 : l'atelier défile, le sac à dos est refait

- **Atelier (onglet Fabriquer) :** toutes les recettes se voient enfin, au doigt, à la souris, aux flèches du clavier et à la manette. La recette choisie reste toujours à l'écran, et un fondu avec « ▾ Plus bas » montre qu'il en reste.
- **Nouveau sac à dos :**
  - un panneau de cuir et de toile, qui s'ouvre avec une petite animation ;
  - une grille avec les places libres visibles (8, 12 ou 16), un dessin pour chacun des 60 objets et un badge de quantité ;
  - une fiche détaillée avec un grand dessin, la description, les effets (satiété, soif, santé…) et les boutons Manger, Boire, Soigner ou Jeter ;
  - des filtres par catégorie, avec le compte des places libres ;
  - les objets de quête sont rangés à part, dans les poches.
- **Commandes du sac :**
  - clavier : flèches, Entrée pour utiliser, Suppr pour jeter, Tab pour changer de rubrique, I ou Échap pour fermer ;
  - manette : croix directionnelle, ✕ pour utiliser, L1/R1 pour changer de rubrique, ○ pour fermer.
- Les sauvegardes ne changent pas.

## 1.3.2 : pas de sommeil pendant la fouille

- Impossible de dormir tant que les scientifiques sont là, de l'arrivée du train en gare à son départ complet : lit de la maison, nuit à deux et lit de camp de la réserve. Le bouton passe en gris, « Impossible de dormir · scientifiques ici », et le jeu l'explique : « Impossible de dormir : les scientifiques sont dans l'enceinte. »
- Si vous dormez quand le train arrive, vous êtes toujours réveillé (avant : 7 fois sur 10), et le temps repasse aussitôt à la vitesse normale.
- L'évanouissement (santé à 0) n'est pas concerné.

## 1.3.1 : correctif du dialogue

- La liste des phrases du dialogue défile enfin jusqu'à la phrase choisie (manette, flèches du clavier) ; elle revient en haut à chaque nouvelle réplique ; un léger fondu signale qu'il reste des phrases plus bas (ou plus haut) ; les phrases ne sont plus écrasées les unes sur les autres ; le défilement au doigt est explicitement autorisé.

## 1.3 : l'action et le texte

- Infiltration pendant les fouilles, poursuites (voleur, provocateur), évasion chronométrée, corps à corps, épreuves (porter, grimper, soulever).
- Le texte va à l'essentiel ; les révélations se jouent en scènes.
- Voix : après un rechargement (Continuer, Charger) ou une partie lancée à la manette, un écran « Touchez l'écran pour reprendre » demande un geste pour le son et les voix. Le détail est dans NOTE.md.

## Contenu
- `index.html` : le jeu complet, un seul fichier.
- `NOTE.md` : note technique détaillée (contenu, lots, comment ajouter une maison).
- `images/` : tableaux, affiches et drapeau du jeu.
- `captures/` : les captures d'écran du banc de test de la 1.3 (114 images).
- `outils/` : fichiers de développement pour les mises à jour rapides : `correctif-roundBox.diff` (correctif roundBox), `banc.js` (banc de test automatisé) et `banc_resultat.json` (résultats du dernier passage du banc).

© FERAL SYSTEM MEDIA
