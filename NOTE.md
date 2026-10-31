# HDF : ENCLOS 1.6.1 — note technique

*(Construit sur le kit HDF BASE 1.0 KIT ; les commentaires `HDF BASE :` du code gardent leur nom.)*

Base de départ en 3D (WebGL 2) issue de **HDF WALL v1.0**. Elle contient l'enceinte de pierre, une brèche dans le mur nord, une rue intérieure le long des murs nord et est, **une maison à étage entièrement meublée au centre** (on y entre, on monte à l'étage), un sol d'herbe, le cycle de l'heure, une vue en survol et une vue à pied avec collisions.

> **Ajouter une maison = ajouter une ligne dans `MAISONS`** (voir §0). Tout le reste est automatique.

---

## HDF : ENCLOS 1.0 — ce que contient le jeu (lots 1 à 25, puis phase 2, lots 1 à 4)

**Réservé aux adultes (18 ans et plus).** Le jeu contient de la violence, des agressions, des meurtres, des enlèvements et des thèmes psychologiquement durs. Un écran d'accueil le dit avant de jouer.

**La boucle de jeu.**
1. **Écran d'accueil**, carton titre, puis **une minute de voyage dans le train** (1.1) : « Le Hameau de Feral, tout le monde descend. »
2. **L'arrivée :** le train s'arrête à quai parmi 19 voyageurs, on descend, l'homme accueille le groupe, puis le portail se referme derrière vous. Tout le monde se retrouve au grand mât, discute, puis se répartit les sept maisons ; on vous en propose une (1.1).
3. **Survivre** (lots 11 à 14) : faim, soif, fatigue, hygiène, froid, maladie ; boire, manger, dormir, se laver, faire du feu.
4. **Le village vit seul** (lots 6 à 19) : emplois du temps, repas, veillée au mât, potagers qui poussent, bois, puits qui s'use. Le travail se répartit chaque matin, et l'on partage le soir. History Sens gère les relations, les présentations, les discussions, les ragots, les amitiés et les brouilles.
5. **La violence** (lot 22) : bagarres, vols de nuit, meurtres, soupçons, tombes. On peut enquêter et accuser.
6. **La princesse Ilona** (lot 23) : une lettre chaque matin dans la boîte au pied du mât, 13 en tout. Elles révèlent la copie du vrai Feral, la vengeance, le conseil des sept familles, la mère qui a voté la dernière.
7. **Le train scientifique** (lot 20) : certaines nuits, la fouille. On se cache ou l'on est emmené.
8. **La boucle** (lot 21) : capturé, tout recommence dans le train. Vous seul vous souvenez : la mémoire est gardée dans `localStorage`.
9. **L'évasion** (lot 24) : connaître la porte du milieu, ramasser la carte à ruban au puits pendant un raid, monter dans le train au bon moment. Le train vous emmène au vrai Feral.
10. **L'action** (1.3) : se faufiler pendant les fouilles, rattraper un voleur, semer un provocateur, se battre au corps à corps (esquiver, riposter), porter l'eau, grimper aux tours, dégager un blessé. Les révélations se jouent en scènes ; les longs textes vont à l'essentiel.

**Commandes :**
- **clavier :** ZQSD ou flèches pour marcher, Maj pour courir, E pour agir, Tab pour la roue, B pour l'état, J pour le carnet, I pour le sac, Q et D (ou les flèches) pour changer de caméra au terminal, Échap pour le menu ou pour passer l'ouverture ;
- **tactile :** pouce gauche pour marcher, glisser pour regarder, bouton d'action ; « État », « Carnet » et « Menu » sont en haut à droite ; sur iPhone, voir 1.5.2 (bouton Agir, Courir, Sauter, réglages) ;
- **manette :** voir la section ci-dessous.

**Budget mesuré (v1, lots 1 à 25) :**

| Appareil | Dehors | Dans une maison |
|---|---|---|
| Ordinateur | 299 000 à 339 000 triangles | 109 000 |
| Profil iPad | 150 000 à 172 000 triangles | 92 000 |

La cible était d'environ 500 000 triangles.

## HDF : ENCLOS 1.6.1 — correctifs

- **Bug carnet (1.6.0 et avant)** : « Écrire dans votre carnet » lance un mini-jeu `choix` (3 lignes). Garder E appuyé une fraction de seconde après l'avoir lancé suffisait : la répétition automatique du clavier passait par l'écouteur de `JEU` (`JEU.in.a = true`), `PH.choix` validait la ligne 1 et `terminerJeu` fermait le carnet ~1,3 s plus tard, sans que le joueur ait choisi. Même chose à la manette (Carré lance l'action et compte aussitôt comme validation).
- **Correctif carnet** : l'écouteur clavier ignore `e.repeat` ; `lancerJeu` démarre avec `JEU.prev = { a: true }`, donc il faut relâcher puis appuyer pour valider. Flèches, Entrée, clic/toucher d'une ligne inchangés.
- **Bug (1.6.0)** : `chuteFragment2()` pose `FE().f2chute = true` tout de suite, le fragment 2 n'est donné qu'au bout de l'animation (`CLE.chute`, 2,4 s). Une sauvegarde prise dans cette fenêtre (menu → Sauvegarder, autosave en quittant) gardait `f2chute` sans `f2` ; au chargement, « Examiner le tableau d'Ilona » n'était plus proposé : fragment 2 perdu pour toujours.
- **Correctif** : `pourquoiPasSauver()` refuse pendant `CLE.chute` ; `resetFuite()` (appelé après la fusion dans `appliquerPartie`) remet `f2chute` à `false` si `f2` manque, ce qui répare les sauvegardes 1.6.0 touchées.
- Rien d'autre ne change (format de sauvegarde identique).

---

## HDF : ENCLOS 1.6.0 — la fin secrète (train de 3 h 33, endormissement, point d'accroche de la suite)

> **Spoilers.** Ne rien en dire dans les menus, l'aide ou le README. Le carnet n'en montre rien tant que le joueur ne l'a pas commencée.

**Ce que c'est.** Une troisième issue, à part de la fin classique (l'évasion du lot 24) et de la boucle (capture → retour au train). Elle mène au **jeu suivant** : le fondu au noir de l'endormissement dans le train est le premier plan de la suite. Il n'y a ni écran de fin, ni générique, ni message.

**Déroulé.** Les étapes 1 à 4 (fragments, trappe, photo, portail en bois) sont décrites en 1.5.4 ci-dessous. En 1.6.0, `fuitePossible()` est rebranchée et la chaîne continue :
4. **Train de 3 h 33** (`FUITE`, `majFuite`) :
   - On l'entend à 3 h 29 (`FUITE_ARR` 209), il est à quai à 3 h 33 (`FUITE_QUAI` 213) et repart à 3 h 36 (`FUITE_PART` 216), soit 3 minutes de jeu.
   - Il réutilise le nœud `TRAIN` (loco et deux voitures). Ses voyageurs (`VOYAGEURS_FUITE`, `FUITE.voy`) ne sont jamais des habitants, ni dans `PASSAGERS.liste`.
   - « Monter dans le train » assoit le joueur sur la seule place libre. Les voyageurs parlent de leur vie, vont tous à la Ville de Feral, ne croient pas le joueur ; la plupart viennent du Hameau de Feral et s'étonnent que l'arrêt porte le même nom.
   - Train manqué : il repasse la nuit suivante (`e.passe`, `e.rate`).
   - **Pas de raid** tant que la photo est lue et le train pas encore pris (`RAID.prochain` annulé, `FUITE.raidsAnnules`). C'est un choix : le train « non contrôlé » ne croise pas le train scientifique.
   - Sauvegarde refusée à bord et à quai (`pourquoiPasSauver` : « au passage du train de 3 h 33 »).
5. **Endormissement** : « Fermer les yeux », ou au bout de ~80 s de trajet (`dormirFuite`). Le fondu au noir dure 2,4 s, au-dessus de toute l'interface (`html.suiteNoir #voile`). Puis `finFuite()` enregistre la fin et appelle `suiteSecrete()`.

**État.**
- Partie : `VIE.flags.cleTrappe` = `{ f1, f2, f2chute, f3, cle, ouverte, descendu, photo, portail, train, passe, rate }`. Il est sauvegardé avec `VIE`. Absent d'une ancienne sauvegarde, il vaut `{}` (`FE()`), et le format de sauvegarde ne change pas.
- Entre les boucles : `MEMOIRE.finSecrete = { n, boucle, jour }` (nombre de fois, première boucle et premier jour), plus `MEMOIRE.fuite` et le souvenir `fuite<boucle>`. `FIN_SECRETE.vue()` / `FIN_SECRETE.atteinte`.
- Carnet : `qFE` et `qSE` portent `secrete: true`. Elles ne s'affichent (ni dans le compte « x / y accomplies ») qu'une fois commencées : 32 quêtes visibles, 34 en interne. Une fois la fin atteinte, le carnet garde un bloc « Fin secrète · trouvée » (`finSecreteCarnet()`) d'une boucle à l'autre.

**Point d'accroche de la suite : `suiteSecrete()`** (fin de `cle.js`, exporté dans `HDF.suiteSecrete` / `HDF.SUITE_SECRETE`).
```js
SUITE_SECRETE = { brancher: null, attente: 4000, lancee: false }
SUITE_SECRETE.brancher = ctx => { /* lancer le jeu suivant, depuis le noir */ }
// ctx = { fin: MEMOIRE.finSecrete, boucle, jour, voyageurs: ['Madeleine Roux', …], parles: [prénoms à qui l'on a parlé] }
```
- Quand `finFuite()` est appelée, l'écran est **déjà noir** (`#voile.on`, classe `suiteNoir` sur `<html>`). Le son du train est coupé, et les sous-titres et les choix sont masqués.
- Si `brancher` est une fonction, elle reçoit la main et rien d'autre ne se passe : la suite démarre sur ce noir et c'est à elle d'enlever le voile. Le joueur ne doit pas voir la transition.
- Sans suite branchée (cas de la 1.6.0), le noir est maintenu `attente` ms, puis la page se recharge : retour discret au menu, sans texte. La mémoire garde la fin. « Continuer » reprend la dernière sauvegarde d'avant le train (aucune n'est possible à bord).
- `resetFuite()` remet `lancee` à `false` et retire `suiteNoir`.

- Les voyageurs : `VOYAGEURS_FUITE` (7), `parlerFuite()` (« Leur expliquer… », « Vous allez où ? », « Vous êtes du Hameau de Feral ? »), bavardages `BAVARDAGES_FUITE` pendant le trajet.

**Debug :** `HDF.FE()`, `HDF.CLE`, `HDF.FRAGS_CLE`, `HDF.actionCle()`, `HDF.FUITE`, `HDF.FIN_SECRETE`, `HDF.SUITE_SECRETE`, `HDF.suiteSecrete`.

## HDF : ENCLOS 1.5.4 — la clé de la trappe (fragments, trappe, photo, portail)

> **Spoilers.** Ne rien en dire dans les menus, l'aide ou le README. Le carnet n'en montre rien tant que le joueur ne l'a pas commencée.

**Ce que c'est.** La première étape de la fin secrète (la suite, le train de 3 h 33, arrive en 1.6.0). En 1.5.4, la clé ouvre la trappe et le portail en bois, et la photo se lit ; le train ne passe pas encore (`fuitePossible()` renvoie `false`), donc les raids de la nuit restent normaux.

**Déroulé.**
1. **Fragments** (`FRAGS_CLE`, déclaré tôt dans `cle_tete`, à côté de `SECRET`, parce que `build(A)` le lit avant les `const` de fin de script) :
   - `f1`, l'anneau (`fragCle1`) : au sol de la réserve d'Ilona (x −166, z 58, sol −8).
   - `f2`, la tige (`fragCle2`) : Maison du centre (L001), « Examiner le tableau d'Ilona » au-dessus de la cheminée. Le fragment glisse derrière la toile et tombe (`chuteFragment2`, `CLE.chute`), puis il est ramassé tout seul au bout de 2,4 s.
   - `f3`, le panneton (`fragCle3`) : au sol près du portail (`PORTAIL.x + 4,5`, `ENCEINTE.z1 − 4`).
   - Le premier ramassé lance **« Fragments d'espoir »** (`qFE`). Au troisième, `assemblerCle()` retire les fragments du sac et donne `cleTrappe`.
2. **Trappe** : avec la clé, « Ouvrir la trappe » (le volet pivote sur 1,6 s, `TRAPPE.poseVolet`), puis « Descendre l'échelle » / « Remonter l'échelle ». La descente est automatique, barreau par barreau (`TRAPPE.anim`, 2,8 s).
3. **Photo** : dans la salle, « Retourner la photo » ouvre le panneau de lecture `#lettre` avec `TEXTE_DOS_PHOTO`. C'est le texte de Tom, **tel quel, fautes comprises** : « prend » (prends), « le seule » (le seul), « passeras » (passera), pas de point final. En reposant la photo, on lance **« Seul espoir »** (`qSE`) : ouvrir le portail en bois avec la clé (état `PORTAIL.etat = 'ouvert_cle'`, qu'aucune règle ne referme), puis prendre le train.
4. **Portail en bois** : avec la clé, « Ouvrir le portail avec la clé » (`ouvrirPortailCle`, `PORTAIL.etat` `'ouvert_cle'`) ; c'est l'étape 1 de « Seul espoir ». L'étape 2 (« Prendre le train de 3 h 33 ») reste en attente jusqu'à la 1.6.0.

**État.**
- Partie : `VIE.flags.cleTrappe` = `{ f1, f2, f2chute, f3, cle, ouverte, descendu, photo, portail }`. Il est sauvegardé avec `VIE`. Absent d'une ancienne sauvegarde, il vaut `{}` (`FE()`), et le format de sauvegarde ne change pas.
- Carnet : `qFE` et `qSE` portent `secrete: true`. Elles ne s'affichent (ni dans le compte « x / y accomplies ») qu'une fois commencées : 32 quêtes visibles, 34 en interne.

**Debug :** `HDF.FE()`, `HDF.CLE`, `HDF.FRAGS_CLE`, `HDF.actionCle()`, `HDF.TRAPPE`, `HDF.PORTAIL`.

## HDF : ENCLOS 1.5.3 — la trappe sous le buisson (ouest)

- **Données :** `TRAPPE` (à côté de `SECRET`) : `x −120, z 87`, rayon d'action 1,6 m, message `C’est bloqué`, salle `x −124,5…−112,5, z 83…92`, sol à −3,6 m, 3 m de haut. Rien n'est écrit dans `etatPartie()` ni dans `localStorage`.
- **Emplacement :** choisi libre dans les deux tirages de végétation (bureau et tactile tirent un nombre différent d'aléas) : à plus de 9 m de tout arbre, massif, chemin, maison, ressource ou case `OCCUPE` ; 17 m du mur ouest, ~30 m de la porte secrète, hors de la réserve (x < −143).
- **`trappeOuest(A)`**, appelée juste après `vegetation(A)` : trois nœuds FSM3D fusionnés (`GEO.mergerLots`).
  - `trappeBuisson` : 8 touffes (matériau 20, vent), sans collision, **hors de `VEG`/`OCCUPE`** pour ne pas décaler la graine des arbres et des baies (ce n'est donc pas une cachette).
  - `trappe` (`maxDist` 40) : cadre de pierre, 6 planches, fers, pentures, verrou, anneau, mousse, feuilles. Rien ne dépasse 0,11 m : on marche dessus sans heurt.
  - `trappeSalle` (`visible = false`) : puits, plafond percé, sol, murs, poutres, échelle, mobilier, lampe émissive. Tout est sous −0,02 m. Un `onBeforeRender` ne l'affiche (et n'ajoute ses deux lumières) que si l'œil passe sous le sol à moins de 30 m : en jeu, zéro ordre de dessin et zéro lumière en plus.
  - la photo « CUBE 01 · SECTEUR OMEGA » (fournie par Tom) : quad texturé de 0,5 × 0,44 m posé à plat au sol de la salle, sous la lampe-tempête, à 2,8 m du pied de l'échelle, tourné de ~22°, décollé de 6 mm (pas de z-fighting). Texture `IMG_CUBE01` embarquée (JPEG 800 × 698, qualité 80, 71 Ko, luminosité +18 % et contraste +30 % pour que « CUBE 01 / SECTEUR OMEGA » se lise dans la pénombre), mipmaps et anisotropie de `A.R.texture` comme les tableaux. Dans le nœud `trappeSalle`, donc dessinée seulement sous le sol.
- **`actionTrappe(W)`**, en tête du bloc extérieur de `actionDispo` : « Ouvrir la trappe » → `notifier(TRAPPE.msg)`. Le marqueur d'action est ancré sur la trappe (`ancreAction`).
- **Debug :** `HDF.TRAPPE` (nœuds `noeud`, `buisson`, `dessous`) et `HDF.actionTrappe()`. Pour voir la salle : forcer `A.camera.fixed.eye/look` sous le sol depuis un `A.onUpdate` placé après celui du jeu.

## HDF : ENCLOS 1.5.2 — mode iPhone (commandes et contrôles)

**Détection** (script en tête de page, avant tout rendu) → `self.HDF_CTL`, classes sur `<html>` :
- `tel` : iPhone / iPod, téléphone Android, ou petit écran tactile (≤ 540 px de petit côté) qui n'est pas un iPad. Pour `tel` seulement, la page reçoit `<meta name="viewport" content="width=device-width,…,user-scalable=no,viewport-fit=cover">`. Avant 1.5.2, il n'y avait aucune balise viewport : Safari iPhone mettait la page en page à 980 px, et `env(safe-area-inset-*)` valait 0. L'iPad n'est pas touché (même mise en page qu'avant).
- `ctl-tactile` / `ctl-bureau` : commandes tactiles ou non. Auto = pointeur grossier, `maxTouchPoints > 1`, iPhone ou iPad (y compris iPadOS en mode « ordinateur » : Macintosh + maxTouchPoints > 1).
- `pouces` : grappe au pouce droit + manette flottante (téléphone tactile, ou mode Tactile forcé).
- `iphone`, `standalone` (lancé depuis l'écran d'accueil).
- Réglages : `localStorage['hdf-enclos-commandes'] = {mode:'auto'|'tactile'|'bureau', sens, invY, perf:'auto'|'eco'}`, lus sous try/catch. **La sauvegarde de partie et son format ne changent pas.**

**Commandes (téléphone)** :
- Manette flottante : zone gauche 50 %, rayon 58 px, zone morte 12 %, courbe puissance 1,35. Le centre suit le pouce au-delà de 1,7 rayon. Il est écarté des bords (marges de sécurité + rayon) pour éviter les gestes système d'iOS. Pousser au-delà de 1,3 rayon fait courir (avant : bord du cercle). Repère « marcher » en pointillés au repos.
- Caméra au doigt : `.0055 × sens` (1,5 par défaut sur téléphone, car les px CSS sont 2,5 fois plus grands qu'avant ; 1 ailleurs, donc rien ne change sur iPad ni sur PC). Axe vertical inversable. La marche et la caméra se font en même temps (pointeurs séparés).
- Boutons (#tactile) : **Agir** (90 px, recopie l'action de `majAction`, grisé sans action ; #act centré masqué), Sauter/Grimper, **Courir** (bascule, s'éteint ~1,5 s après avoir lâché le pouce), S'accroupir, Roue. Toutes les cibles font au moins 44 px.
- HUD : #top et #side compactés, #aide sans clic, sous-titres et notifications remontés au-dessus de la grappe, menus en `100dvh` qui défilent.
- iOS : `gesturestart/change/end`, pincement et double-toucher bloqués, sélection, loupe et menu contextuel coupés (sauf champs de saisie), `body` fixé (pas de rebond).
- Sûreté : `ctlLacherTout()` (pointeurs, manette, touches, JEU.in, Courir) sur touchcancel, lostpointercapture, blur, visibilitychange et pagehide. **Pause automatique** (menu) quand la page est cachée, et sur blur sur téléphone.
- Performance : sur mobile, le moteur était déjà en qualité « basse » sans MSAA, avec qualité auto (`MOBILE_GPU`). Sur téléphone, la définition plafonne à 1,2 (`A.maxScale`). « Économie » la fixe à 0,7.
- Plein écran : Safari iPhone n'a pas l'API pour les pages ; le panneau explique « Sur l'écran d'accueil » (metas apple-mobile-web-app-*). Ailleurs, le bouton utilise `requestFullscreen`.
- Le clavier, la souris et la manette ne changent pas (la manette cache la grappe tactile sur téléphone).

**Non vérifié sur un vrai iPhone** : tests en émulation Chromium (iPhone 15, portrait et paysage, tactile CDP multi-points).

## HDF : ENCLOS 1.4.0 — défilement de l'atelier, refonte du sac à dos
- **Cause du blocage de l'atelier.**
  - `#sac` défilait d'un seul bloc (`overflow-y:auto` avec un `max-height` en `100vh`). Sur iPad/Safari, le bas du panneau passait sous la barre du navigateur.
  - Aucun `touch-action:pan-y` n'était posé, alors que `body` est en `touch-action:none`.
  - `majSac()` réécrivait tout le `innerHTML` toutes les 0,5 s, ce qui cassait le glissé en cours.
  - La sélection manette `.gpSel` bougeait sans faire défiler la liste.
  - Il n'y avait ni navigation au clavier ni indicateur.
- **Correctif.** Même approche qu'en 1.3.1 pour le dialogue :
  - Le panneau a une hauteur fixe calée sur la vraie fenêtre (`--sacH`, tirée de `visualViewport`, et les marges sûres).
  - Seules les zones `.sDefile` défilent (`#sacZone`, `#sacDetail`), avec `overflow-y:auto`, `touch-action:pan-y` et `overscroll-behavior:contain`.
  - `poserSac()` ne réécrit un bloc que si son contenu a changé.
  - La navigation spatiale (`sacBouger`) passe par `suivreSac()`, qui amène l'élément choisi à l'écran.
  - `indicateursSac()` pose `.plusBas`/`.plusHaut` (fondu `mask-image`) et le badge `#sacPlus`.
- **Sac.**
  - L'état d'interface (`SACUI` : filtre, élément focalisé, mode tactile/clavier/manette) n'est jamais sauvegardé. `VIE.sacOnglet` et `VIE.sacSel` sont repris tels quels : le format de sauvegarde est inchangé.
  - Les dessins sont des SVG intégrés : `ICONES_OBJ` (60 objets), `ICONES_CAT` (6 dessins de repli par catégorie) et `ICONES_SAC`.
  - `actionPrincipale()` garde les libellés et les effets d'avant.
  - Manette : `sacManette()` est appelée en tête de `boutonManette()` quand le sac est ouvert (12 à 15 pour se déplacer, 0 pour valider, 4/5 pour changer de rubrique, 1 pour fermer). Le clavier est capté en phase de capture pendant que le sac est ouvert.
- **Tests** (Chromium sans écran, SwiftShader ; iPad paysage et portrait, téléphone portrait et paysage) :
  - sac plein et sac vide, filtres ;
  - manger une ration, boire à la gourde, jeter ;
  - au clavier et à la manette, la sélection reste visible ;
  - les 13 recettes se parcourent à la manette jusqu'en bas ;
  - défilement au doigt et à la molette ;
  - aucune erreur dans la console.
  - Rien n'a été testé sur un vrai iPad/Safari ni avec une vraie manette.

## HDF : ENCLOS 1.3.2 — pas de sommeil quand les scientifiques sont dans l'enceinte
- **Cause.** Rien ne liait le sommeil au raid. `dormir()` (lit de la maison, aussi appelé par `nuitAvec()`) et `dormirReserve()` (lit de camp) ne vérifiaient que l'heure et l'énergie. Pendant la fouille, on pouvait donc se coucher et laisser passer le raid en temps ×60. Et `annoncerRaid()` ne réveillait le dormeur que 7 fois sur 10 (`Math.random() < .7`) : 3 fois sur 10, on dormait toute la fouille.
- **Règle choisie.** Les scientifiques sont « là » tant que `RAID.etat !== 'aucun'`, c'est-à-dire pendant `annonce` (le train entre en gare), `fouille` et `depart` (jusqu'à ce que le train ait quitté la gare, `RAID.x < -500`).
- **Correctif.**
  - `scientifiquesLa()`, `peutDormir()` et `refusSommeil()` sont centralisées juste avant `dormir()`. `refusSommeil()` affiche `MSG_PAS_DORMIR` : « Impossible de dormir : les scientifiques sont dans l'enceinte. »
  - `dormir()` et `dormirReserve()` commencent par `refusSommeil()`.
  - Les actions de lit (`actionMeuble` case 'dormir', `actionsReserve` lit de camp) deviennent « Impossible de dormir · scientifiques ici », avec `off: true`. `majAction()` pose la classe `#act.off` (bouton grisé) et l'appui donne le message.
  - L'objectif « Dormir · votre lit » est masqué pendant la présence.
  - `annoncerRaid()` réveille toujours le dormeur (`reveiller('train')`).
  - Filet de sécurité dans `majSommeil()` : si l'on dort alors que `peutDormir()` est faux, réveil immédiat.
  - `pasSimulation()` arrête la boucle accélérée dès que le joueur est réveillé en route, ce qui évite quelques secondes ×60 de train après le réveil.
  - L'évanouissement (`evanouir`, santé à 0) n'est pas bloqué : c'est une mécanique de santé, pas un sommeil volontaire.
- **Tests** (Chromium sans écran, SwiftShader) : ils sont décrits dans `/workspace/enclos-sommeil/` du banc. Le sommeil reste possible sans scientifiques ; il est refusé avec le message pendant l'annonce, la fouille et le départ ; le réveil est propre si le train arrive pendant le sommeil ; on peut redormir après le départ. Aucune erreur dans la console. Rien n'a été testé sur un vrai iPad/Safari ni avec une vraie manette.

## HDF : ENCLOS 1.3.1 — correctif du défilement des choix de dialogue
- **Cause.** `#dlChoix` (CSS, bloc dialogue « façon Skyrim ») ne montre qu'environ 5 lignes (`max-height:calc(5 * 42px + 18px)`, `overflow-y:auto`) alors que `sujets()` propose jusqu'à 8 phrases. (1) `surligner()` (manette, croix haut/bas) et les flèches du clavier déplaçaient la sélection `gpSel` sans jamais faire défiler la liste : les phrases 6 à 8 étaient sélectionnées hors de vue. (2) Les boutons, dans une colonne flex limitée en hauteur, étaient comprimés (`flex-shrink` par défaut) : les phrases longues se tassaient et débordaient les unes sur les autres. (3) `ecrireDialogue()` ne remettait pas `scrollTop` à zéro. (4) Rien n'indiquait qu'il restait des phrases plus bas (barres de défilement masquées sur iPad).
- **Correctif.** `#dlChoix button{flex:none}` ; `touch-action:pan-y` explicite sur la liste et ses boutons ; nouvelle `suivreChoix()` (fait défiler la liste seule, sans `scrollIntoView`, pour amener la phrase sélectionnée à l'écran) appelée par `surligner()`, les flèches et au redimensionnement ; `indicateurChoix()` pose `.plusBas` / `.plusHaut` (fondu par `mask-image`) ; `scrollTop = 0` à chaque réécriture.
- **Tests** (Chromium sans écran, 4 formats iPad/téléphone) : manette et flèches, la phrase choisie reste visible ; défilement au doigt et toucher d'une phrase du bas OK. Non testé sur un vrai iPad/Safari ni avec une vraie manette.

## HDF : ENCLOS 1.3 — l'équilibre entre l'action et le texte (lots A et B)
Le hameau ne se raconte plus seulement par le texte : il se vit aussi avec les mains et les jambes. Le texte reste là, mais il va à l'essentiel, et les révélations se jouent en scènes.

### Lot A · L'action (bloc « 1.3 (phase 2) — L'ACTION »)
**Infiltration et cache-cache, pendant les fouilles.** Chaque blouse a une jauge de soupçon (`infiltration`). On n'est plus repéré à l'instant où l'on entre dans la lampe.
- La lampe porte à 12 m devant, 15 m si vous courez, 7 m si vous êtes accroupi (une fois et demie plus loin quand il fait encore clair).
- Une maison entre la lampe et vous vous cache (`cacheParMaison`).
- La course s'entend, même dans le dos de la blouse.
- À mi-jauge, la blouse s'arrête, se tourne vers vous et fouille du regard : « Il y a quelqu'un ? ». C'est le moment de vous baisser ou de vous glisser derrière un mur.
- Jauge pleine, elle court. Pour lui échapper : une cachette, une porte, ou de la distance.
- À l'écran, un œil se remplit (ambre) et une flèche indique d'où vient le regard. Repéré, l'œil passe au rouge.
- Le faisceau s'allonge au sol : une seconde lumière, plus loin devant, montre où la lampe porte.

**Poursuites et fuites.**
- **Le voleur.** Un habitant affamé, de penchant voleur, file avec deux ou trois rations d'une maison, en plein jour. La nuit, si vous veillez dehors, le vol de nuit se joue aussi sous vos yeux (`volEnDirect`). Il court vers chez lui, avec un détour pour vous semer si sa maison est trop proche. Rattrapez-le en gérant votre souffle : en courant, vous le plaquez au sol ; sinon, Carré « Attraper ». Il rend les rations, ou il se bat (selon son tempérament). S'il referme sa porte, les rations sont perdues, mais vous savez qui c'est (`VIE.flags.voleurVu`).
- **Le provocateur.** Un habitant qui vous hait vient vous barrer la route. Trois choix : calmer le jeu (selon votre calme et son tempérament), se battre, ou partir en courant. Il vous court alors après ; une porte, un détour ou de la distance, et il abandonne.
- **L'évasion chronométrée.** Dès que vous tenez la carte à ruban pendant une fouille, le train n'attend plus : moins de deux minutes, avec le compte à rebours dans les objectifs. Ensuite, un coup de sifflet, et les blouses regagnent le train.

**Le corps à corps.** Il remplace les dégâts instantanés de l'agression de nuit et de la jalousie (avant : 30 points de santé perdus d'un coup, puis un bouton « Se défendre »).
1. L'adversaire se met en garde (Combat_Idle).
2. Il arme son coup : un signal rouge, un cercle qui se resserre. Direct (0,5 s), crochet (0,62 s) ou coup de pied (0,78 s).
3. **Rond** au bon moment : vous esquivez d'un pas de côté, et il est découvert pendant près d'une seconde.
4. **Carré** pendant qu'il est découvert : vous frappez (20 points, 26 tôt dans la fenêtre, 32 avec le couteau). Frapper dans sa garde, c'est se faire parer (Block) plus d'une fois sur deux.
- Deux barres : la vôtre (votre santé) et la sienne.
- **Victoire :** il demande grâce et s'enfuit. Sa relation baisse ; les témoins s'en souviennent (en bien si vous vous défendiez). Avec le couteau, il est blessé et le hameau le sait.
- **Défaite :** il vous laisse à terre, prend deux rations chez vous, et vous vous évanouissez.
- **Fuir :** à plus de 9 m, le combat s'arrête, et il vous traite de lâche.
- **Victor apprend à se battre.** Le premier moment d'action est un entraînement (Victor, sinon Julien ou Karim) : coups lents, dégâts faibles, et l'on apprend à attendre qu'il se découvre.
- Commandes : manette Rond ou Croix pour esquiver, Carré pour frapper ; clavier Espace ou C pour esquiver, E ou F pour frapper ; sur l'écran tactile, deux grands boutons.

**Les épreuves physiques.**
- **Porter.** Au puits : « Puiser et porter deux seaux chez vous ». Avant, douze seaux se remplissaient d'un geste. Une jauge « Bras » se vide quand on marche (plus vite si l'on est fatigué, blessé, ou sous la pluie) et se recharge à l'arrêt.
  - Si les bras lâchent, les seaux cognent le sol et l'eau se répand.
  - Si l'on saute, l'eau gicle.
  - On ne peut pas courir avec les seaux, et l'on marche à 62 % de sa vitesse.
  - Arrivé à la porte, l'eau qui reste rejoint les bacs : jusqu'à 6 seaux par voyage.
  - On voit les deux seaux au bas de l'écran.
  - Les anciens et les blessés vous demandent aussi de leur porter de l'eau.
- **Grimper.** Des crampons ont été posés sur la tour nord-est et la tour sud-ouest.
  - Main gauche, main droite : Carré puis Croix, ou les boutons à l'écran.
  - Deux fois la même main, ou trop vite, et l'on glisse.
  - La prise s'use pendant l'ascension, plus vite si l'on est fatigué ou s'il pleut.
  - À mi-hauteur, une prise peut céder : Rond pour se rattraper, sinon c'est la chute et la santé baisse selon la hauteur.
  - En haut, une niche. Tour nord-est : trois clous, une corde, et « ILS NOUS COMPTENT ». Tour sud-ouest : deux bougies, des allumettes, et le mot de Paul.
  - Élodie ou Bastien peuvent vous y envoyer.
- **Soulever.** La pile de bûches s'effondre sur un habitant ; un cri, un objectif urgent. Il faut soulever (appuyer vite), puis tenir. Deux essais. Si vous échouez, ou si vous arrivez trop tard (75 s), il est blessé ; si vous réussissez, il vous en est reconnaissant (+15).

**La musique d'action.** Une nouvelle ambiance, rapide, avec un pouls, joue pendant les combats, les poursuites et quand une prise cède.

### Lot B · L'équilibre (bloc « 1.3 (phase 2) — L'ÉQUILIBRE »)
**La phrase-clé.** Les découvertes de quête, les trouvailles et les traces de ceux d'avant s'affichent dans un cadre, en une phrase-clé lue à voix haute.
- « Lire en entier » (Triangle, ou L au clavier) déplie le texte complet.
- Avant, 300 caractères défilaient en sous-titre pendant 6 s, ou dans une notification effacée au bout de 3,8 s.
- Les phrases-clés de la trame sont écrites à la main (`CLES`) ; les autres sont extraites automatiquement (`phraseCle`), jamais un titre en capitales ni un mot coupé.

**Les lettres et la chronique.** Elles commencent par « L'essentiel », en une phrase ; la lettre entière se déplie sur demande. La lettre codée et le récit de la mère restent entiers, car ce sont des énigmes ou des scènes.

**Les scènes jouées.** Les révélations de la trame se jouent (`SCENES`) : encoches, première lettre, lampe, chaussures, lendemain de raid, conseil.
- Les habitants concernés arrivent et se placent.
- Ils montrent, se répondent, et la caméra cadre celui qui parle, entre deux bandes de cinéma.
- On peut passer la scène (Rond). Elle s'inscrit au journal.

**Le rythme.** Le metteur en scène compte le temps passé à lire et à parler (dialogues, lettres, carnet, révélations, scènes).
- Au-delà d'environ 75 s de lecture, ou après 2 min sans rien de neuf, vient un moment physique : entraînement, accident au bûcher, vol, eau à porter, tour à grimper ou provocation.
- Après la tension, 100 s de calme ; un habitant vient vous parler d'ici une demi-minute.
- Au plus une action toutes les 2 min 30, et un plafond par jour pour chaque sorte (pas d'accident au bûcher toutes les cinq minutes).

**Les gestes justes** (`GESTES`). Chaque activité joue sa suite de gestes au lieu d'un seul geste figé.
- La pêche : lancer, attendre, mouliner, ramasser, dans l'ordre.
- Le four : pétrir, étaler, enfourner.
- Le lavoir : frotter, tordre.
- Le potager : biner, ratisser, arroser, semer.
- Le bois : fendre, ramasser.
- L'atelier : marteler, scier.
- La cuisine : couper, fouetter, poêle.
- La vaisselle : frotter, rincer. Avant : « fouetter dans un saladier », en boucle.
- La veillée : parler, écouter, applaudir.
- Les boules : regarder, lancer, applaudir.

Deux autres gestes ont été corrigés :
- la blouse qui fouille une cabane balaie de sa lampe (avant : un geste d'auscultation au stéthoscope) ;
- se recueillir se fait accroupi (avant : un massage cardiaque).

**Le cri a enfin un son.** `sonEvt('cri')` ne jouait rien.

### Banc de tests : 100/100 (90 tests)
Les 57 tests de la 1.2.2, plus 33 pour l'action et l'équilibre :
- **infiltration :** jauge progressive, puis course ; accroupi hors de portée ; course qui s'entend dans le dos ; une maison qui cache ;
- **voleur :** fuite avec les rations, plaqué au sol, vol consommé s'il rentre chez lui ;
- **combat :** signal à l'écran et musique d'action, coup qui porte sans esquive, esquive au bon moment, riposte, victoire et ses suites, agression de nuit devenue un vrai combat ;
- **épreuves :** porter (ralentir, bras qui lâchent, eau renversée, eau versée dans les bacs), grimper (même main qui glisse, niche, descente), soulever les bûches ;
- **fuites :** semer le provocateur, évasion chronométrée, vol de nuit sous vos yeux, entraînement de Victor ;
- **équilibre :** phrase-clé et texte entier, phrase-clé automatique, traces, lettre résumée, scène jouée (arrivée, répliques, fin propre, passer), rythme (action après la lecture, calme après l'action), pêche dans l'ordre, vaisselle, audit des clips (chaque geste utilisé existe).

Trois tests anciens ont été rendus indépendants de l'heure et du temps écoulé depuis l'ouverture de la page : la rumeur, l'acte V et l'esquive (une régénération infime de la santé faisait échouer une comparaison stricte).

## HDF : ENCLOS 1.2.2 — livraison 3 (lots 5 et 6) : la vie de la maison, audit final
### Lot 5 · La vie de la maison (bloc « LOT 17 (phase 2) »)
**Les repas se prennent ensemble,** à heure fixe : 7 h, 12 h 30, 19 h 45.
- Tout le monde rentre et se met à table. L'heure du repas interrompt la marche ; avant, chacun mangeait à son heure.
- Pendant le repas, la table est mise : assiette, couteau, fourchette et verre à chaque place.

**Les corvées tournent chaque jour** entre les habitants (`roleDuJour`) :
- **la cuisine :** 40 min avant chaque repas, au fourneau (Cook_Pan). Si personne ne la fait, on mange froid et le moral baisse ;
- **la vaisselle :** après chaque repas, à l'évier. Tant qu'elle n'est pas faite, la vaisselle sale reste sur la table, jusqu'au lendemain s'il le faut ;
- **le ménage :** le matin, si la maison est sale. La propreté baisse chaque jour.

**Les rancœurs.** À 23 h, si la vaisselle traîne, celui dont c'était le tour est noté par ses colocataires (mémoire History Sens, regard négatif). On l'entend dans leurs répliques : « Devinez qui devait la faire », « Ne commencez pas », « Une porcherie ».

**Chez vous, vous pouvez tout faire :**
- faire la vaisselle (mini-jeu « frotter, rincer », un seau d'eau) ;
- préparer le repas de la maison (éplucher dans l'ordre, puis retirer la casserole à temps ; une ration) ;
- faire le ménage.

Vos colocataires s'en souviennent et vous remercient (« Merci pour le repas… »).

**Nouveau besoin : le confort** (les toilettes).
- Il baisse avec le temps, et plus vite quand on boit. Les alertes suivent celles des autres besoins.
- On y va dans la salle de bain de sa maison, ou à la cabane.
- Si l'on se retient trop longtemps, l'hygiène, le calme et le moral en pâtissent.

### Lot 6 · Audit final : cohérence et embranchements
**Défauts trouvés et corrigés :**
- **La trame pouvait se bloquer.** Un habitant ne montrait que deux sujets de quête ; si les siens étaient proposés, l'étape de la trame qui passait par lui (Simone, acte III) disparaissait. Désormais, les étapes en cours passent avant les nouvelles demandes (trois sujets au plus).
- **La trame et le monde ne disaient pas la même chose.** Paul et la trame affirment que le train arrive à l'heure ronde et jamais sous la pluie ; il arrivait à n'importe quelle minute, même sous la pluie. Il arrive maintenant à 1 h, 2 h ou 3 h, et une nuit de pluie le reporte au lendemain.
- **Qui dit son prénom est nommé** dans le sous-titre (avant : « Un voyageur : Moi, c'est Bastien »).
- **Les assiettes de la table étaient invisibles :** le couvercle des cylindres du moteur est orienté à l'envers, et le mobilier est posé à +3 cm. Elles sont maintenant en boîtes arrondies, à la bonne hauteur.

**Audit automatique** (dans le banc) :
- **les 37 quêtes,** étape par étape : type, lieu résolu, meuble présent dans la maison visée, objets, personnes, conditions et repères calculables, récompenses (objets, fragments, recettes) ;
- **les données liées :** fragments (doublons, meubles), recettes, lettres (conditions), rumeurs (quête et donneur), savoirs (personnes), confidences (3 × 19), mini-jeux (types de phases) ;
- **les dialogues :** chaque sujet de chaque habitant répond sans erreur (plus de 150 réponses) ;
- **les sons :** un bruitage trop ancien n'est jamais joué, la file est bornée ;
- **le budget :** moins de 500 000 triangles, dehors comme dedans.

### Banc de tests : 100/100 (57 tests)
Les 46 tests de la 1.2.1, plus onze :
- le cuisinier du jour au fourneau ;
- le repas pris ensemble ;
- une chaise chacun ;
- la vaisselle sale qui reste, puis faite par le plongeur ;
- la vaisselle faite par le joueur ;
- les assiettes sur la table ;
- les toilettes ;
- l'audit des quêtes ;
- l'audit des dialogues ;
- les sons ;
- le budget.

## HDF : ENCLOS 1.2.1 — livraison 2 (lots 3 et 4) : chaque recoin, actes II à V vérifiés, choix qui changent le monde
### Lot 3 · Les traces de ceux d'avant (bloc « LOT 16 (phase 2) »)
Quinze traces laissées par les convois précédents, une dans chaque coin de l'enclos. Une petite lueur les signale de près, et le Carré propose de les examiner. Chacune est un fragment de récit :

| Lieu | Ce qu'on trouve |
|---|---|
| Four | un coin de lettre dans les cendres, de votre écriture |
| Lavoir | « 6e convoi — on a lavé le sang ici » |
| Poulailler | un œuf de bois peint : une date, « train » |
| Poterie | un tesson : une table ronde, sept chaises, une renversée, une enfant dans une porte |
| Mare | dix-neuf alliances sur un fil rouge, dont une à vos initiales |
| Boules | une boule creuse : « Ne faites pas confiance à celui qui organise » |
| Enclos | la cloche qui sonne seule quand ils arrivent |
| Cimetière | une croix sans nom, des roses de jardin fraîches |
| Borne | « FERAL 40 — à pied : jamais — en train : une fois » |
| Tour nord-est | un calendrier de trente-trois jours |
| Tour nord-ouest | « Jeanne », et « pardon Odile » |
| Tour sud-est | une cachette de guetteur, vue sur le portail |
| Tour sud-ouest | « 39… 55 », une flèche vers le mur ouest |
| Puits | des traces d'ongles, de l'intérieur |
| Cabane des Delorme | dix-neuf manteaux, un billet à votre nom |

- **La quête « Les traces de ceux d'avant »** s'ouvre après le carnet de l'acte I. Elle a trois paliers : 5 traces (bougies, bandage, un souvenir), 10 (rations, corde), 15 (un fragment, et un secret : à plusieurs, la porte du milieu se referme ; il faut y aller seul ou à deux). Son repère vise la trace la plus proche qui reste à trouver.
- **Nouveau sujet de dialogue,** dès trois traces : « Les traces des convois d'avant », avec des réponses propres à Paul, Odile, Simone, Victor et Clara.

### Lot 4 · Des choix qui changent le monde
- **Fin de l'acte III — la réserve :**
  - *la révéler à tous* : chaque maison reçoit trois rations, tout le monde vous en sait gré (relations +6, moral +10), et les habitants en reparlent ;
  - *la garder* : votre calme baisse, et les plus perspicaces remarquent que vous mangez mieux qu'eux.
- **Fin de l'acte IV — les nuits :**
  - *organiser des tours de garde* : deux veilleurs par nuit au portail, de 22 h à 2 h, à tour de rôle (Victor, Julien, Bastien, Karim, Gérard, Margaux). Quand le train arrive, le veilleur crie « Le train ! Cachez-vous ! » et tout le monde court se mettre à l'abri ;
  - *chacun pour soi*.
- **L'épilogue de l'évasion** raconte vos choix : la réserve partagée ou gardée, les veilleurs, le billet de la cabane.
- **Les habitants y réagissent** dans leur premier mot (« Grâce à vous, on mange… », « C'est mon tour de garde… »).

### Actes II à V vérifiés de bout en bout
Le banc joue chaque étape :
- **acte II :** lettre, lampe la nuit, photographie dans le buffet, Sophie, chaussures du mur nord ;
- **acte III :** Simone, code, réserve, chronique, terminal, puis le choix ;
- **acte IV :** fouille, Paul et son relevé, Thomas, le puits, la lettre, puis le choix ;
- **acte V :** lettres, Victor, conseil, carte à ruban, jusqu'à la dernière étape (la porte du milieu, avec son repère).

### Banc de tests : 100/100 (46 tests)
Treize tests s'ajoutent aux 33 de la 1.2 : traces (accessibles, proposées sur place, quête complète, secret), dialogue des traces, actes II à V, les deux choix et leurs effets, les deux veilleurs, l'épilogue.

## HDF : ENCLOS 1.2 — livraison 1 (lots 1 et 2) : corrections, trame en cinq actes, metteur en scène, dialogues
### Lot 1 · Corrections
**Voix de synthèse qui ne démarraient plus (régression 1.1.2).**
- **Cause :** « Continuer » recharge la page, et une partie commencée à la manette n'a jamais reçu de vrai geste. Or Safari n'autorise le son et la synthèse vocale qu'après un toucher, un clic ou une touche ; la manette ne compte pas.
- **Correctif :** un écran « Touchez l'écran pour reprendre » (`#toucher`) apparaît après un chargement, ou quand la partie a été lancée sans toucher.
- **Contrôle à chaque réplique :** si elle ne démarre pas en 4 s (pas d'`onstart`), le jeu redemande un toucher. Si c'est la voix qui ne répond pas, il en change (`VOIXP.mauvaises`). Une synthèse restée en pause est relancée (`resume`).

**Places pendant les activités** (bloc « LOT 14 (phase 2) »).
- **Avant :** la place venait du numéro de la personne (`k % 3`). Deux habitants pouvaient tomber exactement au même point : four, lavoir, poulailler, bûcher des colocataires, potager tiré au hasard, mât.
- **Maintenant :** chaque habitant réserve sa place (`RESA`). Si elle est prise ou bloquée, il prend la plus proche sur un arc autour de ce qu'il regarde, en terrain praticable et hors des obstacles.
- **Mesuré :** 98 cm au plus près.

**Sons.** Les bruitages mis en file pendant une coupure ne sont plus joués en retard : ils sont abandonnés après 1,2 s.

**Robustesse.** Si une voix se bloque, la discussion du mât n'attend pas plus de 6 s par réplique, et les conversations entendues pas plus de 8 s.

### Lot 2 · La trame : « La princesse et le hameau » (bloc « LOT 15 (phase 2) »)
**Le principe.**
- **La structure :** celle d'une quête de Skyrim — amorce, suivi, corps, point d'orgue, résolution.
- **Le suivi :** l'objectif de la trame est toujours affiché en tête (★), avec son repère sur la boussole.
- **L'ouverture des actes :** chacun commence par un bandeau (« Acte I · Tout le monde descend »).
- **Au carnet :** la trame figure en tête de l'onglet Quêtes.
- **D'une boucle à l'autre :** ce que l'on sait déjà se coche tout seul (« Vous vous souvenez… », `MEMOIRE.trame`), sauf ce qui doit être revécu (lettres, nuits, réserve, conseil, carte).

| Acte | Titre | Étapes |
|---|---|---|
| I | Tout le monde descend | le règlement cloué au mât (7 règles, signé I.) · le carnet de l'ancien occupant, dans l'armoire de votre maison · les encoches du portail (six rangées de dix-neuf, la dernière fraîche) · Paul, qui compte tout · la lettre du matin |
| II | La princesse | la deuxième lettre · la lampe qui s'allume seule à l'étage de la Maison du centre (21 h – 1 h) · la photographie d'Ilona enfant, dans le buffet · Sophie la lit · les chaussures alignées au pied du mur nord |
| III | Sous le mur | Simone entend des pas sous le mur ouest · la boîte des Collet (code) · l'escalier de nuit et la porte de métal · la Chronique d'Ilona · le terminal |
| IV | Le train de la nuit | survivre à une fouille · le relevé des trains de Paul · la porteuse radio de Thomas · le blouse qui boit au puits · la lettre « Les visiteurs de la nuit » |
| V | Feral | les lettres jusqu'à « L'homme du portail » · l'ordre de mission de Victor · le conseil au mât · la carte à ruban · la porte du milieu |

- **Nouveaux types d'étape :** « si » (une condition du monde) et « lettre » (le nombre de lettres lues dans la boucle). On peut aussi fouiller « votre maison » (`maison: 'joueur'`).
- **Nouveaux décors :** le panneau du mât ; les chaussures, une vingtaine de paires, au pied du mur nord.
- **La première nuit,** on frappe trois fois à votre porte. Personne, et de la terre fraîche sur le seuil.

### Le metteur en scène : jamais de temps mort
- **Quand rien n'avance** (environ une minute) : un habitant qui a besoin de vous vient vous chercher, même depuis sa maison et même sans s'être présenté. Il marche ou court jusqu'à vous, vous interpelle (« Vous ! Vous avez une minute ? », selon son caractère), se présente, puis le dialogue s'ouvre avec sa quête en premier choix.
- **Les rumeurs :** dites à voix haute près de vous (douze rumeurs, chacune liée à une quête), elles s'inscrivent au journal et rendent la quête disponible.
- **Huit quêtes s'ouvrent dès le premier jour,** au lieu du jour 2.

### Dialogues élargis
- **Huit sujets de la trame,** qui s'ouvrent au fil de l'histoire : le règlement, les encoches, les lettres, la lampe, le mur, la réserve, le train, Feral.
  - Chacun a des réponses propres à certaines personnes, selon leur métier ou leur passé : Paul compte, Clara connaît la pierre, Thomas la radio, Victor l'ordre de mission…
  - Pour les autres, la réponse suit leur caractère.
- **« Qu'est-ce que je pourrais faire, ici ? »** donne toujours une piste concrète : sa propre demande, quelqu'un qui a besoin d'aide, ou l'étape de la trame dite avec ses mots.
- **Trois confidences par habitant** (57 en tout), qui se débloquent avec la confiance (10, 25, 45). Elles restent cohérentes avec sa raison de venir, son métier et son caractère, et relient chacun aux sept familles du vrai Feral. La dernière attend qu'on connaisse le nom d'Ilona.
- **Le premier mot tient compte du moment :** un meurtre récent, une fouille cette nuit, son travail en cours, la pluie, la nuit, la confiance.

### Banc de tests (`shot/banc.js`) : 100/100
33 tests :
- démarrage, menu, emplacements ;
- voyage, annonce, arrêt à quai, porte du train, distances à la descente ;
- rassemblement, installation, acte I étape par étape, dialogues de la trame, « que faire ? » ;
- lits, lettre du matin, places pendant les activités, acte II ;
- metteur en scène (l'appel, puis le dialogue avec la quête), rumeur ;
- sauvegarde, rechargement, chargement, « Touchez pour reprendre » ;
- voix prononcée, voix bloquée détectée ;
- aucune erreur JavaScript.

**Contrôles au build :** syntaxe, doublons de noms, et un contrôle du code caché derrière un `//` en milieu de ligne (`py/lint.py`).

## HDF : ENCLOS 1.1.2 — menu principal, trois sauvegardes, quitter, habitants qui gardent leurs distances
### Menu principal (bloc « LOT 13 (phase 2) »)
- **Continuer :** la partie la plus récente, avec son jour, son heure et son lieu.
- **Nouvelle partie :** on choisit l'un des trois emplacements ; écraser un emplacement plein demande confirmation. La partie démarre à la boucle 1, sans souvenirs.
- **Charger une partie.**
- **Options :** son, voix, effacer les souvenirs des boucles.
- **Quitter.**
- **À la manette :** ▲▼ pour choisir, Croix pour valider.

### Trois emplacements de sauvegarde
- **Où :** dans `localStorage`, clés `hdf-enclos-partie-1` à `3`. Chacun affiche le jour, l'heure, le lieu, la boucle, la date réelle et votre maison.
- **Taille :** environ 540 Ko par partie.
- **Sauvegarde automatique,** dans l'emplacement en cours : à l'installation, chaque matin à 7 h, au réveil, en revenant au menu et en quittant.
- **Quand on ne peut pas sauvegarder** (le jeu dit pourquoi) : pendant l'ouverture et le voyage, avant l'installation, pendant un raid, la capture, une conversation, une activité, en dormant, sous terre, au terminal, caché.
- **Ce qui est sauvegardé :**
  - horloge, besoins, corps et sac ;
  - quêtes et vie du hameau (cultures, bois, frais, feux, eau) ;
  - couples, pouvoir, violence ;
  - réserve, archives du terminal, portail, mémoire des boucles ;
  - la mémoire et les relations de History Sens (`hs.save` / `hs.load`) ;
  - chaque habitant : maison, place au lit, relations, état, position ;
  - le joueur : position, maison, étage.
- **Comment on charge :** la page se recharge à neuf, puis l'état est reposé par-dessus. Les objets du moteur (nœuds, personnages) sont gardés ; les tableaux de bêtes et de ressources sont repris élément par élément. Les habitants reprennent ensuite leur journée là où ils étaient.
- **Vérifié :** sauvegarde, rechargement de la page, chargement. Jour, heure, maison du joueur, besoins, sac, place au lit d'un habitant, relation History Sens entre deux habitants et position du joueur sont identiques.

### Menu de pause
Reprendre · Son · Voix · Sauvegarder · Charger une partie · Abandonner la boucle · **Menu principal** (sauvegarde automatique, puis retour au menu) · **Quitter le jeu**.

Quitter sauvegarde, coupe le son et ferme l'onglet quand le navigateur le permet. Sinon, un écran noir dit « Partie sauvegardée. Vous pouvez fermer cet onglet. », avec un bouton pour revenir au menu.

### Les habitants gardent leurs distances
- **En marchant,** chacun garde 80 cm avec celui qui est devant lui (`espaceDevant`). Il ralentit derrière ; si l'autre ne bouge pas, il le contourne par la droite au bout de 0,8 s.
- **Dans le couloir du train,** on attend son tour.
- **À la descente,** les départs sont espacés de 1,3 s (avant : 0,9 s).
- **Mesuré sur le quai :** 68 cm au plus près, aucun contact.

## HDF : ENCLOS 1.1.1 — textes et voix plus rapides
- **La synthèse vocale** parle 15 % plus vite : débit ×1,1 selon le personnage, de 0,86 à 1,38. Le haut-parleur passe à 1,0 et l'homme du train à 0,94.
- **Le texte** s'écrit à 17,5 caractères par seconde avec le bruitage (avant : 15), à 14 avec la voix (avant : 12,5).
- **Les voix d'hommes et de femmes :**
  - **la reconnaissance du genre,** d'après le nom de la voix, couvre iOS et macOS (Thomas, Daniel, Jacques, Amélie, Aurélie, Marie, Grandma, Grandpa…), Chrome (Google français), Edge (Microsoft Denise, Henri, Paul, Julie…) et Android (`x-fra` et `x-frc` pour les femmes, `x-frb` et `x-frd` pour les hommes) ;
  - **les voix fantaisie** d'Apple (Bad News, Whisper, Bells…) sont écartées ;
  - **chaque personnage** prend une voix de son sexe ; au-delà de 64 ans, la voix de grand-mère ou de grand-père si l'appareil l'a ;
  - **sans voix de son sexe,** il prend une voix de genre inconnu transposée (×1,18 ou ×0,82). En tout dernier recours, une voix de l'autre sexe fortement transposée (×1,45 ou ×0,6), jamais à hauteur normale ;
  - **testé** avec une liste de voix iPhone : 19 personnages sur 19 ont une voix de leur sexe.
- **Défaut corrigé :** l'empreinte de chaque personnage (entier non signé) était décalée avec `>>`, qui la rendait négative. Dix personnages sur dix-neuf n'avaient alors aucune voix, et les hauteurs étaient faussées. Corrigé avec `>>>`. Les voix chargées après la première réplique sont maintenant reprises (`VOIXP.gen`).
- **Le numéro** passe en 1.1.1 ; la 1.2 reste réservée au lot « la vie réelle ».

## HDF : ENCLOS 1.1 — activités jouables, voyage en train, rassemblement, musique, voix, dialogues façon Skyrim, sommeil, marqueurs PS4, boussole, temps réel

### Les activités se jouent (bloc « LOT 5 (phase 2) — ACTIVITÉS JOUABLES »)
Toute occupation passe d'abord par un mini-jeu propre à l'activité (`occuper` → `lancerJeu` → `occuperDirect`).

Pendant le mini-jeu :
- **Le personnage :** celui du joueur apparaît, filmé de trois quarts, et fait le geste (animations Joe). Il regarde ce qu'il travaille : la bûche, la mare, le four, la vache…
- **Le score (0 à 100 %) :** il règle ce que l'activité rapporte. Selon l'activité :
  - il multiplie l'effet ;
  - il le déclenche au-delà d'un seuil, sinon c'est raté : rien n'est perdu, on recommence ;
  - ou c'est le jeu lui-même qui décide de ce qu'on obtient (les perches pêchées, les œufs trouvés).
- **Après le mini-jeu,** le temps file comme avant (×60).
- **Abandonner :** Échap, Rond ou « Arrêter ».

**Treize mécaniques, réglées et combinées pour chacune (`JEUX`, une ligne par activité) :**
- **timing** : frapper dans la zone (zone mobile, vitesse croissante) ;
- **mash** : appuyer vite contre la retombée ;
- **alterne** : gauche, droite, en rythme régulier ; peut se jouer contre le froid ;
- **tenir** : garder l'aiguille dans une zone qui bouge, en maintenant ou relâchant ;
- **remplir** : maintenir puis relâcher dans le vert, sans déborder, casser ou effondrer ;
- **sequence** : flèches dans l'ordre, en temps limité ;
- **rythme** : notes ou pas en mesure ;
- **attente** : réagir au signal, pas avant ;
- **guet** : agir sur une silhouette, pas sur une ombre ;
- **peche** : attendre la touche, ferrer, puis ramener en gérant la tension de la ligne ;
- **boules** : viser, puis doser, contre un adversaire ;
- **souffle** : maintenir en inspirant, relâcher en expirant ;
- **cherche** : la paille frémit là où il y a quelque chose ;
- **choix** : ce qu'on écrit, et ses effets ;
- **lecture**.

| Activité | Mécanique | Ce que le score change |
|---|---|---|
| Couper du bois | timing (5 coups) | nombre de bûches |
| Travailler au potager | alterne (bêcher), puis séquence (désherber) | soin et humidité du sol |
| Arroser | remplir (4 rangs) | humidité |
| Récolter | remplir « tirer sans casser » | à partir de 80 % : 2 rations de plus |
| Réparer le treuil | séquence, puis timing | état du treuil |
| Nourrir les poules | timing, zone mobile | réussi ou raté |
| Chercher les œufs | cherche (9 pondoirs) | œufs trouvés |
| Traire | alterne régulier | à partir de 85 % : un pot de plus |
| Tondre | tenir, zone mobile | à partir de 85 % : une toison de plus |
| Pêcher | pêche (3 touches) | perches prises |
| Faire le pain | mash (pétrir), puis timing (doré) | pain de plus, ou croûte brûlée |
| Laver le linge | alterne contre le froid | propreté |
| Balayer | séquence | réussi ou raté |
| Tourner un bol | tenir (centrer), puis remplir (monter les parois) | réussi ou raté |
| Guitare | rythme | moral, calme |
| Danser | rythme à flèches | moral |
| Boules | viser et doser, 3 mènes | partie gagnée ou perdue |
| Se recueillir, se reposer | souffle | calme |
| Monter la garde | guet (5) | pas de vol cette nuit, ou si |
| Écrire | choix (souvenirs, lettre à Ilona, horaires du train) | effet choisi |
| Lire | lecture (le roman sans couverture) | calme, moral |
| Fouiller | cherche (6 recoins) | trouvé, ou rien |
| Établi, cuisine, fabrication, filage | timing et séquence, tenir le feu, tresser, rouet | réussi ou raté |

Les étapes de quête ont aussi leur geste : creuser, assembler, flamme, coudre en mesure, descendre la corde, frotter, tenir la clé du double fond, forcer la caisse, démonter et viser.

**Commandes :**
- **action (appui ou maintien) :** Espace, E, Entrée, Croix, Carré, ou le bouton ● ;
- **directions :** les flèches, ZQSD, la croix directionnelle, L1 et R1, ou les boutons ◀ ▲ ▼ ▶ à l'écran ;
- on peut aussi toucher directement les cases (fouille) et les choix (écrire).

### La course (manette)
L3 bascule la course jusqu'à ce qu'on lâche le stick ; avant, il fallait garder le stick enfoncé. R2 et Maj restent possibles.

### Le corps des habitants
- **Ils courent** (`clipTrajet`, vitesse ×2,3) :
  - à l'annonce d'un raid ;
  - sous la pluie (sur plus de 12 m) ;
  - quand un besoin est pressant ;
  - pour un rendez-vous ;
  - parfois quand ils sont en retard au repas ;
  - les impatients de moins de 45 ans, certains jours ;
  - en fuyant (agression, tenus en joue, coup de feu).
- **Ils se faufilent accroupis** (Crouch_Walk, ×0,55) pour une visite secrète de nuit (liaisons du lot 4) : les caméras les voient.
- **Ils sautent :**
  - par-dessus les flaques et les racines en courant, plus souvent sous la pluie ;
  - de joie aux boules ;
  - en sursaut au coup de feu, puis ils se baissent (Crouch_Idle) et certains s'enfuient chez eux.

### Le rassemblement au grand mât (bloc « LOT 6 (phase 2) »)
1. **Le portail refermé,** tout le monde marche vers le grand mât et se met en cercle. Objectif : « Rejoindre les autres au grand mât ».
2. **La discussion :** quand le joueur arrive (ou au bout de 2 min 30), elle commence. Dix-sept répliques (`DISC`) :
   - « Ce n'est pas le Hameau de Feral », la mairie, l'église de la sœur d'Odile, les cartes de Clara ;
   - Bastien qui court secouer le portail (« Fermé à clé. De l'autre côté. ») ;
   - le téléphone mort, la forêt sans oiseaux, le fils de Gérard, la photo d'Élodie ;
   - l'organisateur qui s'impose, Margaux qui le conteste, Léa qui propose de se dire les prénoms.
3. **Les premières relations :** les accords rapprochent, les heurts braquent (History).
4. **La répartition** (`repartitionMaisons`) : l'organisateur (le plus ambitieux, souvent Victor) propose : « Sept maisons. On se répartit. » Chacun va là où il s'entend le mieux avec ceux qui y sont : brouillés séparés, plus âgés de plain-pied, lits comptés.
5. **Votre maison :** on vous propose une maison, celle où l'on vous apprécie le plus. Vous pouvez accepter, ou en demander une autre où il reste un lit, même vide. Vos colocataires en découlent.
6. **La nuit :** chacun rentre chez soi.

### Le voyage d'ouverture (bloc « LOT 11 (phase 2) — LE VOYAGE »)
- Le jeu commence **dans le train qui roule**, juste après le carton titre (3,4 s). On est assis dans la voiture 1 : on regarde partout, mais on ne se lève pas tant que le train roule (« Le train roule encore. »).
- Le voyage dure **60 s** : croisière à 15 m/s pendant 30 s, puis freinage régulier jusqu'à l'arrêt à quai (675 m de voie, dans la forêt). Fonctions `resteVoyage(t)` et `vitesseVoyage(t)`.
- **À 30 s :** carillon de gare (trois notes), puis le haut-parleur : « Le Hameau de Feral, tout le monde descend. »
- **À 40 s,** une voyageuse réagit. Les 9 dernières secondes, les freins crissent.
- **Le son :**
  - le roulement (une seule source de bruit filtrée, qui suit la vitesse) ;
  - les claquements doubles des joints de rail, tous les 18 m.
- La caméra suit le train dans la même image (`majVoyage` décale aussi l'œil déjà calculé). Les plafonniers suivent la voiture. Les zones (`ouSuisJe`) se lisent dans le repère du train.
- Les tests et la simulation font avancer le voyage (appel dans `majPassagers`).

### La musique (bloc « LOT 7 (phase 2) — LA MUSIQUE »)
- **Le train et le quai :** le vent seul. Au rassemblement du grand mât, le vent retombe (×0,35 dès que l'on est au village) et la musique commence.
- **Neuf ambiances,** composées en direct (accords, arpèges, cloches, piano, nappes, bourdons) :

  | Ambiance | Quand |
  |---|---|
  | arrivée | rassemblement au mât |
  | jour | 6 h – 17 h 30 |
  | soir et veillée | 17 h 30 – 21 h 30 (guitare) |
  | nuit | le reste de la nuit |
  | raid | pouls, bourdon grave |
  | réserve | froid, aigu |
  | terminal | bourdonnement |
  | lettre | piano |
  | capture | dissonance |

- **Les motifs d'événement :**
  - violence : coup de feu, meurtre découvert ;
  - quête accomplie ;
  - découverte d'un fragment ;
  - conseil ;
  - nuit d'amour.
- **Rigueur du son :**
  - **deux files :** les notes sont ordonnancées sur l'horloge audio 0,45 s à l'avance ; les motifs attendent leur tour (jamais deux l'un sur l'autre) ;
  - **après une coupure** (onglet caché, Safari qui suspend), on repart de maintenant : aucune rafale de notes rattrapées ;
  - **pas de saturation :** 48 voix au plus, limiteur en sortie, enveloppes douces (rien ne démarre ni ne s'arrête sèchement), fondus de 3 s ;
  - **le volume suit le jeu :** feutrée dans les maisons, plus basse pendant une activité ou un dialogue, et elle s'efface quand quelqu'un parle ;
  - « Son : coupé » arrête tout calcul.

### Les voix et les dialogues en grand (bloc « LOT 9 (phase 2) »)
- **Chaque personnage a sa voix,** toujours la même : hauteur, débit et timbre tirés de son sexe, de son âge et de son identifiant.
- **Trois modes,** au menu « Voix » :
  - **parlées** (par défaut) : la réplique est prononcée par la synthèse vocale de l'appareil, avec une voix française de son sexe ;
  - **bruitage :** une petite voix synthétique qui « parle » syllabe par syllabe. Un seul oscillateur permanent, modulé : aucun nœud audio n'est créé par syllabe ;
  - **muettes.**
  Sans voix française sur l'appareil, le mode « parlées » passe au bruitage.
- **Le texte s'écrit au rythme de la parole.** Toucher ou cliquer le texte l'affiche en entier. Les conversations entendues et les répliques du mât attendent que la précédente soit dite.
- **Protection Safari :**
  - une seule réplique prononcée à la fois, dans une file ;
  - priorité au dialogue avec le joueur ; les répliques entendues de plus de 8 s sont abandonnées ;
  - 180 ms entre `cancel` et `speak` (sinon Safari perd la réplique) ;
  - la réplique en cours reste référencée (sinon Safari oublie d'en signaler la fin) ;
  - un garde-fou arrête une réplique qui ne finit pas ;
  - le premier geste débloque la synthèse (réplique muette) et relance le contexte audio, dans le même geste ;
  - Safari iOS ne débloque le son qu'au relâcher du doigt ou au clic : écoute ajoutée sur `touchend`, `click` et `mouseup` ;
  - après chaque réplique, au retour sur l'onglet et toutes les 1,5 s, si le contexte est « interrupted », on le relance ; s'il reste coupé, un message demande de toucher l'écran ;
  - si la synthèse coupe le son trois fois, elle se désactive d'elle-même (bruitage) et le joueur est prévenu.
- **Le dialogue, façon Skyrim :**
  - **le cadrage :** l'interlocuteur est automatiquement centré et cadré en buste. La caméra vise le haut de sa poitrine (la tête dans le tiers haut) et le champ se resserre selon la distance (de 26° à 50°, environ 1,4 m de hauteur visible) ;
  - **l'écran :** le reste de l'interface disparaît ;
  - **le nom** s'affiche à droite de la tête, son métier en dessous ;
  - **la réplique** est sous la personne, en grand (18 à 27 px), sans fond, avec une ombre portée ;
  - **les sujets** sont dans un encadré centré (bord clair, fond sombre translucide) : cinq lignes visibles, puis défilement. Le sujet choisi est entouré ; les sujets déjà abordés sont grisés ;
  - **en bas à droite :** « ✕ Choisir · ○ Partir » en pictogrammes PS4. Au clavier, Entrée et Échap en petit à côté ; « Partir » se touche aussi ;
  - **commandes :** ▲▼ et Croix à la manette ; ↑↓ et Entrée au clavier ; 1–9 et Échap restent possibles.
- **Les sous-titres** sont en grand aussi, avec le nom au-dessus.

### Dormir dans son lit (bloc « LOT 8 (phase 2) »)
- **Les places :** chaque lit offre une ou deux places (un lit double a deux côtés). Ensuite viennent les canapés, puis un matelas par terre, posé du côté du lit où il y a la place.
- **Qui dort où :**
  - chaque habitant a **sa** place, gardée nuit après nuit ;
  - les couples partagent un lit double ;
  - celui qui dort chez quelqu'un d'autre prend la place libre à côté de lui, sinon le canapé, sinon le matelas ;
  - un côté du lit du joueur lui reste ;
  - jamais deux corps au même endroit.
- **Le corps :** allongé sur le dos (Lie_Back), la tête sur l'oreiller, à hauteur du matelas, sous une couverture. Les couvertures sont 16 nœuds réutilisés, placés seulement sur les dormeurs visibles.
- **Le joueur** se couche du côté libre de son lit ; si le lit est plein : « Quelqu'un dort déjà dans ce lit. »

### Marqueurs d'interaction (bloc « LOT 10 (phase 2) »)
- **Le marqueur :** au-dessus de ce qu'on peut utiliser (porte, personne, meuble, escalier, puits, boîte aux lettres, station, bête), un marqueur flottant montre l'action et sa touche :
  - toujours le pictogramme PS4 **Carré**, avec « L1 plus » pour la roue (E en petit au clavier) ;
  - sur écran tactile, on touche le marqueur lui-même (le bouton du bas reste).
- **La taille** suit la distance.
- **Le bouton d'action** montre aussi le Carré.

### La boussole (bloc « LOT 12 (phase 2) »)
- **Le bandeau :** en haut au centre, façon Skyrim : noir, à double filet clair, terminé par deux losanges. Les points cardinaux (N, NE, E, SE, S, SO, O, NO) défilent avec le regard (±90° visibles). Le nord est −z.
- **Les icônes, en clair :**
  - les objectifs : losange ambre plein pour le principal, contour pour les trois suivants. Un objectif dans une maison vise sa porte ;
  - votre maison (pleine, dorée) et les autres maisons ;
  - le grand mât, le puits, le portail, la gare ;
  - les stations du hameau et le cimetière (une croix).
- **Les distances :** les maisons, le puits et les stations apparaissent à moins de 90 m ; le mât, le portail et la gare se voient de loin. Les icônes s'estompent vers les bords.
- **Quand elle s'efface :** pendant l'ouverture, un mini-jeu, le terminal et la capture. Elle reste pendant un dialogue, comme dans Skyrim.
- **Sur un téléphone,** elle prend toute la largeur et les panneaux descendent de 38 px.

### Parler en face
On ne parle qu'à quelqu'un qui est **en face** :
- à ±45° au plus ;
- à moins de 2,6 m ;
- sans rien entre vous, testé par `vueDegagee` :
  - **dans une maison :** pas de cloison, sauf par l'embrasure d'une porte ;
  - **dehors :** aucune boîte de collision (maisons, murs, cabanes) ;
  - **le train :** pas sa paroi, quand l'un est à bord et l'autre non.

Avant : 2,8 m, ±57°, et l'on parlait à travers les murs.

### Le temps réel
- **Les activités ne font plus défiler le temps.** Le mini-jeu dure le temps qu'on le joue : l'effet tombe à la fin du geste, et la fatigue compte pendant le jeu (`JEU.effort`).
- **Une occupation sans mini-jeu** (attendre) se déroule en temps réel, dans un petit bandeau (« … · encore 37 min ») qu'on peut arrêter.
- **Seul le sommeil accélère encore la nuit** (×60). Le défilement rapide du terminal de surveillance reste aussi.

### La porte du train
Le vantail fait maintenant 1,36 m sur 1,93 m : fermé, il couvre l'ouverture (1,10 m), le retrait de la charnière (0,17 m) et recouvre le montant. Avant, il faisait 1 m sur 1,82 m : il restait un jour de 33 cm par lequel on voyait l'homme disparaître.

## HDF : ENCLOS — le nom et le numéro de version

Le jeu s'appelle **HDF : ENCLOS** ; version actuelle **1.5.2**. Le kit, le fichier HTML, la note et le zip portent ce nom : `HDF ENCLOS 1.3` (le deux-points est interdit dans les noms de fichiers).

À chaque livraison, le numéro monte (1.1, 1.2…) à cinq endroits :
1. le nom des fichiers ;
2. la balise `<title>` ;
3. la ligne du menu de pause (`#hdfVer`) ;
4. l'écran d'accueil (`.acVer`) ;
5. la constante `HDF_VERSION`.

Le script `py/p2ver.py` (fichier, version) fait les trois derniers d'un coup.

## Phase 2 · Lot 3 : la réserve sous le mur (code 3955, caméras, l'arme, la chronique)

**Comment on le découvre (une seule manière).**
- **La boîte :** chez les Collet, une petite boîte en bois est posée sur la table (`LETTRE_CODE`, visible dans la maison). « Ouvrir la petite boîte en bois » donne la lettre : « Tu ne sortiras pas. Vérifie bien les murs de l'enceinte : ils sont solides, mais avec 3955 tu auras plus d'espace que les autres. »
- **L'écriture est celle du joueur :** une boucle passée s'est laissé ce mot.
- **Aucun repère ni objectif** ne conduit à la porte du mur ouest. Le code connu est gardé d'une boucle à l'autre (`MEMOIRE.code`).

**L'escalier, seulement la nuit.**
- **Entre minuit et 7 h**, « Descendre l'escalier » affiche « Ce n'est sûrement pas une bonne idée. », puis un fondu. On arrive en bas d'un couloir de béton, devant une immense porte de métal à deux vantaux, avec son digicode.
- **Le jour**, rien n'a changé : la phrase, puis « Bizarre » pendant 3 s.

**Le digicode** (`#clavier`) : touches à l'écran, chiffres du clavier, Entrée, Retour ; à la manette, la croix et Croix. 3955 ouvre (deux bips, grondement, les vantaux glissent dans le mur). Un mauvais code affiche « ERREUR ». Le code se retape à chaque visite. Pour sortir : « Ouvrir la porte » de l'intérieur, à toute heure, puis « Remonter l'escalier ».

**La réserve** (`RS`, `construireReserve`).
- **Où :** une salle de 28 × 22 m, 8 m sous le sol, derrière le mur ouest. Néons, dallage de béton, et la pyramide noire peinte au mur. Elle n'est dessinée que quand on y est.
- **Ce qu'on y trouve :**
  - trois rayonnages de cartons et de caisses ;
  - le terminal (six écrans) ;
  - un établi (il sert d'établi de fabrication) ;
  - la longue caisse « TEST 7 — NE PAS RÉCUPÉRER » ;
  - une cible au mur ;
  - un lit de camp (on y dort à l'abri) ;
  - la table de nuit et la Chronique ;
  - des provisions : 20 rations par boucle, la citerne remplit la gourde, 4 bandages ;
  - une cellule (« Julie C. », « Bruno » gravés au mur).
- **Sécurité :** on y est à l'abri du froid. Pas d'agression, et les scientifiques ne descendent pas.

**Le terminal : les caméras des tableaux** (`camerasTableaux`, `entrerSurveillance`).
- **Les caméras :** il y en a une par niveau de chaque maison, cachée dans la toile au-dessus de la cheminée (la reine Ilona) ou dans les tableaux F.S.M. On voit vraiment la pièce, en direct : noir et blanc, grain, REC, heure, grand angle. Un léger panoramique est possible.
- **Les commandes :**
  - ◀ ▶, les flèches ou Q et D pour changer de caméra ;
  - « Accéléré ×20 » ou Espace ;
  - « Quitter le terminal », Échap ou E ;
  - à la manette : la croix gauche ou droite, Croix, et Rond pour quitter.
- **Ce que la caméra montre :** les habitants ne se savent pas observés.
  - **Ce qu'ils murmurent (`aparte`) :** le meurtrier qui fait la leçon à son colocataire, le voleur qui compte les boîtes cachées, l'amant secret, le comploteur, le chef corrompu, ce qu'on dit du joueur, les rancunes, ceux qui pleurent, ceux qui parlent en dormant (« dix-neuf… on recommence… »).
  - **Les archives** des dernières nuits, par maison (`archiver`) : vols, meurtres, nuits des couples, liaisons, corruption, complots, et les fouilles du joueur.
- **Les preuves :** ce qui a été vu devient une preuve (`RESERVE.preuves`). Elle ouvre de nouveaux choix de dialogue :
  - faire avouer un meurtrier ;
  - faire chanter un voleur, ou le dénoncer aux volés ;
  - révéler une liaison au conjoint trompé, ou faire chanter les amants ;
  - dénoncer un complot au chef.

**L'arme : « L'arme de la réserve », mission en dix étapes** (`QUETE_ARME`, la seule arme à feu du jeu).
1. Forcer la caisse : un revolver hors d'usage et 10 cartouches.
2. Le démonter à l'établi de la réserve. Il a été saboté.
3. Réunir deux chiffons.
4. Prendre de la graisse dans la cabane des Delorme, la nuit.
5. Nettoyer et graisser le mécanisme.
6. Obtenir un ressort d'horloge auprès de Paul (sinon dans le buffet des Ferrand).
7. Faire tailler une goupille par Margaux (sinon dans la cabane des Fabre). Margaux sait à quoi ça sert : la rumeur de l'arme se répand.
8. Trouver une vis fine dans le buffet des Collet.
9. Remonter le revolver.
10. L'essayer à vide face à la cible, la nuit.

Si Paul ou Margaux ne sont plus là, l'étape passe à sa variante. Les objets de quête ne prennent plus de place dans le sac.

**Ce que l'arme change** (`actionsArme`, `sujetsArme`). Chaque tir coûte une cartouche ; il n'y en aura jamais d'autres.
- **Agression de nuit :** en plus de « Se défendre », on peut « Tirer sur X » (il meurt) ou le « Tenir en joue » (il s'enfuit).
- **« (Sortir le revolver) La vérité. Maintenant. »** fait avouer un meurtrier (comme une accusation juste), un voleur (qui rend les rations) ou un amant secret. Pour un innocent : terreur, et −35 de relation. Les témoins s'en souviennent.
- **La menace pour manger** réussit à coup sûr.
- **Un coup de feu s'entend partout.** Le village sait alors que vous êtes armé : moins d'agressions, plus de peur.
- **La convoitise :** si la rumeur a couru, une nuit où l'on dort chez soi, quelqu'un se penche sur le sac (le chef, Victor ou Margaux). On peut tirer, le tenir en joue ou le laisser faire. Laisser faire : il prend le pouvoir par la force à la veillée suivante.
- **Votre chefferie contestée :** si le conseil se retourne contre vous, un tir en l'air vous garde le pouvoir, par la peur.

**Les scientifiques ne meurent pas** (`tirerScientifique`).
- **Ce qui se passe :** si l'on tire sur l'un d'eux, il riposte au pistolet automatique (Aim_Pistol, puis Shoot, quatre tirs). Écran rouge, puis noir.
- **Le réveil :** au pied du mât, une heure plus tard, toutes les jauges au plus bas, avec le message « **Encore en vie ?!** ». Pour le reste du raid, on n'est plus capturé (`RAID.epargne`) : c'est l'ordre d'Ilona.

**La Chronique de Ilona** (`CHRONIQUE`, dix pages, sur la table de nuit) :
1. avant-propos ;
2. le Seuil (la société secrète, la pyramide : la faim, la peur, l'oubli) ;
3. le protocole Feral ;
4. et 5. le registre des sujets de la boucle 12 ;
6. les tests (rareté, chef, jalousie, test 7) ;
7. ceux de Feral envoyés ici ;
8. la cellule (le sas des transferts, le site 2) ;
9. le témoin (« ne pas intervenir ») ;
10. la dernière page, à sa mère et au témoin.

## Phase 2 · Lot 4 : les cœurs et le pouvoir

**Attirance** (`attirance`). Elle combine :
- l'orientation de chacun (`ORI` : la plupart vers l'autre sexe, quelques-uns vers le même, quelques-uns vers les deux) ;
- une affinité propre à chaque paire ;
- l'écart d'âge et le charme ;
- la relation History ;
- les moments passés côte à côte à la veillée.

**Couples** (`soirAmour`, chaque soir à 21 h 30).
- **Former un couple :** une déclaration par soir au plus. Acceptée, c'est un couple, annoncé au journal. Refusée, la personne est blessée et éconduite, et revient plus jalouse.
- **La vie à deux :** les couples dorment ensemble (chez l'un ou chez l'autre : `maisonNuit`, `entrer(a, rôle, chez)`), et leur moral monte.
- **La fin :** ils se séparent quand la relation tourne. L'intimité reste toujours hors champ : « La porte de la chambre se referme. »

**Jalousie.**
- Celui qui désire l'un des deux en veut à l'autre, deux fois plus s'il est « jaloux ». Cela peut aller jusqu'à la bagarre, et nourrir le meurtre de nuit (lot 22).
- Si c'est vous le rival, on vous en veut ; un jaloux peut venir vous menacer à la veillée, puis frapper.

**Infidélité.**
- **La liaison :** les tentés (charmeurs, audacieux, secrets, vantards, impulsifs…) ou les couples qui s'abîment nouent des liaisons secrètes. Les nuits volées sont vues par les caméras.
- **La découverte :** par chance, sous le même toit, par un œil observateur, ou parce que vous l'avez dit. Elle entraîne la rupture, l'humiliation et la vengeance (bagarre). Parfois, les amants restent ensemble.

**Le joueur amoureux.** Les choix de dialogue :
- « J'aime bien quand on parle, tous les deux » ;
- « Ce soir, à la veillée, je m'assieds près de toi ? » (il faut venir s'asseoir près de la personne) ;
- « Je crois que je tiens à toi ».

En couple, on peut ensuite :
- passer la nuit chez l'autre (fondu au noir, moral et calme) ;
- le prendre dans ses bras ;
- rompre.

Il y a des risques :
- les rivaux deviennent jaloux de vous ;
- une personne en couple peut accepter une liaison avec vous ;
- vous pouvez tromper, et être découvert (rupture, rage, agression possible).

**Le pouvoir** (`majPouvoir`, `conseil`).
- **Le conseil :** au troisième soir, le conseil de la veillée élit un chef, puis tous les cinq jours. Comptent l'ambition, le respect, les alliances et la voix du joueur ; ceux qui vous aiment suivent votre soutien.
- **Les choix du joueur :**
  - « Au prochain conseil, je me présente » ;
  - « Au conseil, je voterai pour vous ».
- **Le chef selon son caractère :**
  - **intègre :** il fait partager les vivres ;
  - **corrompu :** il se sert chez les autres ; ça se murmure et ça se voit à la caméra ;
  - **autoritaire :** moins de refus de travailler, moral en baisse.
- **Le complot :**
  - **sa naissance :** il naît de la rancœur, mené par le second du conseil ;
  - **sa fin :** mûr, il destitue le chef au conseil, ou par la force (bagarre). Un tyran armé tire sur l'un d'eux avant de tomber ;
  - **votre rôle :** vous pouvez le rejoindre, ou le dénoncer au chef (récompense, mais le meneur peut savoir que c'est vous).
- **Chef vous-même :** à la veillée, au mât, une décision par jour :
  - ordonner un partage équitable ;
  - garder une part pour votre maison (la rancœur monte) ;
  - punir un voleur dont vous avez la preuve.
- **Le carnet :** sous Gens, « Les cœurs et le pouvoir » montre le chef, les couples, les séparations, et ce que vous savez des liaisons et des complots.

### Vérifié (simulation)
- **La réserve :**
  - descente refusée le jour, permise à 1 h ;
  - porte fermée infranchissable ;
  - code 1234 refusé, 3955 accepté ;
  - toutes les actions de la réserve.
- **L'arme :**
  - mission de l'arme complète (dix étapes, revolver et 10 cartouches) ;
  - tir sur un agresseur (mort, 9 cartouches) ;
  - tir sur un scientifique (réveil au mât, jauges au plus bas, « Encore en vie ?! », épargné).
- **Surveillance et documents :**
  - 9 caméras, apartés et archives, retour à la réserve ;
  - la lettre ; la chronique.
- **Couples et pouvoir :**
  - couple formé (Odile et Hugo) ;
  - conseil (Julien élu 9 voix contre 7) ;
  - complot, destitution.
- **Budget remesuré (1.0) :** la réserve n'est dessinée qu'en bas, ce qui garde les chiffres hors de la réserve.
  - ordinateur : 294 000 à 341 000 triangles dehors, 99 000 dans une maison ;
  - profil iPad : 144 000 à 166 000 triangles dehors, 80 000 dans une maison.

## Phase 2 · Lot 2 : la vie du hameau (sac, fabrication, 20 activités, animaux, 30 quêtes, dialogues)

Tout le contenu est décrit dans des tables, une ligne par élément, au début du bloc « LOT 2 (phase 2) — LA VIE DU HAMEAU : DONNÉES » : `OBJETS`, `NIVEAUX_SAC`, `RECETTES`, `FOUILLE`, `FRAGMENTS`, `ST` (stations), `SOUV_AVANT`, `CONSEILS`, `DONS`, `RUMEURS`, `REVES`, `ILONA_REP`, `EXPLIQUE_ACT`, `QUETES`. Le moteur (bloc suivant, « … : MOTEUR ») ne fait que les lire. L'état de la boucle est dans `SAC` et `VIE`, déclarés en tête (règle TDZ).

**Ce qui reste d'une boucle à l'autre.** Les fragments de Feral (`MEMOIRE.collection`) et les recettes apprises (`MEMOIRE.recettes`) : c'est la mémoire du joueur. Le sac, les quêtes, les stations et les bêtes reviennent à zéro (`reinitVieHameau`, appelée par `resetArrivee`). « Oublier mes souvenirs » efface aussi la collection et les recettes.

### Le sac et les objets
- **Trois niveaux :** sac de toile (8 places), sac renforcé (12), sac de voyage (16). Chaque objet a une pile par place (`pile`) : 4 rations, 10 ficelles, 20 clous, un outil…
- **Au départ :** une gourde (2 gorgées sur 4) et une ration. La gourde se remplit au puits ou à un évier (un seau de la maison).
- **Panneau « Sac »** (bouton Sac, touche I, L2 à la manette, ou la roue) : la grille des places, la fiche de l'objet choisi (manger, boire, se soigner, lire, semer, jeter), et l'onglet **Fabriquer**.
- **Objets de quête** (bord violet) : ils ne se jettent pas. Les **outils** non plus : couteau, marteau (réparations et établi 30 % plus rapides), canne à pêche, panier (cueillette doublée).
- **Manger cru, c'est un pari :** œuf, poisson et surtout champignon peuvent rendre malade (vomissements, −14 de santé ; parfois une intoxication de 12 à 24 h).
- **Dans la roue :** boire à la gourde, manger le meilleur aliment sans risque, se soigner, une tisane si l'on est nerveux.

### Fabriquer (`RECETTES`, `fabriquer`)
- **Où :** n'importe où ; dans une maison ; à l'établi d'une cabane ; sur un feu (votre cuisinière, qui brûle une bûche de la maison, ou une cheminée allumée). Certaines recettes demandent de l'eau (gourde ou seaux).
- **Connues dès le départ :** corde (3 ficelles), filer la laine, canne à pêche, panier, tisane, soupe de champignons, poisson grillé.
- **À apprendre :**
  - bandage (Odile, Inès) ;
  - remède (Inès, Simone) ;
  - omelette (Hugo) ;
  - toile (Agathe) ;
  - sac renforcé (Margaux : conseil ou quête « Le banc du mât ») ;
  - sac de voyage (Agathe : quête « L'atelier de couture »).
- **Le sac renforcé :** 2 toiles, 2 cuirs, 1 corde, à l'établi, 1 h 30. **Le sac de voyage :** 3 cuirs, 2 cordes, 2 boucles, 1 toile, 2 h, à partir du sac renforcé.
- **D'où viennent les matériaux :**
  - **toile :** armoires, Agathe, quête 19 ;
  - **cuir :** Gérard, quête 16, armoires ;
  - **boucles :** canapés, Paul, quêtes 5, 9 et 10 ;
  - **corde :** 3 ficelles, ou Karim ; **ficelle :** fouilles, ou la laine des moutons filée.

### Cueillir, fouiller, collectionner
- **Ressources** (`creerRessources`, environ 60 points) : mûres au bord des ronces, champignons au pied des pins, herbes au pied du mur, bois mort sous les arbres, pierres près des rochers, pommes sous trois arbres. Elles repoussent à l'aube, après 1 à 3 jours. Chaque point est un petit nœud posé par sa matrice (la portée se mesure depuis l'origine du nœud).
- **Fouiller** (armoire, buffet, canapé, lit, cabane) : 10 minutes, une fois par jour et par meuble, butin tiré de `FOUILLE`.
  - Chez les autres, c'est voler. Si un habitant est là, il vous surprend : −15 de relation, il s'en souvient, c'est noté au journal.
  - S'il n'y a personne, la maison s'en aperçoit parfois le lendemain matin (journal, méfiance).
- **Vingt fragments de Feral** (`FRAGMENTS`, onglet « Fragments » du carnet) : la photo de classe, le cahier du puits, le plan du cadastre, le registre des boucles, la lettre de Jeanne, la silhouette sur le mur, l'insigne « Protocole Feral », le billet daté de demain, la fréquence morte, les sept familles, la robe de la chambre du haut, la fleur noire, les sept croix, le dessin d'enfant, 3 h 33, l'ordre de mission, le double fond, la pierre du mur, la gravure de B. Blanc, la cassette.
  - 6 se trouvent en fouillant, 2 sont posés au sol, 12 viennent des quêtes.

### Les stations du hameau et les 20 activités
Stations neuves, sur des emplacements vérifiés libres (arbres, rochers, chemins) : **poulailler** (6 poules), **enclos** (2 moutons, 1 vache), **mare** avec ponton, **four à pain**, **atelier de poterie**, **lavoir** et corde à linge, **terrain de boules**, **vieux cimetière** (7 croix), **borne** contre le mur ouest. Elles ont leurs collisions, et la carte des trajets est refaite avec elles.

| Activité | Où | Effet |
|---|---|---|
| Nourrir les poules | poulailler, 1 fois par jour | œufs le lendemain (5 au lieu de 2) |
| Ramasser les œufs | poulailler, 6 h – 13 h | œufs dans le sac |
| Traire la vache | enclos, 5 h 30 – 11 h | 2 pots de lait |
| Tondre un mouton | enclos, tous les 3 jours | 2 toisons de laine |
| Pêcher | mare (canne) | 0 à 2 perches, mieux sous la pluie ; calme |
| Cuire le pain | four : 2 bûches et un sac de farine (40 par boucle) | 4 pains ; les pains apparaissent sur la table |
| Laver le linge | lavoir (savon en plus) | hygiène +40 (+20) ; le linge sèche sur la corde |
| Balayer la place | mât, 1 fois par jour | moral de tout le village +2 |
| Tourner une poterie | atelier | un bol, à offrir |
| Jouer de la guitare | veillée, si Léa a sa guitare | moral et calme ; ceux qui écoutent s'en souviennent |
| Danser | veillée | moral +10, énergie −6 ; certains se mettent à danser |
| Jouer aux boules | terrain, 9 h – 20 h 30 | moral ; relation avec les joueurs |
| Se recueillir | vieux cimetière, tombes | calme |
| Monter la garde | portail, 21 h 30 – 2 h | pas de vol cette nuit-là |
| Écrire dans son carnet | table de sa maison | calme |
| Lire | dans une maison (livre trouvé) | calme, moral |
| Se reposer sur le canapé | sa maison | calme, énergie |
| Cuisiner | cuisinière, cheminée allumée | recettes « feu » |
| Fabriquer à l'établi | cabanes | sacs, outils |
| Cueillir | partout | ressources |

**Les habitants aussi.** Le matin, ceux qui restaient à la maison ou en surnombre à l'atelier prennent une activité du hameau selon leurs compétences (`repartirActivites`) :
- **Activités et animations :**
  - poulailler : Feed_Scatter ;
  - traite : Milk_Cow, la vache vient se placer ;
  - four : Knead_Dough et Oven_Use ;
  - lavoir : Kneel_Care ;
  - pêche : Fish_Wait, Fish_Cast et Fish_Reel ;
  - place : Sweep ;
  - poterie : Pottery_Wheel.
- **Les boules :** certains soirs, trois ou quatre habitants font une partie avant la veillée (Throw, Clap). Léa joue de la guitare à la veillée (Play_Guitar) quand on la lui a rapportée.
- **Ce que ça produit :** pain (farine), œufs, lait et poisson vont aux vivres de leur maison ; le moral remonte ; le lavoir lave. Le journal le note (« 2 au lavoir, 1 à la pêche… »).

**Les bêtes** (`creerAnimaux`, `majAnimaux`, classes `Joe.Animal` du pack) :
- **Ce qu'elles font :** les poules et les moutons errent dans leur enclos ; la vache broute ; le chat et le chien vont de chemin en chemin.
- **Coût :** simulées par `majPassagers` (elles suivent l'accélération du sommeil), animées à moins de 45 m, dessinées dehors à moins de 60 m.
- **Les caresser** calme. Nourris pour une quête, le chat et le chien vous suivent.

### Trente quêtes en trois étapes (`QUETES`)
Une quête se propose dans le dialogue de celui qui la donne. Il faut le connaître, à partir d'un certain jour, avec assez de confiance, et qu'il ne soit ni malade ni désespéré.
- **Types d'étapes :** fouiller un meuble précis, apporter des objets, parler, rendez-vous, aller quelque part (souvent à une heure donnée), travailler sur place, ramasser, avoir des objets, faire une activité plusieurs jours, interroger plusieurs personnes, trouver, nourrir et ramener une bête.
- **Rendez-vous :** le donneur s'y rend vraiment un peu avant l'heure (`actQuete`) et vous attend.
- **L'étape en cours** est le dernier objectif de la liste (◆), avec son repère : le meuble, la personne, le lieu ou la bête. L'onglet **Quêtes** du carnet montre les étapes faites, celle en cours, et permet de choisir la quête suivie.
- **Récompenses :** objets, recettes, fragments, souvenirs, confiance. Il y a aussi des effets durables :
  - un banc au mât ;
  - un feu de joie ;
  - une guirlande d'ampoules la nuit ;
  - l'infirmerie ;
  - la radio de Thomas, qui annonce les raids ;
  - le chien qui garde la maison de Nadia (plus de vol chez elle) ;
  - le chat chez Léa ;
  - des poules qui pondent mieux ;
  - la paix entre Bastien et Gérard ;
  - un calme plus durable (quête de Sophie).

| # | Quête | Donneur | En bref |
|---|---|---|---|
| 1 | La sœur qui ne répond plus | Odile | une lettre de Jeanne chez les Fabre ; « tu viens toujours » |
| 2 | Le chantier | Bastien | la tour nord-est, la courte échelle : la forêt sans fin |
| 3 | Le dispensaire | Inès | herbes, chiffons, l'infirmerie de la grande maison |
| 4 | La terre vendue | Raymond | la borne « THIEL », l'acte signé « I. » |
| 5 | La pierre du mur | Clara | un basalte venu d'une carrière effacée |
| 6 | Le repas des voyageurs | Hugo | œufs, cèpes, un soir où l'on rit |
| 7 | L'héritage | Nadia | le registre : douze boucles, « sauf un » |
| 8 | La ronde | Victor | des bottes de service au portail ; un couteau |
| 9 | Le banc du mât | Margaux | planches, clous, un banc ; le sac renforcé |
| 10 | La montre arrêtée | Paul | 3 h 33, un sifflet de train |
| 11 | La chanson | Léa | la guitare des Aubry, une chanson de Feral |
| 12 | La fréquence morte | Thomas | « le témoin se souvient » ; la radio annonce les raids |
| 13 | La fleur noire | Simone | à l'aube, sur les tombes des oubliés |
| 14 | Le groupe électrogène | Karim | il tourne sans carburant ; le mât s'illumine |
| 15 | Le reportage | Élodie | une femme en robe claire sur le mur |
| 16 | Le fils | Gérard | « B. Blanc. An 1. » |
| 17 | Les rêves | Sophie | trois rêveurs, le même escalier |
| 18 | Le feu de joie | Julien | quatre bûches, le bûcher, la veillée orange |
| 19 | L'atelier de couture | Agathe | deux toiles ; le patron du sac de voyage |
| 20 | Le poulailler | Gérard | la clôture, nourrir deux jours |
| 21 | Le fond du puits | Karim | une voix d'enfant ; le cahier |
| 22 | La lampe du haut | Odile | une bougie à l'étage ; « Qui t'a permis ? » |
| 23 | Les initiales | Clara | I. 1, I. 2, I. 3 : « Ici, je suis descendue » |
| 24 | La dette | Bastien | trois rations, une poignée de main |
| 25 | Le chat | Léa | le trouver, le nourrir, le ramener |
| 26 | La pêche | Hugo | une canne, trois perches, un panier |
| 27 | Les croix anciennes | Simone | six familles, et une croix sans nom |
| 28 | Le chien | Nadia | un gardien ; plus de vol chez elle |
| 29 | Le double fond | Paul | trois clés ; la lettre de M. |
| 30 | La confession | Victor | l'ordre de mission ; il conduisait le camion |

### Les dialogues
Les conversations proposent jusqu'à huit choix (avant : cinq) : quêtes d'abord, puis l'enquête, les sujets de base et les nouveaux sujets.
- **« Avant le train, vous vous souvenez de quoi ? »** Chacun a un trou de mémoire, et un détail au bord du trou. Victor ne dit rien sans confiance.
- **« Qu'est-ce que vous faites ? »** Ce que l'activité représente pour lui.
- **« Le nom d'Ilona, ça vous dit quelque chose ? »** (après la première lettre) : Odile, Paul, Victor, Sophie, Simone et Gérard savent des choses.
- **« Vous auriez un conseil ? »** Selon le métier ; certains apprennent une recette.
- **« Vous auriez quelque chose à me donner ? »** Une fois par boucle, selon la confiance : le cuir de Gérard, la toile d'Agathe, une boucle de Paul…
- **« J'ai quelque chose pour vous »** (offrir un objet du sac) : chacun a ses goûts (`GOUTS`) ; un affamé apprécie la nourriture.
- **« Laissez-moi vous soigner »** (blessé ou malade, avec un bandage ou un remède).
- **« Quoi de neuf, au village ? »** Le journal, ou une rumeur.
- **« Vous dormez bien, ici ? »** Les rêves de l'escalier et de la porte.
- **« Donnez-moi à manger » (couteau montré).** On obtient deux rations de sa maison, au prix de −40 de relation, de la peur, des témoins (−15 chacun) et d'un souvenir durable. Un sang chaud peut se jeter sur vous. Assez de haine, et il viendra la nuit (lot 22).
- **Saluts :** quand l'hygiène est très basse, on vous le fait remarquer.

### Les actions, et leur place
- **L'action principale** (E, Carré, bouton) suit cet ordre :
  1. une étape de quête sur place, la cueillette ou une bête à nourrir passent avant le reste (sauf pendant un raid) ;
  2. dehors, les stations viennent après le puits, les cabanes et les portes ;
  3. dans une maison, les gestes nouveaux viennent après ceux des meubles (fouiller, écrire, cuisiner, remplir la gourde).
- **La roue** (L1, Tab) liste toutes les actions du lieu, puis les objets du sac à utiliser, puis Sac, Carnet et « Attendre une heure ». S'accroupir reste sur C, Rond et le bouton ⤓.
- **Le couteau** blesse vraiment l'agresseur qui vous attaque la nuit (avant : simple bousculade). Les témoins s'en souviennent.
- **Manette :**
  - L2 ouvre le sac ;
  - dans le sac, la croix gauche ou droite change d'onglet (Sac, Fabriquer) ;
  - dans le carnet, la croix gauche ou droite passe de Gens à Quêtes, puis à Fragments ;
  - Rond ferme le sac.

### Vérifié
- **Simulation :** une quête de bout en bout (fouille chez les Fabre, rendez-vous de nuit au mât), le chat ramené à Léa, Bastien qui se rend à la tour à l'heure dite.
- **Fouilles et menaces :** la fouille surprise (−15 de relation, réplique), la menace au couteau.
- **Fabrication :** la corde et le sac renforcé à l'établi.
- **Activités :** poules, œufs, champignons.
- **Village :** trois jours d'activités des habitants (poulailler, traite, lavoir, pêche, place, poterie, boules) et leur production ; la remise à zéro d'une boucle (sac et quêtes vidés, fragments et recettes gardés).
- **Quêtes sans issue :** une quête dont la personne meurt, est emmenée ou enfermée est marquée « jamais finie ».
- **Budget remesuré :**
  - ordinateur : 294 000 à 334 000 triangles dehors, 99 000 dans une maison ;
  - profil iPad : 144 000 à 166 000 triangles dehors, 80 000 dans une maison.

## Phase 2 · Lot 1 : porte secrète, arrivée verrouillée, corps du joueur, roue L1

- **La porte dans le mur** (`SECRET`, `porteSecrete`, `actionSecrete`, `entrerSecret`, `tenterDescendre`, `sortirSecret`). Mur ouest, z = 58 : planches couleur de pierre sur un seuil surélevé (deux marches de pierre), sans marque ni objectif.
  - **« Entrer »** l'ouvre : on se tient sur le seuil, devant quatre marches qui s'enfoncent dans le noir (cage d'escalier côté forêt).
  - **« Descendre l'escalier »** affiche le sous-titre « Ce n'est sûrement pas une bonne idée. », puis « Bizarre » au milieu de l'écran pendant 3 s.
  - **Pour sortir,** « Ressortir » ou un pas en arrière. La suite se préparera ensemble.
- **L'ouverture ne se passe plus.** Le bouton « Passer », Échap, Espace, Entrée, le clic et les boutons de manette sont sans effet pendant la cinématique.
- **L'arrivée.**
  - Le portail est fermé, avec sa barrière : on ne peut pas entrer pendant le discours.
  - Il ne s'ouvre que quand l'homme montre le chemin (« Suivez le chemin. Bonne soirée. »). Le groupe entre ensuite.
  - Les portes de la voiture 1 sont des vantaux mobiles (`portesTrain`, enfants du nœud du train). Quand l'homme remonte, la porte se referme derrière lui (0,45 s), puis il disparaît. Toutes les portes se ferment au départ.
- **Les collisions** (`collisionsJoueur`, `separationPNJ`).
  - On ne traverse plus les voyageurs, l'homme ni les scientifiques.
  - Un voyageur bousculé en courant réagit (« Faites attention, enfin ! ») et perd 1 de relation.
  - Les voyageurs qui marchent s'écartent les uns des autres et du joueur (à moins de 50 m).
- **Accroupi et saut** (`JOUEUR`, `majCorps`).
  - **Accroupi** (C, Ctrl, Rond, bouton ⤓) : yeux 0,68 m plus bas, marche à 45 %, pas étouffés et plus lents ; un scientifique ne vous voit qu'à 6 m, et seulement bien en face.
  - **Saut** (Espace, Croix, bouton ⤒) : environ 0,7 m, −0,3 d'énergie, un pas à la réception.
- **Le souffle :** une course de 10 s environ le vide ; à zéro, pas de course jusqu'à 30. Une barre fine s'affiche au-dessus de l'action. En courant, un scientifique vous repère à 17 m.
- **La roue** (`ROUE`, `choixRoue`, `ouvrirRoue`, `fermerRoue`).
  - **Ouverture :** maintenir L1, ou Tab, ou toucher le bouton ◎.
  - **Contenu :** 8 choix, selon le moment (action principale, parler, se cacher, s'accroupir ou se relever, attendre une heure, objets, État, Carnet).
  - **Sélection :** au stick, à la souris ou aux touches 1 à 8 ; relâcher valide. Le temps ralentit à 30 % pendant la roue.
- **Le corps parle** (`majVignette`) : bords rouges quand la santé est basse, sombres quand on est épuisé, bleutés quand on a froid.
- **Réveiller quelqu'un :** « Le réveiller » (−3 de relation, il grogne), puis on peut lui parler 30 minutes.
- **Manette remappée** : Carré agir · L1 roue · Croix sauter et valider · Rond s'accroupir et retour · L3 ou R2 courir · Triangle carnet · R1 état · Options menu.
- **Correctif moteur :** `GEO.roundBox` sans rayon donnait des boîtes invisibles (rayon NaN). Le rayon omis vaut maintenant 0. Les contreforts et les tours d'angle du mur réapparaissent, ainsi que les bandes lumineuses du train de nuit, les croix des tombes, le drapeau rouge de la boîte aux lettres et les ferrures du portail.

## 0 novovicies. HUD de jeu, objectifs, son, manette et épilogue (HDF : ENCLOS v1.0)

**Le HUD de jeu.** Tout ce qui servait au développement est retiré : titre, fiche technique du mur, mini-carte, boutons « Survol » et « À pied », réglette de l'heure, « Recentrer la vue », « Revoir l'ouverture », touches V et Tab.
- **À gauche :** les objectifs, le lieu, la météo et les alertes de besoins.
- **À droite :** le jour et l'heure, puis les boutons État (B), Carnet (J) et Menu (Échap).
- **Menu de pause :** le jeu se fige (`A.skipUpdate`). On peut reprendre, activer ou couper le son (choix gardé), ou abandonner la boucle (retour au train, mémoire gardée). Les commandes du clavier, du tactile et de la manette y sont rappelées.

**Les objectifs** (`objectifs`, `majObjectifs`, `majRepere`).
- **La liste :** trois objectifs au plus. Le premier est surligné en ambre ; les urgents (raid, agression, besoin critique, puits cassé) sont en rouge.
- **Le repère :** un losange à l'écran avec la distance pointe vers le premier objectif situé. Il se colle au bord de l'écran avec une flèche quand la cible est hors champ. Si la cible est dans une maison où l'on n'est pas, il vise sa porte (« 34 m · votre maison »).
- **Ce qui est déduit de l'état du jeu :**
  - **arrivée :** descendre du train, écouter l'homme, franchir le portail ;
  - **raid :** se cacher (l'armoire, la cabane ou les buissons les plus proches), rester caché, ramasser la carte (si on le sait), monter dans le train ;
  - **agression :** se défendre ;
  - **besoins :** boire (évier ou puits le plus proche), manger, se réchauffer, se faire soigner (soignant connu), dormir ;
  - **village :** lire la lettre, réparer le treuil, enquêter, récolter, couper du bois, remplir les seaux ;
  - **sinon :** la veillée ou le potager.

**Le son** (bloc SON, Web Audio, tout synthétisé, aucun fichier).
- **Ambiances :** vent (rafales lentes, plus fort dehors, la nuit et sous la pluie, étouffé dans une maison ou une cachette) et pluie. Une seule boucle chacune, dont seul le volume suit.
- **Pas :** cadence selon la vitesse ; sol de terre, pierre (quai, rampe, portail) ou plancher qui résonne.
- **Radio des scientifiques** pendant la fouille : souffle, voix hachée filtrée, clic de fin. Le volume suit la distance, et le son est plus étouffé à travers un mur.
- **Événements :** porte (entrer, sortir), papier (lettres, épilogue), coups (bagarre à moins de 20 m, agression), cœur qui cogne quand une blouse passe à moins de 9 m de votre cachette.
- **Grondement du train :** une seule voix ; s'il gronde déjà, on le prolonge au lieu d'en superposer un second.
- **Files d'attente, sans chevauchement :** une voix par canal. La radio garde 3 sons en attente au plus, les événements 4 ; au-delà, on ignore. Un pas qui tomberait pendant le précédent est abandonné : un pas en retard sonne faux.
- **Déblocage :** à chaque clic, toucher, touche et bouton de manette, le contexte est relancé (`sonReveil`). Onglet caché : suspendu.
- **Test :** contexte « running » après le premier clic, vent créé ; 10 demandes de radio et 10 coups donnent des files plafonnées à 3 et 4.

**La manette** (PS4 ou toute manette au format standard).

| Commande | Action |
|---|---|
| Stick gauche | marcher |
| Stick droit | regarder |
| L3 ou R2 | courir |
| Croix | agir, valider |
| Rond | fermer, retour, sortir de la cachette |
| Carré | État |
| Triangle | Carnet |
| Options | Menu (ou commencer, passer l'ouverture) |
| Croix directionnelle haut/bas | choisir dans un dialogue, le menu, l'accueil (choix surligné) |

- L'aide à l'écran passe en version manette dès qu'une manette est branchée.
- Le menu reste pilotable même quand le jeu est figé.

**L'épilogue** (`RECIT_MERE`, `lireRecit`). Après la fin, « Écouter la vieille femme » : six pages sur le papier des lettres.
1. Mathilde, la mère d'Ilona, dans la cuisine du vrai Feral.
2. Le fils du jardinier, laissé trois jours au fond du vieux puits par Ilona, douze ans, qui notait dans un cahier combien de temps il criait.
3. La chambre du haut, où on l'a enfermée deux ans ; la mère montait s'asseoir sur la dernière marche sans jamais ouvrir. La lampe brûle depuis pour ne pas l'oublier.
4. Le vote : trois contre trois, et la mère lève la main contre sa fille.
5. Les disparus de chaque année, et le silence de tout Feral.
6. La clé de la chambre du haut : « Vous allez raconter ? Ou vous allez retourner les chercher ? » — FIN DE LA PREMIÈRE BOUCLE.

Le souvenir est gardé.

## 0. Ajouter une maison (méthode rapide)

Dans le script de la scène, cherchez `const MAISONS = [` et ajoutez une ligne :

```js
const MAISONS = [
  { id: 'L001', nom: 'Maison du centre', x: CX, z: CZ },
  { id: 'L002', nom: 'Maison Martin', x: CX + 30, z: CZ, yaw: -PI / 2, etages: 1, style: 'ocre', habitants: 2 },
  { id: 'L003', nom: 'Maison Dufour', x: CX - 30, z: CZ + 20, w: 12, d: 10, etages: 3, style: 'brique', habitants: 5 },
].map(...)
```

| Champ | Valeur | Par défaut |
|---|---|---|
| `id` | identifiant unique (`'L002'`, `'L003'`…) | obligatoire |
| `x`, `z` | centre de la maison en mètres (`CX`, `CZ` = centre de l'enceinte : −3,5 / 6,25) | obligatoire |
| `yaw` | orientation de la façade : `0` sud, `PI / 2` est, `PI` nord, `-PI / 2` ouest | 0 |
| `w`, `d` | largeur de façade et profondeur (8 à 13 m) | 11 / 9,5 |
| `etages` | 1 ou 2 niveaux (3 est ramené à 2, voir « Corrections ») | 2 |
| `style` | `'pierre'`, `'ocre'`, `'blanc'`, `'brique'` | `'pierre'` |
| `habitants` | 2 = couple ; chaque habitant en plus ajoute un lit d'enfant | 4 |
| `nom` | nom affiché (registre) | — |

**État actuel : le quartier de la place (7 maisons).** Une place pavée de 34 × 36 m s'étend au sud du centre (bloc `// ---- place du quartier` de `build`). La maison du centre est au nord. Les maisons Aubry et Berger sont à l'ouest, façade à l'est. Collet et Delorme sont à l'est, façade à l'ouest. Fabre et Ferrand sont au sud, façade au nord. Le quartier mêle 1, 2 et 3 étages et les quatre styles. Pour déplacer la place, on décale ensemble les maisons et les bornes `x0`, `x1`, `z0`, `z1` du pavage.

Ce qui est fait tout seul pour chaque ligne :
- **La coque :** façade, fenêtres et toit, plus la porte d'entrée, avec la tuile choisie dans la palette du village. C'est le modèle `quartier` du moteur, celui des maisons de HDF WALL.
- **L'intérieur meublé :** module `INTERIEURS`, gabarit `TPL.maison` (détail en §4.7).
- **L'entrée, l'escalier et la sortie** (touche **E** ou bouton à l'écran), et les collisions dedans comme dehors.
- **Le rectangle sur la mini-carte.**

Règles de placement : il faut laisser au moins 3 m entre deux maisons, ne pas poser une maison sur la rue (une bande d'environ 11 m le long des murs nord et est), et rester à plus de 3 m des murs. Les façades se tournent de préférence vers un chemin. Un intérieur se construit quand on s'approche à moins de 5 m et se libère au-delà de 18 m : 20 maisons ne coûtent rien tant qu'on n'y entre pas.

**Pour me demander une maison,** une phrase suffit, par exemple : « une maison à 1 étage en ocre à 30 m à l'est du centre, façade vers l'ouest ». J'ajoute la ligne et je livre.

Tout tient dans un seul fichier HTML, sans dépendance externe à part les polices Google, qui ont un repli sur les polices du système. Il suffit de l'ouvrir dans Safari 16+, Chrome, Edge ou Firefox.

---

## 0 bis. Accrocher un tableau (méthode rapide)

**Toutes les maisons** portent *Princesse Ilona* (F.S.M), 1,05 × 1,40 m, au-dessus de la cheminée du séjour (`TABLEAUX = [...MAISONS.map(...)]`, `au: 'cheminee'`). Le mur, la position et la hauteur sont calculés, et la cheminée est recentrée :
- **maisons à 2 niveaux** (centre, Berger, Collet, Fabre, Ferrand) : au milieu exact entre les deux fenêtres du mur ;
- **maisons à 1 niveau** (Aubry, Delorme) : la fenêtre opposée est derrière la cloison de la chambre, donc la cheminée se centre sur la partie séjour du mur, entre la cloison et la fenêtre.

Sécurités : la cheminée ne sort pas de sa pièce et ne recouvre aucun meuble ; à défaut, elle reste à la place du gabarit.

1. **L'image :** dans le script « IMAGES DES TABLEAUX », on ajoute une constante `const IMG_NOM = 'data:image/jpeg;base64,…';`. On peut fabriquer cette chaîne avec n'importe quel convertisseur d'image en base64 ; un JPEG de 768 × 1024, qualité 85, fait environ 350 Ko. Il suffit aussi de m'envoyer l'image.
2. **Le placement :** on ajoute une ligne dans `TABLEAUX`, juste sous `MAISONS` :

```js
{ maison: 'L003', niveau: 1, mur: 'ar', pos: -1, y: 1.7, largeur: .9, titre: 'Le Moulin', src: IMG_MOULIN },
```

| Champ | Valeur |
|---|---|
| `maison`, `niveau` | id de la maison (`'L001'`…), niveau (0 = rez-de-chaussée) |
| `mur` | `'g'` (côté x− du plan), `'d'` (x+), `'ar'` (fond), `'av'` (façade, à l'intérieur) |
| `pos` | décalage le long du mur, en mètres (0 = milieu ; le sens est celui de la droite d'une personne qui regarde le mur) |
| `y` | hauteur du centre au-dessus du plancher du niveau (1,6 à 1,9) |
| `largeur` | largeur de la toile ; la hauteur suit les proportions de l'image |
| `titre` | texte gravé sur la plaque de laiton (facultatif) |

`poserTableau` pose plusieurs éléments :
- la toile, en matériau 30 du moteur (texture créée par `A.R.texture(img)`, maillage `A.R.makeMesh(…, { uv: true, tex })`) ;
- le cadre doré avec ses filets intérieurs, et le fond sombre ;
- la plaque gravée, dont le texte est dessiné sur un canvas.

Elle retire aussi le petit `cadre` du gabarit s'il se trouve au même endroit. Le tableau est visible dès qu'on entre, même avant la construction de l'intérieur.

Pour bien le placer, il faut éviter les fenêtres (sur chaque mur, environ tous les 3,2 m, de 0,95 à 2,25 m de haut) et les meubles hauts (cheminée, armoire, buffet). La façon la plus simple est de me donner la maison et la pièce : je trouve le mur libre.

## 0 ter. Corrections : chercher « HDF BASE : »

Chaque correction faite dans le code porte un commentaire qui commence par `HDF BASE :`. Une recherche de ce texte dans le HTML les donne toutes, sans comparer le fichier entier. Les trois premières sont à reporter dans HDF WALL.

| Où | Correction | À reporter dans HDF WALL |
|---|---|---|
| Moteur, `G.roundBox` | Avec un rayon 0, chaque sommet prend la normale de sa face. Avant : normales nulles et faces noires. Voir aussi `correctif-roundBox.diff`. | oui |
| `INTERIEURS`, `TPL.maison` | La porte de la chambre des parents donne sur le palier. Avant : coupée en deux par la cloison de la salle de bain. | oui |
| `INTERIEURS.build` | Le plafond est percé au-dessus de l'escalier. Avant : il refermait la trémie. | oui |
| Scène, `MAISONS` | 2 niveaux au plus. À 3 niveaux, `TPL.maison` empile l'escalier du grenier sur la trémie, ce qui le rend incohérent et inaccessible. | — |
| Scène, place du quartier | Bord ouest à `CX − 15,5`. Avant : `CX − 19`, et les maisons Aubry et Berger avançaient de 3,5 m sur les pavés. | — |
| Scène, `agir` | L'action (Entrer, Monter…) est recalculée au moment de l'appui. Avant : celle de l'image précédente. | — |
| CSS, `[hidden]` | Le message « WebGL 2 indisponible » restait affiché hors de l'hébergeur. | — |
| Scène, arrivée | Les places sont recalées sur le train à l'arrêt au début de la descente (avant : départ à 230 m si l'on se levait juste après avoir passé la cinématique). | — |
| Scène, voiture 1 | Le vantail est en retrait du montant et sous le linteau (avant : éclat dans l'angle de l'ouverture). | — |
| Scène, voiture 1 | Le châssis passe sous le plancher (avant : sol qui scintillait). Les portes côté quai sont réellement ouvertes (avant : on ne voyait qu'un mur). | — |
| Scène, cinématique | Le plan A survole le couloir de la voie. Avant : le train était caché par la forêt. | — |
| Scène, gare | Le panneau de gare est placé en face d'une baie de la voiture 1, et son texte est ajusté à la largeur (avant : vu de biais, coupé par les montants, texte qui débordait avec la police de secours). | — |
| Scène, `TRAIN` | La porte de la voiture 1 est dans l'axe du portail (avant : 18 m à côté, et le portail était caché par les pins). | — |
| Scène, voiture 1 | Les trumeaux sont habillés de bois à l'intérieur (avant : peinture extérieure visible entre les fenêtres). | — |
| Scène, mur et lot 2 | Brèche nord bouchée, place pavée et rue retirées (`PLACE_Q = null`), portail sud. | — |
| Scène, `vegetation` | Les arbres sont dessinés en série au lieu d'être fusionnés un par un (avant : 890 000 triangles), la canopée fine passe à des mailles de 2,67 m, et les hauteurs sont en cache (avant : chargement de plus de 30 s dans le navigateur de test). | — |
| Scène, marche | La forêt bloque la marche, et on glisse le long de la lisière. | — |
| Scène, `portesInterieures` | Une porte s'ouvre dans la chambre ou la salle de bain, jamais sur le palier ni dans le séjour. Avant : le battant passait devant la cheminée chez Delorme. | — |
| Scène, `poserTableau` | La cheminée est placée au milieu exact entre les deux fenêtres du mur (avant : collée au bord de l'espace libre, à 0,875 m du centre), et le petit cadre du gabarit est retiré sous le tableau. | — |
| Scène, aide à pied | « E agir · B état » (avant : « E entrer, monter ») : E sert aussi à boire, manger et dormir. | — |
| Scène, boucle principale | `pasSimulation(dt)` à la place de `majPassagers(dt)` : pendant le sommeil, la simulation avance par pas de 0,5 s. | — |
| Scène, `choisir` | Le commentaire du lot 11 est refermé (avant : « // » masquait la suite de la ligne, et la conversation ne répondait plus dans les versions des lots 11 et 12). | — |
| Scène, déplacement | La vitesse tient compte de la fatigue et de la santé (`facteurVitesse`, `peutCourir`). | — |
| Scène, `sujets` | « Au revoir » reste toujours proposé (avant : coupé quand quatre sujets étaient ouverts). | — |
| Scène, `majJournee` | Un besoin urgent passe avant l'emploi du temps et peut interrompre une marche. | — |
| Scène, `rations` | 3 jours de repas par habitant (avant : 2 rations par habitant, vidées en un jour). L'évier et le lavabo puisent dans les seaux de la maison. | — |
| Scène, portail | Les vantaux sont mobiles et se referment derrière les arrivants (avant : fusionnés dans le mur, ouverts pour toujours). | — |
| Scène, `heure` | Le ciel suit la météo du jour (`ciel`). Avant : l'ambiance de l'heure seule. | — |
| Scène, brouillard | La brume et la pluie épaississent le brouillard. Avant : l'altitude seule, qui écrasait `A.meteo`. | — |
| Scène, `IMG_LOGO` | Logo centré et agrandi sur le drapeau (avant : décalé à droite et coupé en bas). | — |
| Scène, panneau | La météo remplace le mot « Heure » (sans retour à la ligne sur téléphone). | — |
| Scène, `itineraire` | Trajets calculés sur la carte spatiale `A.spatial` avec `routeRapide` (avant : le réseau des chemins seul, qui coupait à travers les arbres et les rochers). | — |
| Scène, panneau de gauche | La météo s'affiche sous le lieu (avant : à la place de « Heure », ce qui faisait déborder l'heure sur téléphone). Le panneau de droite ne défile plus en largeur. | — |
| Scène, `butPour` (veillée) | On se place près de ses amis (avant : une place fixe selon son numéro). | — |
| Scène, potagers | Les rangs de légumes poussent : ce sont des nœuds mis à l'échelle (avant : rangs fixes, fusionnés dans le décor). Les buttes de terre restent dans le décor. | — |
| Scène, garde-manger | Les vivres sont les conserves plus les récoltes fraîches (`prendreRation`, le frais d'abord). Avant : les conserves seules. | — |
| Scène, `allumerFeu` | Un feu brûle une bûche de la maison. Sans bois, pas de feu. | — |
| Scène, `pasSimulation` | Le travail du joueur accélère aussi le temps, avec des pas de 0,5 s (avant : le sommeil seul). | — |
| Scène, `activite` | La tâche du jour est répartie selon les besoins du village (avant : un métier fixe selon les compétences). | — |
| Scène, portail | Il se rouvre pour le train de nuit (`ouverture`, `ouvert_raid`), puis se referme au départ. | — |
| Scène, `majPassagers` | La simulation du raid (`majRaid`) tourne dans la boucle des voyageurs et suit donc l'accélération du sommeil. | — |
| Scène, `IMG_ILONA` | La toile de la cheminée est remplacée par la reine au trône. | — |
| Scène, raids | 1 puis 2 personnes emmenées (au lieu de 3), une nuit calme au moins entre deux raids, et le village apprend à se cacher. Avant : village vidé en 15 jours. | — |
| Scène, `journal` | 40 entrées gardées (avant : 8, les événements graves disparaissaient sous le travail du jour). | — |
| HUD | HUD de jeu : objectifs et repère à l'écran à la place de la mini-carte, jour et heure, État, Carnet, Menu. Avant : HUD de développement (survol, réglette de l'heure, recentrer, revoir l'ouverture). | — |
| Son | Moteur audio à files d'attente. Avant : un grondement qui pouvait se superposer à lui-même. | — |
| Moteur, `G.roundBox` | Un rayon omis vaut 0. Avant : NaN, et des boîtes invisibles (contreforts, tours d'angle, croix, bandes du train, ferrures). | oui |
| Scène, arrivée | Portail fermé jusqu'au geste de l'homme ; vantaux du wagon mobiles ; ouverture impossible à passer. | — |
| Scène, roue L1 | Les actions du lieu d'abord (cueillir, fouiller, activités, quêtes), puis les objets, Sac et Carnet. Avant : État et Carnet en dur, s'accroupir dans la roue. | — |
| Scène, dialogues | Huit choix au plus. Avant : cinq, les nouveaux sujets n'avaient pas de place. | — |
| Scène, `seDefendre` | Avec un couteau, l'agresseur est vraiment blessé et les témoins s'en souviennent. Avant : simple bousculade. | — |
| HUD, panneau de droite | Quatre boutons sur deux rangs (État, Carnet, Sac, Menu). Avant : trois sur un rang. | — |
| Scène, lot 2 | Le module se lance après tout le script (`queueMicrotask`) : `LIBELLE_ACT` et la suite sont déclarés plus bas. Avant : « Cannot access before initialization » au démarrage. | — |
| Scène, `deplacer`, `hauteurSol`, `pousser` | Dans la réserve, on marche dans la réserve, sur son sol, contre ses obstacles. Avant : zones du domaine seules. | — |
| Scène, quêtes | Ce qu'une étape donne, on le reçoit en la terminant. Avant : parfois en double (au début et à la fin). Les objets de quête ne prennent plus de place dans le sac. | — |
| Scène, `entrer`, `planifier` | Une personne peut aller dormir dans une autre maison (couples, liaisons). Avant : toujours chez elle. | — |
| Scène, `capturerJoueur` | Après « Encore en vie ?! », on n'est plus capturé pendant ce raid (`RAID.epargne`). | — |
| Scène, `inspecterMaison` | Regarder une maison par la caméra ne fait pas trouver le joueur dans cette maison. | — |
| Nom, version | Le jeu s'appelle HDF : ENCLOS 1.0. Le numéro monte à chaque livraison (fichiers, titre, menu, accueil, `HDF_VERSION`). Avant : HDF BASE 1.0 KIT · ENCLOS v1.0. | — |
| Scène, `occuper` | Toute activité passe d'abord par son mini-jeu (1.1). Avant : la barre de temps seule. | — |
| Scène, `occuper` (bloc LOT 5) | Temps réel : l'effet tombe à la fin du mini-jeu, sans accélération ; une occupation sans mini-jeu se déroule à vitesse normale (`TEMPS.k = 1`). Avant : le temps défilait ×60. | — |
| Scène, `vers`, `avancer` | Les habitants courent (×2,3) ou se faufilent accroupis (×0,55). Avant : toujours au pas. | — |
| Scène, `majManette` | L3 bascule la course jusqu'à l'arrêt. Avant : il fallait garder le stick enfoncé. | — |
| Scène, `majInstallation` | Rassemblement au grand mât, discussion, puis répartition des maisons. Avant : chacun chez soi au bout de 4 s (`repartirFoyers`). | — |
| Scène, `entrer` (lit) | Chacun sa place dans un lit, sur le dos, sous une couverture, jamais à deux au même endroit. Avant : Sleep_Lie de travers, 30 cm au-dessus du matelas, places partagées. | — |
| Scène, `sousTitre`, `ecrireDialogue` | Voix du personnage (synthèse ou bruitage), texte écrit au rythme de la parole, affiché en grand. Avant : texte posé d'un coup, petit, muet. | — |
| Scène, `sonReveil` | Écoute aussi `touchend`, `click`, `mouseup` (Safari iOS ne débloque le son qu'à ces gestes). Avant : `pointerdown`, `keydown`, `touchstart`. | — |
| Scène, `majAmbiances` | Le vent retombe (×0,35) une fois au village. Avant : même vent partout. | — |
| Scène, `CINE`, `finCinematique` | Le jeu commence dans le train qui roule (voyage de 60 s). Avant : 19 s de cinématique extérieure, puis réveil train arrêté. | — |
| Scène, `portesTrain` | Vantail de 1,36 × 1,93 m : fermé, il couvre toute l'ouverture. Avant : 1 × 1,82 m, un jour de 33 cm. | — |
| Scène, `scenarioAccueil` | L'homme ne disparaît qu'une fois la porte close. Avant : au bout de 0,5 s, même porte encore ouverte. | — |
| Scène, `majPassagers` (dialogue) | À bord, l'interlocuteur suit le train qui roule. Avant : il restait en arrière et le dialogue se fermait. | — |
| Scène, `majAction` | Pictogramme PS4 Carré sur le bouton d'action et les marqueurs. Avant : touche E. | — |
| Scène, `voyageurEnFace` | En face (±45°), 2,6 m, sans mur ni cloison entre les deux (`vueDegagee`). Avant : 2,8 m, ±57°, à travers les murs. | — |
| Interface | Boussole façon Skyrim en haut de l'écran, avec objectifs et points d'intérêt. Avant : repère d'objectif seul. | — |
| Scène, `profil`, `parole` (bloc LOT 9) | Textes et voix ~15 % plus rapides. Avant : débit ×0,96, 15 et 12,5 caractères par seconde. | — |
| Scène, `profil` (bloc LOT 9) | Voix du bon sexe pour chacun ; décalage non signé `>>>` ; profils recalculés quand les voix de l’appareil arrivent. Avant : `>>` rendait l’index négatif (10 personnages sans voix, hauteurs faussées). | — |
| Scène, `afficherAccueil` | Menu principal (Continuer, Nouvelle partie, Charger, Options, Quitter). Avant : « Commencer » lançait directement. | — |
| Scène, menu de pause | Sauvegarder, Charger, Menu principal, Quitter le jeu. | — |
| Scène, `avancer` | Les habitants gardent 80 cm, ralentissent, contournent (`espaceDevant`). Avant : ils se traversaient et se bloquaient au départ. | — |
| Scène, `lancerDescente` | Départs espacés de 1,3 s. Avant : 0,9 s. | — |
| Scène, `parlerSuivant` (voix) | Détection du démarrage (`onstart`), changement de voix muette, reprise de la synthèse en pause, « Touchez pour reprendre ». Avant : voix muettes après un rechargement ou à la manette. | — |
| Scène, `planifier` | Places réservées (`placeLibre`). Avant : superpositions pendant les activités. | — |
| Scène, `enFile`, `majFiles` | Les sons trop anciens (1,2 s) ne sont plus joués. Avant : rafale de sons en retard. | — |
| Scène, `objectifsQuete` | L'objectif de la trame (★) d'abord, puis la quête suivie. | — |
| Scène, `queteDispo` | Une rumeur entendue rend la quête disponible, même sans s'être présentés. | — |
| Scène, `ouvrirDialogue` | Premier mot selon le moment (`introContexte`), appel du metteur en scène. | — |
| Scène, `actionsVie` | Les traces de ceux d'avant (quinze recoins). | — |
| Scène, `terminerQuete` | Choix de fin des actes III (réserve) et IV (gardes). | — |
| Scène, `butPour` | Veilleurs au portail la nuit, quand les gardes sont organisées. | — |
| Scène, `finEvasion` | L'épilogue raconte vos choix. | — |
| Scène, boucle des activités | Emploi du temps de la maison (`activiteVie`) : repas ensemble, cuisine, vaisselle, ménage ; l'heure du repas interrompt la marche. | — |
| Scène, `actionMeuble` | Vaisselle, repas de la maison, ménage, toilettes (chez soi). | — |
| Scène, `sujetsQuetes` | Les étapes en cours passent avant les nouvelles demandes, trois sujets au plus. Avant : deux sujets, la trame pouvait être coupée. | — |
| Scène, `planifierRaid` | Le train arrive à l'heure ronde, jamais les nuits de pluie. Avant : n'importe quelle minute, par tous les temps. | — |
| Scène, `majFileParoles` | Qui dit son prénom est nommé dans le sous-titre. | — |
| Scène, `BESOINS` | Nouveau besoin : confort (toilettes). | — |
| Scène, `majScientifique` | Jauge de soupçon (`infiltration`) : la lampe porte, une maison cache, la blouse s'arrête et fouille du regard avant de courir. Avant : repéré à l'instant où l'on entrait dans le faisceau. | — |
| Scène, lampes des blouses | Une seconde lumière, plus loin devant : on voit au sol où porte la lampe. | — |
| Scène, `attaqueJoueur`, jalousie | L'agression se joue au corps à corps (esquiver, riposter). Avant : 30 points de santé perdus d'un coup, puis un bouton « Se défendre ». | — |
| Scène, `volDeNuit` | Si vous veillez dehors, le vol se joue sous vos yeux : poursuite. | — |
| Scène, `actionPuits` | L'eau se porte, deux seaux à la fois, jusqu'à sa porte (jauge de bras, eau renversée). Avant : douze seaux remplis d'un geste. | — |
| Scène, `facteurVitesse`, `peutCourir` | Deux seaux pleins ralentissent (62 %) et empêchent de courir. | — |
| Scène, `sonEvt` | Le cri a un son. Avant : `sonEvt('cri')` ne jouait rien. | — |
| Scène, `majQuetesLieux`, `fouiller`, `examinerTrace` | Une phrase-clé lue, le texte entier au choix. Avant : 300 caractères en sous-titre pendant 6 s, ou une notification effacée au bout de 3,8 s. | — |
| Scène, `lireLettre`, chronique | L'essentiel d'abord, la lettre entière sur demande. | — |
| Scène, `memoTrame` | Les révélations de la trame se jouent en scènes. | — |
| Scène, `majMetteurEnScene` | Pas d'appel d'un habitant pendant une action ou une scène. | — |
| Scène, blouse à la cabane | Elle balaie la cabane de sa lampe. Avant : un geste d'auscultation au stéthoscope. | — |
| Scène, mini-jeu « Se recueillir » | Accroupi. Avant : un massage cardiaque. | — |
| Scène, activités des habitants | Suites de gestes par activité (`GESTES`) : pêche dans l'ordre, vaisselle frottée et rincée… Avant : un seul geste figé, parfois approximatif. | — |

**Règle pour la suite :** toute nouvelle correction reçoit un commentaire `/* HDF BASE : … (avant : …) */` à l'endroit modifié, et une ligne dans ce tableau.

## 0 octovicies. Lot 25 : finition de la v1 (HDF : ENCLOS)

- **L'écran d'accueil** (`#accueil`, `afficherAccueil`, `quitterAccueil`) affiche :
  - le titre et la version ;
  - l'avertissement « réservé aux adultes » ;
  - l'accroche ;
  - « Commencer », ou « Continuer · boucle N » (avec le nombre d'évasions), et « Effacer les souvenirs et recommencer » ;
  - les commandes.

  L'ouverture attend derrière, figée (`CINE.attente`). Entrée ou Espace pour commencer.
- **L'aide** affiche « J carnet ». La version est « Enclos v1.0 · Kit », et `HDF_VERSION` vaut « BASE 1.0 KIT · ENCLOS v1.0 ».
- **Le budget** a été vérifié dans les vues du village (voir l'encadré v1 en tête de cette note).

## 0 septvicies. Lot 24 : l'évasion, la véritable fin (HDF : ENCLOS)

**Où le trouver :**
- **Donnée en tête :** `EVASION`.
- **Bloc « LOT 24 — L'ÉVASION » :** `carteRuban`, `poserCarte`, `ramasserCarte`, `actionEvasion`, `monterDansLeTrain`, `finEvasion`.
- **Raid :** détour du premier scientifique dans `prochaineEtape` et `majScientifique` (états `vers_puits`, `boit`).

**Ce qu'il faut pour s'évader.**
1. **Savoir.**
   - Lettre 12 : pendant la fouille, la porte du milieu du train reste ouverte, face au portail.
   - Lettre 13, en boucle 3 : la carte à ruban qui ouvre la cabine de tête, perdue près du puits ; le train qui va au vrai Feral.
   - On peut aussi le découvrir seul, en observant.
2. **Préparer.** À chaque raid, le premier scientifique fait un crochet par le puits, boit (geste Drink) et laisse tomber sa carte : petite carte blanche, ruban rouge. Elle reste au sol jusqu'au départ du train.
   - **« Ramasser la carte à ruban »** la met dans l'inventaire de la boucle (visible dans « État »). La boucle suivante, elle est perdue.
3. **Saisir l'occasion.** Pendant la fouille, devant la porte du milieu, « Monter dans le train » :

| Situation | Résultat |
|---|---|
| Une blouse à moins de 20 m de la porte | vu : capture |
| Pas de carte | « La porte de la cabine de tête est verrouillée. Une fente, pour une carte. », puis des pas : capture |
| Avec la carte | la cabine s'ouvre, le train repart avec vous : **fin** |

**La fin.** La séquence se joue sur un fond d'aube et défile seule sur petit écran :
1. le départ et les lampes qui s'agitent sur le quai ;
2. la nuit de voyage, puis la vallée au matin ;
3. le vrai Hameau de Feral : les mêmes maisons, un drapeau blanc qui pend sans vent, la lampe à la fenêtre du haut ;
4. la mère d'Ilona, qui regarde la carte et la pyramide noire : « Elle vous a laissé partir, cette fois. » — « Entrez. Il faut que quelqu'un sache ce que nous lui avons fait. » ;
5. **FIN**, puis « Vous vous êtes échappé de l'enclos au bout de N boucles ».

Le bouton « Recommencer depuis le train » relance une boucle. La mémoire est gardée, et le nombre d'évasions est compté (`MEMOIRE.echappe`).

**Test :**
- la carte tombe au puits 146 s après le début du raid, et on la ramasse ;
- on attend que les blouses soient à plus de 25 m, on monte : fin, sans capture.

## 0 sexvicies. Lot 23 : les lettres d'Ilona, la trame (HDF : ENCLOS)

**Où le trouver :**
- **Donnée en tête :** `BOITE`.
- **Bloc « LOT 23 — LES LETTRES D'ILONA » :** `LETTRES`, `boiteAuxLettres`, `prochaineLettre`, `majBoite`, `lireLettre`, `ouvrirBoite`, `lettresCarnet`.
- **Écran :** `#lettre`. Police : Cormorant Garamond (Google Fonts).

- **La boîte aux lettres** est noire, avec un liseré doré, sur un poteau au pied du grand mât. Un petit drapeau rouge se lève quand une lettre attend.
  - **Distribution :** chaque matin à 7 h, à partir du lendemain de l'arrivée, si la lettre suivante peut être lue. Une notification l'annonce.
  - **Lecture :** l'action « Prendre la lettre » l'ouvre sur un papier ligné, à l'écriture manuscrite, signée « — I. ».
- **La trame : 13 lettres, dans l'ordre.** Certaines attendent un événement :

| # | Titre | Condition | Ce qu'on apprend |
|---|---|---|---|
| 1 | Le sanctuaire | — | « J'y ai mis toute mon âme. Rien ici n'est laissé au hasard. Pas même toi. » |
| 2 | Ma mère | — | Sa mère habite au Hameau de Feral, ne lui a jamais répondu, laisse une lampe allumée à la fenêtre de la grande maison |
| 3 | Le mur | — | « Ceux qui ont essayé… On a retrouvé leurs chaussures. » |
| 4 | Les visiteurs de la nuit | un premier raid (ou le jour 6) | Les blouses obéissent ; ils prennent ceux dont le récit n'a plus besoin |
| 5 | Pourquoi vous | jour 4 | L'annonce, le contrat, le billet et les lettres de la sœur d'Odile : c'était elle |
| 6 | Le vrai Feral | jour 5 | Ceci est une copie, pierre par pierre ; on ne peut pas brûler le vrai, pas encore |
| 7 | Le trône | jour 6 | Le conseil des sept familles, trois voix sur sept ; le portrait de la cheminée est son seul couronnement |
| 8 | L'homme du portail | jour 7 | L'ancien secrétaire du conseil, qui a compté les voix ; Paul et Simone avaient raison |
| 9 | Les loups | une première violence (bagarre, vol, meurtre) | Ce qu'elle mesure : combien de jours avant que des gens honnêtes volent, frappent, tuent |
| 10 | Tu te souviens | boucle 2 | Elle recommence parce que la fin ne lui plaît jamais ; « Surprends-moi. » |
| 11 | Les sept maisons | après la 10 | Aubry, Berger, Collet, Delorme, Fabre et Ferrand ont voté contre elle ; la grande maison est celle de sa mère, et le joueur dort dans son lit ; c'est la mère qui a voté la dernière |
| 12 | Le carnet des blouses | après la 11 | Ce qu'on fait de ceux qu'on emmène ; la porte du milieu reste ouverte pendant la fouille |
| 13 | La porte du milieu | boucle 3, après la 12 | La carte à ruban perdue près du puits, la cabine de tête, le train qui va au vrai Feral (lot 24 : l'évasion) |

- **La progression survit aux boucles.** Les lettres lues restent dans la mémoire du joueur (`MEMOIRE.lettres`), et l'histoire reprend où on l'a laissée. Elles se relisent dans le carnet (« Lettres d'Ilona », avec un bouton par lettre).
- **Les habitants en parlent :**
  - « La boîte aux lettres, au pied du mât ? Vide. Toujours vide quand je regarde. Pourtant, quelqu'un l'ouvre, le matin. » ;
  - le portrait de la cheminée : « Je l'ai retourné contre le mur, une nuit. Le matin, il était remis. ».
- **Test :** lettre 1 au jour 2 à 7 h, puis lettre 2 au jour 3 et lettre 3 au jour 4. Sans raid, la lettre 4 attend le jour 6.

## 0 quinvicies. Lot 22 : la violence et ses conséquences (HDF : ENCLOS, jeu réservé aux adultes)

**Où le trouver :**
- **Données en tête :** `VIOL` et `TOMBES_A`.
- **Bloc « LOT 22 — LA VIOLENCE ET SES CONSÉQUENCES » :** `blesser`, `temoins`, `bagarre`, `escalade`, `volDeNuit`, `meurtreDeNuit`, `decouvrirCorps`, `enterrer`, `poserTombe`, `attaqueJoueur`, `seDefendre`, `majViolence`, `sujetsEnquete`, `repondreNuit`, `accuser`.

**Principe : rien n'arrive au hasard.** Tout découle des besoins (faim, moral), du caractère (fiche du voyageur) et des relations de History.

| Penchant | Traits |
|---|---|
| Sang chaud | impulsif, rancunier, susceptible, autoritaire, bourru, jaloux, impatient, têtu, entêté |
| Tentation de voler | gourmand, calculateur, secret, vantard, imprudent, jaloux |
| Frein (compte moitié contre le sang chaud, en entier contre le vol) | honnête, droit, bienveillant, généreux, doux, loyal, protecteur, patient |

- **La bagarre.** Une dispute qui ne s'apaise pas dégénère si l'agresseur a le sang chaud et qu'il déteste l'autre (relation sous −0,3) ou qu'il est à bout (faim sous 25, moral sous 30). La probabilité est de 35 %, plus 15 % par trait de sang chaud.
  - **Les gestes :** coups de poing, la victime encaisse.
  - **La victime :** −25 à −55 de santé, −15 de moral ; blessée, elle se repose chez elle jusqu'à 70 de santé (+3 par heure). Elle s'en souvient (« il m'a frappé »).
  - **Les témoins** à 12 m s'en souviennent aussi.
  - **Le joueur** l'entend à 14 m (« Arrête ! Lâche-moi ! »), et le journal la note.
- **Le vol (vers 1 h 30).** Un habitant affamé (satiété sous 30), dont la maison n'a plus de quoi faire un repas par personne et qui penche vers le vol, prend 4 rations dans la maison la mieux pourvue.
  - **Pris** (un habitant réveillé, 20 %) : bagarre, et tout le village le juge.
  - **Sinon :** au matin, la maison volée soupçonne celui qu'elle aime le moins, qui n'est pas forcément le voleur.
- **Le meurtre (même heure).** Il faut une haine profonde (relation ≤ −0,55), le sang chaud, et soit le désespoir (faim sous 20 ou moral sous 15), soit la rancune (au moins 2 mauvais souvenirs) ; une chance sur quatre par nuit.
  - **Découverte :** à 7 h (« Un cri, au matin. On a retrouvé Gérard mort. ») ; −20 de moral pour tous, et l'humeur s'effondre.
  - **Les soupçons** du village vont au pire ennemi de la victime. Il est souvent coupable, pas toujours.
  - **Enterrement** à midi : tombe et croix près du mur est. Le souvenir reste d'une boucle à l'autre.
- **L'enquête du joueur** (2 jours après le meurtre) :
  - **« Où étiez-vous, la nuit dernière ? »** Le meurtrier ment (« Chez moi. Je dormais. »). Ses colocataires l'ont souvent entendu sortir (80 %), et les autres répètent la rumeur.
  - **« C'est vous qui avez tué … »** Si l'on vise juste, c'est l'aveu (« Vous ne savez pas ce que c'est, d'avoir faim à ce point. »), ou la violence (−35 de santé) chez les plus sanguins. Le coupable est enfermé dans une cabane, et le village vous en sait gré.
  - **Une fausse accusation** coûte −30 de relation avec l'accusé et −4 avec chacun des autres.
- **Le joueur agressé.** La nuit, dehors, un habitant qui vous hait (relation ≤ −30), sanguin et à bout, peut se jeter sur vous : −30 de santé, −30 de calme. « Se défendre » le repousse et il s'enfuit.
- **Raids rééquilibrés** (avec ce lot) :
  - une seule personne emmenée au premier raid, deux ensuite (au lieu de 3) ;
  - au moins une nuit calme entre deux raids (40 % de chances ensuite) ;
  - le village apprend : +15 % de chances de se cacher après chaque raid, et l'on dort d'un œil.

  Avant ce réglage, le village était vide en 15 jours.
- **Test sur 24 jours :**
  - 3 raids, 5 habitants emmenés ;
  - deux bagarres entre Gérard et Odile (jours 6 et 7), puis Gérard retrouvé mort au jour 8, et les soupçons se portent sur Odile ;
  - un vol chez Berger au jour 23 (Inès soupçonnée) ;
  - le moral moyen tombe à 6.

## 0 quatervicies. Lot 21 : la capture et la boucle (HDF : ENCLOS)

**Où le trouver :**
- **Donnée en tête :** `MEMOIRE`, chargée depuis `localStorage` (clé `hdf-enclos-memoire`).
- **Bloc « LOT 21 — LA CAPTURE ET LA BOUCLE » :** `sauverMemoire`, `souvenir`, `memoriserPersonne`, `VOIX`, `nouvelleBoucle`, `reconnaitre`, `souvenirsCarnet`.
- **Écran :** `#capture`.

- **La capture.** La séquence se joue au noir, une phrase toutes les 2,3 s, pendant environ 20 s :
  1. comment on a été pris (« Une lampe vous trouve. « Là ! Un sujet ! » ») ;
  2. le quai, les portes métalliques, la lumière froide ;
  3. trois répliques des scientifiques (voir ci-dessous) ;
  4. une piqûre, le froid ;
  5. « Vous perdez connaissance. ».
- **Les voix changent d'une boucle à l'autre :**

| Boucle | Ce que disent les scientifiques |
|---|---|
| 1 | « Sujet vingt. On l'a. », « Il n'était pas sur la liste. » |
| 2 | « Encore lui. », « Il apprend. », « Le protocole ne prévoit pas qu'ils se souviennent. » |
| 3 | « Troisième cycle. Il commence à comprendre. », « Pourquoi lui ? » |
| 4 et suivantes | « Accélérez la remise à zéro. », « Il nous regarde vraiment. » |

- **La boucle.** On se réveille dans le train, avant l'arrivée, et le carton titre annonce « Boucle 2 · vous vous souvenez de tout ». Tout le monde est remis à zéro (`lancerCinematique` → `resetArrivee`) : village, stocks, potagers, relations, mémoire des habitants, état physique, train de nuit, disparus.
- **Ce qui reste** (document de conception, § 8), dans `MEMOIRE`, sauvegardé même si l'on recharge la page :
  - le numéro de boucle et le nombre de captures ;
  - les souvenirs : le train et les scientifiques, la boucle elle-même, la nuit et l'heure du raid de chaque boucle (« l'heure change d'une fois sur l'autre »), qui a été emmené ;
  - les gens rencontrés : nom, métier, et ce qu'ils vous ont confié (raison, compétences).
- **Dans la nouvelle boucle :**
  - le carnet s'ouvre sur « Souvenirs », avec la liste des gens dont vous vous souvenez (« Eux ne se souviennent pas de vous. ») et un bouton « Effacer tous les souvenirs » ;
  - devant quelqu'un que vous avez connu, un nouveau sujet apparaît : « Vous êtes Odile, n'est-ce pas ? ». Il ou elle est troublé(e) (« Comment… comment connaissez-vous mon nom ? On ne s'est jamais vus. Si ? »), et son moral baisse un peu.
- **Test :**
  - resté chez soi sans se cacher, on est pris au bout de 222 s de fouille ;
  - après la séquence : boucle 2, 3 souvenirs, 3 personnes retenues, réveil au jour 1 dans le train ;
  - après un rechargement de la page : toujours la boucle 2.

## 0 tervicies. Lot 20 : le train scientifique (HDF : ENCLOS)

**Où le trouver :**
- **Données en tête :** `MEMOIRE` (numéro de la boucle), `RAID`, `CACHE`.
- **Bloc « LOT 20 — LE TRAIN SCIENTIFIQUE » :** `trainScience`, `scientifiques`, `planifierRaid`, `grondement`, `annoncerRaid`, `lancerFouille`, `prochaineEtape`, `inspecterMaison`, `majScientifique`, `majRaid`, `actionCachette`, `seCacher`, `sortirCachette`, `capturerJoueur`.
- **Écran :** `#cachette`.

**Quand le train vient.**
- **Le soir à 20 h,** on décide de la nuit qui vient. Pas de train la première nuit ; ensuite une chance sur deux, jamais deux nuits de suite, et au plus tard la nuit du jour 3 au jour 4.
- **L'heure** est tirée entre 0 h 30 et 3 h 30.
- **Ce tirage dépend du numéro de boucle :** les horaires changent à chaque boucle, comme le veut le document de conception.

**Les signes.** 12 minutes de jeu avant l'arrivée (environ 24 s) :
- **Le grondement :** un son synthétisé (bruit brun filtré, montée lente). Il se débloque au premier toucher, à cause des règles audio des navigateurs.
- **Le phare** traverse la forêt, puis le train sombre (trois voitures métalliques, bandes de lumière froide) ralentit jusqu'au quai. Sa porte s'arrête face au portail.
- **Si l'on dort,** on a 70 % de chances d'être réveillé (« Un grondement vous réveille. Des lumières, dehors. »).
- **Les habitants** se cachent ou non, selon leur caractère :
  - 72 % de chances pour les calmes, méfiants, prudents ou secrets ;
  - 35 % pour les anxieux, naïfs ou bavards ;
  - 55 % pour les autres ;
  - ces chances sont presque divisées par deux s'ils dormaient.

**La fouille.**
- **L'entrée :** le portail se rouvre (8 s). Quatre scientifiques en blouse blanche et calot, avec des lampes froides, descendent et se partagent les maisons.
- **Chaque maison** demande 18 s, plus 4 s par pièce, avec une ronde toutes les 4 s. Tout habitant présent qui ne s'est pas caché est emmené : il sort, suit le scientifique et disparaît dans le train. C'est 3 personnes au plus par nuit.
- **Ensuite,** chaque scientifique inspecte la cabane de la maison, puis retourne au train.
- **Le départ :** au plus tard 4 h après l'arrivée. Le portail se referme et le train repart vers l'ouest.
- **Au matin,** le journal note qui manque. L'humeur des habitants baisse (−0,5 dans History, −12 de moral), et ils en parlent : « Odile n'est plus là, ce matin. Son lit était vide. », « Ces gens en blouse… Qui sont-ils ? ».
- **Test :** fouille de 5 min, 3 habitants emmenés (Hugo, Inès, Sophie), joueur caché dans les buissons et non trouvé.

**Le joueur.**
- **Se cacher :** la nuit, ou pendant un raid, l'action « Se cacher » apparaît près d'une armoire, devant une cabane ou dans les buissons denses. L'écran s'assombrit et il faut « Sortir de la cachette » pour en ressortir. Bouger fait du bruit pendant 3 s.

| Cachette | Risque |
|---|---|
| Armoire | inspectée une fois sur deux par maison fouillée ; découverte à 40 %, à 75 % si l'on vient de bouger |
| Cabane | découverte une fois sur deux à l'inspection |
| Buissons | un scientifique à moins de 3,5 m : 8 % par seconde, 30 % si l'on bouge |
| Pas caché dans une maison fouillée | trouvé |

- **Dehors,** une lampe repère le joueur à 12 m s'il est devant le scientifique. Celui-ci court (3,5 m/s) et crie « Là-bas ! Arrêtez-vous ! ». Rattrapé à 1,3 m, c'est la capture. On le sème à plus de 22 m pendant 5 s, ou en se cachant.
- **La capture** appelle `nouvelleBoucle` (lot 21).

## Tableaux F.S.M (demande du binôme)

- **Au-dessus des cheminées,** la toile est remplacée dans les 7 maisons par la reine au trône (`IMG_ILONA`, dans `images/princesse-ilona.jpg`).
- **Cinq toiles signées F.S.M** (`IMG_FSM`, dans `images/tableau-1.jpg` à `tableau-5.jpg`) sont dispersées dans les maisons par `galerieTableaux()` : 13 cadres dorés, avec une plaque titrée, deux par maison au plus et sur deux murs différents.

| Toile | Format |
|---|---|
| La pyramide d'or | portrait |
| Le yacht | paysage |
| Le linge au soleil | portrait |
| Le golf | portrait |
| Le balcon du roi | portrait |

- **Le choix des murs** (`pansLibres`) écarte :
  - les fenêtres (±0,65 m), la porte d'entrée et les jonctions de cloison ;
  - les meubles hauts : armoire, frigo, cuisinière, évier, télé, cheminée, lavabo, baignoire ;
  - les escaliers et le tableau de la cheminée ;
  - les angles (0,5 m).
- **Les tableaux** sont accrochés à 1,62 m de hauteur, au rez-de-chaussée d'abord, avec le cadre de `poserTableau`.

## 0 duovicies. Lot 19 : s'organiser (HDF : ENCLOS)

**Où le trouver :** la donnée `ORGA` (en tête), le bloc « LOT 19 — S'ORGANISER » (`journal`, `tacheDuJour`, `besoinsMaison`, `organiserJournee`, `relationMaisons`, `partageDuSoir`, `majOrganisation`), `activite` (qui appelle `tacheDuJour`) et `butPour` (nouvelle activité `reparer`).

- **La répartition du travail (chaque matin à 6 h 30).** Chaque habitant valide reçoit sa tâche du jour. Elle dépend des besoins de sa maison et de ses compétences :

| Tâche | Score |
|---|---|
| Potager | besoin : à récolter 3, sol sec 2, peu soigné 1,5, sinon 0,6 ; +1,5 pour les jardiniers (cultures, semences, plantes, cueillette, remèdes, élevage) |
| Bois | besoin : moins de 4 bûches 3, moins de 10 : 1,5, sinon 0,3 ; +1,2 pour la force (force, feu, sécurité, boucherie, escalade) |
| Atelier | 0,9 pour les artisans (menuiserie, construction, réparation, moteurs, électricité, soudure, mécanique, outils) |
| Réparer le puits | 3,5 pour un artisan si le treuil est usé (sous 50) ; 2 réparateurs au plus |
| Rester chez soi | 0,35 |

- **Le travail se répartit :** un besoin déjà pourvu compte moitié pour le suivant.
- **Les refus :** avec un moral au plus bas (moitié des cas), ou par caractère nonchalant ou insouciant (un quart des cas), on reste chez soi. On le dit : « Je ne travaille pas aujourd'hui. À quoi bon, de toute façon ? ».
- **Le partage du soir (18 h).**
  - **Vivres :** une maison qui a moins d'un jour de vivres reçoit jusqu'à 8 rations de la maison la mieux pourvue, si celle-ci en a plus de 3 jours.
  - **Bois :** une maison qui a moins de 4 bûches en reçoit 5 d'une maison qui en a plus de 14.
  - **Condition :** les deux maisons ne doivent pas être en froid (relation moyenne de History ≥ −0,05). Sinon, c'est un refus, et le journal le note.
  - Si votre maison est concernée, une notification l'annonce.
- **Le treuil du puits** (`ORGA.puits`, de 100 à 0) :
  - **usure :** −3 par jour, −0,5 chaque fois qu'un habitant remplit ses seaux, −0,1 quand vous buvez ;
  - **entretien :** l'atelier l'entretient un peu (+0,2 par heure) ;
  - **sous 35,** il grince (notification au puits) ;
  - **à 0, il casse :** plus d'eau pour personne, les habitants le disent, et le journal le note ;
  - **réparation :** les réparateurs ajoutent +12 par heure. Vous pouvez le réparer (« Réparer le treuil (1 h) », +30) : tout le village vous en sait gré (+2 de relation chacun).
- **Le journal du village** apparaît en tête du carnet : travail du jour, partages, refus, panne, avec l'état du puits.
- **Test sur 20 jours :**
  - satiété moyenne entre 73 et 94 ;
  - les récoltes s'enchaînent (830 rations), avec des creux : trois maisons à 0 au jour 12, sauvées par les partages ;
  - le treuil reste entre 43 et 52 grâce aux réparations ;
  - le moral descend de 82 à 25 au jour 20 : l'enclos pèse, et les refus apparaissent.

## 0 unvicies. Lot 18 : travailler (HDF : ENCLOS)

**Où le trouver :** le bloc « LOT 18 — TRAVAILLER » (`actionTravail`, `occuper`, `finirOccupation`, `coupDeMain`) et la ligne des stocks `#bsStock` dans le panneau « État ».

| Où | Action (touche E) | Durée | Effet |
|---|---|---|---|
| Potager (n'importe quelle maison) | Récolter (si mûr) | 30 min | la récolte va à la maison du potager |
| | Arroser (1 seau), si le sol est sec | 15 min | +0,6 d'humidité ; le seau vient de votre maison |
| | Travailler au potager | 1 h | +0,8 de soin, +0,25 d'humidité, −8 d'hygiène |
| Devant la cabane de rangement | Couper du bois | 1 h | +3 bûches pour cette maison, +15 de chaleur |

- **Le temps du travail** passe 60 fois plus vite, comme le sommeil, avec le même écran noir (« Vous travaillez au potager · 9 h 20 »). Le monde continue de vivre, et la fatigue suit l'effort.
- **« Arrêter »** (bouton ou touche E) interrompt le travail, avec un effet au prorata du temps passé.
- **Chez les autres, c'est un coup de main.** Le nom de la maison s'affiche dans l'action, par exemple « Couper du bois (Delorme) ». Chaque habitant de la maison gagne +5 de relation avec vous et garde le souvenir dans History (« vous nous avez coupé du bois »). Il vous saluera ensuite d'un « Merci encore : vous nous avez coupé du bois. ».
- **Le panneau « État »** affiche les stocks de votre maison :
  - vivres, dont le frais ;
  - eau (sur 12 seaux) et bois ;
  - avancement du potager, avec « à récolter » et « sol sec » ;
  - feu allumé.
- **Test :**
  - 1 h au potager : soin de 0,21 à 1, énergie 54, hygiène 63 ;
  - 1 h de bois chez Delorme : bûches de 6 à 9, relations des deux habitants de 0 à 5.

## 0 vicies. Lot 17 : produire (HDF : ENCLOS)

**Où le trouver :**
- **Données en tête :** `CULTURE`, `BOIS`, `FRAIS`, `AUTARCIE`.
- **Bloc « LOT 17 — PRODUIRE » :** `culture`, `bois`, `culturesPotagers`, `majVisuelCultures`, `majCultures`, `rendement`, `recolter`.
- **Garde-manger :** `conserves`, `fraisDe`, `rations`, `prendreRation`.

**Le potager de chaque maison pousse.** Les légumes sont des nœuds qui grandissent en hauteur, de 12 % à 100 %. Les fruits rouges et jaunes apparaissent à 80 %.
- **Par heure de jeu :**
  - le sol sèche (−1/30) et la pluie l'arrose (+0,5) ;
  - chaque jardinier au travail entretient (+0,6 de soin) et arrose (+0,35).
- **Vitesse de pousse :** 1/54 par heure × (0,25 + 0,75 × soin) × (sol humide : 0,5 + 0,5 × eau ; sol sec : 0,1). Il faut 2,5 jours avec de bons soins, jusqu'à 9 jours si l'on néglige le potager.
- **À l'arrivée,** les potagers sont déjà à 30–65 %. La première récolte tombe vers le jour 3 ou 4, juste quand les conserves s'épuisent.
- **Récolte :** le premier jardinier présent récolte (geste Harvest_Pull) 6 + 16 × qualité rations fraîches, puis ressème. La qualité est la moyenne du soin et de l'eau pendant la pousse.
  - À moins de 12 m, on l'entend : « Belle récolte ! » ou « La récolte est maigre… ».
  - Un potager mûr et laissé 2 jours perd la moitié de sa récolte.
- **Conservation :** les rations fraîches se gardent 4 jours ; ensuite, elles sont perdues (compteur `AUTARCIE.pertes`). Les repas prennent d'abord le frais, le plus ancien en premier, puis les conserves.

**Le bois.**
- **Stock de départ :** chaque maison a 8 bûches.
- **Production :** un bûcheron au travail en coupe 1,2 par heure (40 au plus).
- **Consommation :** une flambée de 4 h en brûle une. Sans bois, pas de feu : la maison reste froide, et les habitants le disent (« On n'a plus de bois. La maison est glacée. »).
- **Le bouton de la cheminée** affiche le stock : « Allumer le feu (6 bûches) ».

**Test sur 7 jours :**
- 361 rations récoltées (avant de réduire le rendement), aucune perte ;
- satiété moyenne de 54 à 73 ;
- les vivres remontent après chaque récolte ;
- 4 maisons sur 7 n'ont plus de bois au jour 5 : elles n'ont pas de bûcheron. Le lot 19 répartira le travail selon les besoins.

## 0 novodecies. Lot 16 : la vie sociale visible (HDF : ENCLOS)

**Où le trouver :** le bloc « LOT 16 — LA VIE SOCIALE VISIBLE » (`majSaluts`, `besoinDeVivres`, `donnerRation`, `ajouterRagots`, `angleVeillee`, `majCarnet`, `basculerCarnet`) et le panneau `#carnet`.

- **Les saluts.** Un voyageur que vous connaissez vous salue quand vous passez à moins de 3,5 m, au plus une fois par heure de jeu. Il se tourne vers vous, et fait un signe de la main s'il vous apprécie. Ce qu'il dit dépend de sa relation avec vous :

| Relation | Salut |
|---|---|
| Souvenir d'une ration donnée | « Merci encore pour la ration que vous m'avez donnée. » |
| 20 et plus | « Bonsoir ! Ça va, vous ? » |
| 5 et plus | « Bonjour. » |
| Sous −5 | « … » |

  Chez les froids : « Ah. C'est vous. », « Salut. ».
- **Donner une ration.** Le sujet « Je peux vous donner une ration. » apparaît quand la personne a faim (satiété sous 45) ou que sa maison a moins d'un jour de vivres, et que votre garde-manger n'est pas vide. On peut le proposer une fois toutes les 12 h.
  - **Pour elle :** une ration de votre maison, mangée tout de suite (+50 satiété, +6 moral).
  - **Pour la relation :** +12 avec vous, et History garde le souvenir « la ration que vous m'avez donnée ».
- **Les ragots.**
  - **Ragot :** pendant une discussion, A peut dire du mal d'un tiers qu'il a en grippe (« Tu sais ce que Bastien a fait ? M'a crié dessus. »). B s'en méfiera : −0,06 de relation avec ce tiers.
  - **Éloge :** A peut aussi dire du bien d'un ami (« Gérard, c'est quelqu'un de bien. »), et B s'en rapproche (+0,04).
- **La veillée par affinités.** Chacun se place près de son meilleur ami présent (relation au-dessus de 0,25), ou à l'opposé de celui qu'il évite. Test au jour 4 : 2,3 m en moyenne entre amis, 6,6 m entre les autres. Certains applaudissent (Clap).
- **Les gestes.** Pendant les rencontres :
  - **dispute :** Taunt et Point ;
  - **entraide :** Give_Item et Wave ;
  - **discussion :** Talk.

  Chacun reprend son activité après 7 s, ou après 2,2 s pour un salut.
- **Le carnet** (bouton « Carnet » ou touche **J**, Échap pour fermer) liste les gens que vous connaissez :
  - nom, métier, âge, maison, ce qu'il fait ;
  - son attitude envers vous : chaleureux (vert), cordial, distant, hostile (rouge) ;
  - ce que vous avez appris : ses compétences, pourquoi il est venu ;
  - son état : malade, affamé, épuisé ;
  - si vous lui avez demandé « Et les autres ? », ses proches et ceux avec qui il est en froid.

## 0 octodecies. Lot 15 : History Sens et la carte spatiale (HDF : ENCLOS)

**Ce qui est intégré :**
- **History Sens 2.4 Extended** (l'addon de FSM3D 2.10) est copié tel quel dans un `<script>` à part, juste avant le script de la scène. Il expose `window.HistorySens`.
- **La carte spatiale `A.spatial`** était déjà dans le moteur du kit (FSM3D 2.10.0).
- **Spatial Autonomy 1.0** n'est pas encore branché : il est gardé pour la phase « exploration et cachettes ».

**Où le trouver :**
- **Données en tête :** `HIST` (instance, état, statistiques) et `RAPIDE` (tableaux du routage).
- **Bloc « LOT 15 — HISTORY SENS ET CARTE SPATIALE » :** `LIGNES_ENCLOS`, `initHistory`, `assurerHistory`, `carteSpatiale`, `preparerRoutage`, `routeRapide`, `majRencontres`, `rencontre`, `majFileParoles`, `avisSurLesAutres`.

**Qui fait quoi :**

| Système | Rôle |
|---|---|
| History Sens | décide qui se présente, de quoi on parle, si l'on s'entend ou si l'on se dispute ; garde la mémoire (connaissances, relations de −1 à 1, souvenirs bons ou mauvais, humeur) |
| `A.spatial` | carte du domaine : obstacles, chemins préférés, repères |
| Jeu (lots 7 à 14) | applique les décisions : marche, animations, sous-titres ; garde la survie, déjà réglée |

**Les agents.**
- **Les 19 voyageurs :** un agent chacun, avec son prénom (`baptize`) et son métier. Le courage est tiré des traits : audacieux 0,85, anxieux 0,2…
- **Une faction par personne :** des inconnus partent d'une relation de 0, pas d'une amitié de groupe.
- **Le joueur** est aussi un agent (« joueur »). Quand un voyageur se présente à lui, History le note.
- **Préréglages chargés :** `vie` (sujets, humeur) et `societe` (relations, présentations, souvenirs). Les modules police, armes et hors-la-loi ne sont pas chargés.
- **Horloge de History :** en minutes de jeu.

**Les rencontres** (`majRencontres`, chaque minute de jeu).
- **Conditions :** deux habitants éveillés, qui ne marchent pas, au même endroit : à moins de 3,2 m, dans la même maison ou dehors. Une même paire ne se rencontre pas plus d'une fois toutes les 2 h.
- **L'humeur** de History vient des besoins (moral sous 35 ou faim sous 25 : −0,3) et du caractère (bourru, méfiant, taciturne, têtu : −0,12).
- **Déroulement :**
  - **inconnus :** ils se présentent (`greet`) et se connaissent désormais ;
  - **sinon,** History décide (`npc-meet`) :
    - **discussion :** un sujet tiré selon le contexte ; +0,04 de relation, +2 de moral ;
    - **entraide :** +0,12, et un bon souvenir ;
    - **dispute :** soit l'un s'excuse, soit −0,2, −5 de moral et un mauvais souvenir (« il m'a crié dessus »).
- **Sujets propres à l'enclos** (`LIGNES_ENCLOS`), avec leur poids :

| Sujet | Quand |
|---|---|
| Le mur (2 variantes), l'homme du portail, le train, le drapeau noir, d'où l'on vient (métier), pourquoi on est venu | à tout moment (sauf les froids et Victor, qui se taisent sur leurs raisons) |
| La forêt la nuit | surtout la nuit |
| Le portail refermé | une fois le portail fermé |
| Les vivres | quand il reste moins de 2 jours de rations |
| La faim | quand on a faim |
| La pluie, le froid | selon la météo |
| Le travail | au travail |
| La veillée | au mât |
| Un malade | quand quelqu'un est au lit |

- **Ce que le joueur voit :**
  - les deux se tournent l'un vers l'autre et parlent (animation Talk) ;
  - à moins de 9 m, l'échange s'affiche en sous-titres, une réplique toutes les 3 s. Le nom n'apparaît que si le joueur connaît la personne, sinon « Un voyageur ». **On apprend des prénoms en écoutant.**
- **Nouveau sujet avec le joueur :** « Et les autres, ça se passe comment ? ». Réponses possibles :
  - « Je m'entends bien avec Gérard. » ;
  - « Bastien, par contre… Il m'a crié dessus. » ;
  - chez les froids : « Chacun ses affaires. ».

**Itinéraires.**
- **La carte** (`carteSpatiale`) couvre l'enceinte en cases de 2 m (18 354 cases, 651 obstacles). On y trouve :
  - toutes les collisions du domaine, les 7 maisons (boîtes orientées), les troncs (0,45 m) et les rochers ;
  - les 7 chemins comme trajets préférés (coût 0,55) et 9 repères (portes, puits, mât).
- **Le calcul :** `itineraire()` passe par `routeRapide`. C'est un A* à 8 voisins sur la grille de `A.spatial`, avec un tas binaire, le coût des chemins précalculé, aucun coin coupé, puis un lissage par visée limité à 28 m pour suivre les chemins sans les couper.
  - On reprend le réseau du lot 8 si aucun trajet n'est trouvé : aucun cas sur 3 jours.
  - `A.spatial.route()` marche aussi, mais prenait 15 à 280 ms par trajet ; `routeRapide` en prend 1 à 10.
- **History** est relié à la carte (`bindHistory`, avec repli), pour ses propres déplacements à venir.

**Test (3 jours simulés) :**
- 146 rencontres : 39 présentations, 86 discussions, 1 dispute ;
- 39 paires sur 171 se connaissent, relation moyenne 0,17 ; la meilleure paire est Odile et Gérard (0,38) ;
- 317 trajets calculés, aucun repli, aucun trajet qui traverse une maison ;
- 12 sujets différents abordés.

## 0 septdecies. Lot 14 : météo, froid, maladie ; le portail se referme (HDF : ENCLOS)

**Où le trouver :**
- **Données en tête :** `METEO_J`, `METEOS`, `FEU`, `FEU_NOEUDS`, `meteoAppliquee`, `MALADIE`, et `PORTAIL.anime`, `PORTAIL.vantaux`, `PORTAIL.etat`.
- **Bloc « LE PORTAIL SE REFERME » :** `vantauxPortail`, `posePortail`, `fermerPortail`, `ouvrirPortail`, `majPortail`.
- **Bloc « LOT 14 — MÉTÉO, FROID, MALADIE » :** `tirerMeteo`, `majMeteo`, `ciel`, `majPluieDedans`, `feuxCheminees`, `actionCheminee`, `chaleurInterieure`, `majMaladieJoueur`, `majMaladiePNJ`, `evanouir`.

**Le portail se referme.** Une fois le train reparti, quand le joueur et les 19 voyageurs sont tous dans l'enceinte (ou dans une maison), les deux vantaux pivotent lentement sur leurs charnières (16 s, accélération douce). Aucun message ne s'affiche : on le voit se refermer.
- **On ne ressort plus :** une barrière (`PORTAIL.barriere` dans `COLL`) est posée dès le début de la fermeture. Le test le confirme : on s'arrête à 143,2 m, le seuil est à 145 m.
- **Prochain train :** `ouvrirPortail()` rouvre le portail et retire la barrière. Il est déjà appelé quand on rejoue l'ouverture.
- **Les vantaux** sont deux petits nœuds animés (`F.Node`, matrice charnière × rotation). Ils ne sont plus fusionnés dans le mur.

**Météo du jour.** Le tirage est fixe par jour ; le jour 1 est toujours clair. Elle s'affiche à la place du mot « Heure » dans le panneau.

| Météo | Probabilité | Température | Effets |
|---|---|---|---|
| Clair | 40 % | — | — |
| Couvert | 25 % | −2 °C | ciel couvert, soleil faible |
| Brume | 15 % | −3 °C | brouillard ×1,9 ; elle se lève à 11 h |
| Pluie | 20 % | −5 °C | pluie du moteur (`A.meteo('pluie')`), sol mouillé (`A.wet`), brouillard ×1,6 ; la veillée est annulée |

- **Rendu :** le ciel passe par `ciel(env)` dans `heure()`.
- **À l'abri :** la pluie ne tombe pas dans les maisons ni dans le wagon (`majPluieDedans`).
- **Test (12 jours) :** clair, couvert, couvert, clair, pluie, brume, couvert, couvert, couvert, clair, couvert, couvert.

**Froid et feu de cheminée.**
- **Dehors,** la chaleur suit la température : 7 °C vers 3 h, 19 °C vers 15 h, plus l'écart dû à la météo. La pluie retire 25 points de plus. Dehors à 23 h sous la pluie, la chaleur descend à 24.
- **Dans une maison sans feu,** la température suit celle de dehors (environ 60 la nuit). **Avec un feu,** elle monte à 100.
- **Allumer un feu :** à la cheminée de sa maison, ou d'une maison vide (« Allumer le feu », +5 calme). Le feu dure 4 h. Les habitants l'allument aux repas et en rentrant quand il fait moins de 15 °C.
- **Feu allumé :** « Se réchauffer » remet la chaleur à 100. Des bûches et des flammes lumineuses (matériau 8, qui vacillent) apparaissent dans l'âtre, avec une lueur orange. On ne les dessine que si l'on est dans la maison.

**Maladie.**
- **Joueur :** le risque est tiré à chaque heure de jeu. Par heure : 4 % si l'hygiène est sous 25, 6 % si la chaleur est sous 25, 2 % si l'énergie est sous 10.
  - **Effets :** « malade » s'affiche en rouge ; la santé baisse de 2,5 par heure ; on marche 15 % moins vite.
  - **Guérison :** 24 à 48 h, deux fois plus vite en dormant, trois fois moins vite si l'on a froid, faim ou soif.
  - **Se faire soigner :** un voyageur soignant (premiers soins, remèdes, plantes) propose « Pouvez-vous me soigner ? ». La durée restante tombe à 40 %, et la santé gagne +10.
- **Habitants :** risques par heure de 1,2 % si l'hygiène est sous 20, 1,5 % pour un travail dehors sous la pluie et le froid, 0,3 % si un colocataire est malade, 0,5 % quand on a faim. Le malade reste au lit (`besoinUrgent`), répond « J'ai de la fièvre… Ne restez pas trop près, ça s'attrape. » et guérit en 1 à 2 jours, plus vite si la maison est chauffée.
- **Santé à 0 :** le joueur s'évanouit (fondu au noir), puis se réveille dans son lit 6 h plus tard, avec 25 de santé et le message « Quelqu'un vous a ramené chez vous et couché. Vous êtes très faible. »

**Le logo du drapeau** a été réencodé depuis l'image d'origine. Il est centré et occupe 62 % de la hauteur. Avant, le recadrage était décalé à droite et coupé en bas.

## 0 sexdecies. Lot 13 : les besoins des habitants (HDF : ENCLOS)

**Où le trouver :** les données `EAU` et `SEAUX_MAX` (en tête), le bloc « LOT 13 — LES BESOINS DES HABITANTS » (`besoinsPNJ`, `majBesoinsPNJ`, `besoinUrgent`, `evenementPNJ`, `auPuits`, `phraseBesoin`, `etatMaison`), et les points d'appel dans `majJournee`, `planifier`, `arriveDehors`, `sujets` et `reponse`.

- **Les jauges :** chaque voyageur installé a les siennes (`a.b`) : satiété, hydratation, énergie, hygiène et moral, avec un départ un peu différent pour chacun.
  - **Mise à jour :** une fois par minute de jeu, pour tous, dans `majJournee`. C'est un calcul léger, qui ne dépend pas de la distance (règle HDF : on simule tout).
  - **Le travail** (potager, atelier, bois) donne soif et fatigue plus vite, et salit.
  - **La nuit,** l'énergie remonte.
  - **Le moral** monte à la veillée (+4 par heure) et à chaque repas (+2). Il baisse lentement le reste du temps, et plus vite quand on a faim ou soif.
- **Les repas** puisent dans la maison : une ration du garde-manger (+50) et un seau d'eau (+40).
  - **Garde-manger vide :** pas de repas, −6 de moral, et la personne le dit.
  - **Les stocks :** le garde-manger est compté pour **3 jours** (9 rations par habitant, plus 4), soit 37 rations dans la maison du joueur. Sans production (phase « autarcie »), les maisons sont presque vides au midi du jour 4.
- **L'eau :** chaque maison a 12 seaux (`EAU`).
  - Un repas ou une toilette en prend 1. **Le joueur aussi** boit et se lave dans les seaux de la maison où il est (évier, lavabo), et un bain en demande 3.
  - Un habitant qui va au puits boit, puis remplit les seaux de sa maison.
  - Le joueur peut remplir les siens au puits avec l'action « Remplir vos seaux ».
- **Besoins urgents :** ils passent avant l'emploi du temps et peuvent interrompre une marche. La nuit reste la nuit.

| Condition | Activité |
|---|---|
| Hydratation < 20 | puits |
| Satiété < 18, et des rations à la maison | repas |
| Énergie < 12 | lit |

- **Dans la conversation :**
  - **« Comment ça va ? »** donne d'abord le besoin le plus pressant : garde-manger vide, seaux vides ou soif, faim, fatigue, envie d'un bain, moral au plus bas. Le ton (froid, chaleureux) est respecté.
  - **Nouveau sujet « Il vous manque quelque chose ? »** La personne fait l'état de sa maison : de quoi manger pour combien de jours, l'eau qui manque.
  - « Au revoir » reste toujours proposé.
- **Test (4 jours simulés) :** satiété moyenne 87, hydratation 82, énergie 60 et hygiène 49 ; les seaux restent entre 7 et 11. Au midi du jour 4, il reste 4 à 7 rations par maison (17 chez le joueur), et Inès répond « Il reste à peine de quoi manger demain. »

## 0 quindecies. Lot 12 : survivre (HDF : ENCLOS)

**Où le trouver :** les données `TEMPS` et `GARDE_MANGER` (en tête), le bloc « LOT 12 — SURVIVRE » (`MEUBLES_ACTION`, `actionMeuble`, `actionPuits`, `boire`, `manger`, `laver`, `prendreBain`, `rations`, `dormir`, `reveiller`, `majSommeil`, `pasSimulation`) et l'écran `#sommeil`.

Les actions passent par le bouton d'action habituel (touche **E** ou bouton à l'écran). Elles se lisent dans le plan de la maison (`INTERIEURS.plan(id).mobilier`) : il suffit d'être au même niveau, à moins d'un mètre du meuble.

| Où | Action | Effet |
|---|---|---|
| Puits | Boire au puits (si l'hydratation est sous 90 ou l'hygiène au-dessus de 80), sinon Se laver au puits | +35 hydratation ; +30 hygiène, mais −15 chaleur |
| Évier (toutes les maisons) | Boire au robinet | +35 hydratation |
| Lavabo | Boire au lavabo (si l'hydratation est sous 60), sinon Se laver | +35 hydratation ; +20 hygiène |
| Frigo ou buffet, **chez soi** | Manger (rations restantes) | une ration en moins, +35 satiété, +3 moral |
| Baignoire, **chez soi** | Prendre un bain | hygiène et chaleur à 100, +10 calme, 25 min de jeu |
| Lit, **chez soi** | Dormir | voir ci-dessous |

- **Chez les autres :** on peut boire, mais on ne mange pas, on ne prend pas de bain et on ne dort pas. Le joueur habite la maison du centre (`FOYERS.joueur`).
- **Garde-manger :** 4 rations, plus 2 par habitant, comptées à la première visite (14 chez soi une fois les voyageurs installés). Il n'y a pas encore de réapprovisionnement : c'est la phase « autarcie et ressources ». Au lot 13, les repas des habitants y puiseront.
- **Dormir :** possible la nuit (après 20 h 30, avant 6 h) ou dès que l'énergie est sous 70 ; sinon « Vous n'avez pas sommeil ».
  - **Pendant le sommeil :** l'écran passe au noir et affiche l'heure qui défile. Le temps va 60 fois plus vite (une nuit de 8 h dure environ 16 s). Toute la simulation suit, voyageurs compris, par pas de 0,5 s (`pasSimulation`). L'énergie remonte de +14 par heure, et la faim et la soif baissent deux fois moins vite.
  - **Le réveil :**
    - après une nuit : dès 6 h 30 si l'énergie est à 90, et au plus tard à 10 h ;
    - après une sieste : à 90 d'énergie ou au bout de 3 h ;
    - plus tôt si la faim, la soif ou le froid deviennent critiques ;
    - à tout moment avec le bouton « Se réveiller » ou la touche E.

    On se relève là où l'on s'était couché.
- **Test :** puits, puis évier, frigo, bain et lit. Couché à 22 h avec 30 d'énergie, on se réveille à 6 h 39 avec 100 d'énergie, 74 de satiété et 61 d'hydratation ; 14 voyageurs dorment encore.

## 0 quattuordecies. Lot 11 : tes besoins (HDF : ENCLOS)

**Où le trouver :** les données `BESOINS_DEPART`, `BESOINS`, `BESOINS_INFO`, `ETAT_JOUEUR` (en tête, avec `TEMPS`, `MALADIE` et `METEO_J` réservés aux lots 12 et 14), le bloc « LOT 11 — LES BESOINS DU JOUEUR » (`majBesoins`, `facteurVitesse`, `peutCourir`, `majAffichageBesoins`, `notifier`), les éléments `#alertes` (sous la mini-carte), `#besoins` (dans le panneau de droite) et `#notif`.

- **Huit jauges de 0 (critique) à 100 :** satiété, hydratation, énergie, santé, hygiène, chaleur, calme, moral. On arrive un peu affamé, assoiffé et fatigué par le voyage (70, 60, 65).
- **Elles évoluent au temps de jeu** (1 h de jeu = 2 min réelles), par heure :

| Jauge | Évolution |
|---|---|
| Satiété | −6 (×1,4 en courant) |
| Hydratation | −9 (×1,6 en courant) |
| Énergie | −5 debout immobile, −8 en marchant, −15 en courant, +3 assis, +14 endormi (lot 12) |
| Hygiène | −2,5 (×1,5 en courant) |
| Chaleur | tend vers 100 à l'abri (wagon, maison) ; dehors, vers une valeur tirée de la température : 7 °C vers 3 h, 19 °C vers 15 h (`temperatureDehors`) |
| Santé | −2 si satiété < 15, −4 si hydratation < 15, −2 si chaleur < 20, −1 si énergie < 8 ; +1,5 si satiété et hydratation > 50 et énergie > 40 |
| Calme | +1,5, mais −4 la nuit dehors (avant 6 h, après 21 h 30) ; +1,5 par échange de conversation |
| Moral | −0,6, et −2 de plus quand on a faim ou soif ; +2 par échange de conversation |

- **Effets :** sous 20 d'énergie ou 25 de santé, on ne court plus, et la marche ralentit (×0,7 pour la fatigue, ×0,8 pour la santé).
- **Affichage discret :** rien tant que tout va bien. Sous 40, un mot apparaît sous la mini-carte (« faim », « soif », « fatigue », « froid »…), en rouge sous 15. Au passage des seuils 40 et 15, une phrase s'affiche quelques secondes (« Vous avez soif. », « Votre gorge est sèche, il faut boire. »).
- **Panneau « État »** (bouton dans le panneau de droite ou touche **B**) : les huit barres avec leur valeur.
- **Mise à jour :** une fonction `A.onUpdate` à part, arrêtée pendant la cinématique et en survol. Le panneau ne se redessine que toutes les 0,4 s, et seulement s'il change.
- **Régler l'équilibre :** tous les taux sont au début de `majBesoins`, en points par heure de jeu.
- **Test :** 4 h immobile dehors puis 3 h de marche donnent satiété 28, hydratation 0, énergie 21, santé 92 (elle baisse dès que l'hydratation est à zéro).

## 0 terdecies. Lot 10 : parler (HDF : ENCLOS)

**Où le trouver :** les données `DIALOGUE` et `RAISON_JE` (en tête), le bloc « LOT 10 — PARLER » (`voyageurEnFace`, `sujets`, `reponse`, `ouvrirDialogue`, `choisir`, `fermerDialogue`) et le panneau `#dialogue`.

- **Engager la conversation :** on regarde un voyageur à moins de 2,8 m, dans la même pièce et au même niveau (à bord, dehors ou dans une maison dont l'intérieur est construit). L'action « Parler » apparaît (touche E ou bouton), puis « Parler à Odile » une fois qu'elle s'est présentée. L'interlocuteur s'arrête : debout, il se tourne vers toi et gesticule (`Talk`) ; assis, il passe en `Sit_Talk`. La conversation se ferme si l'on s'éloigne de plus de 4 m, avec « Au revoir » ou avec Échap.
- **Les sujets,** numérotés (touches 1 à 5 ou toucher) :
  - **Se présenter :** le joueur apprend le nom et le métier ; sinon, la personne reste « Voyageur » ou « Voyageuse ».
  - **Pourquoi êtes-vous venu(e) ?** La raison est dite à la première personne (`RAISON_JE`). Victor, secret, refuse toujours. Les personnes froides répondent « Des affaires personnelles » tant que la confiance n'a pas atteint 8 : il faut revenir plus tard.
  - **Que savez-vous faire ?** Les trois compétences de la fiche.
  - **Que pensez-vous de cet endroit ?** La réponse dépend des traits :
    - sceptique : « Ce n'est pas le Hameau de Feral » ;
    - anxieux ou fragile : la peur du mur ;
    - curieux ou audacieux : l'envie de trouver une sortie ;
    - mystique : « la forêt nous regarde » ;
    - autoritaire : il faut s'organiser.
  - **Et l'homme du portail ?** Disponible une fois le train reparti. **Premier indice :** Paul, qui a la mémoire des visages, a déjà vu l'homme « sur un autre quai, il y a longtemps ». Simone, mystique : « il n'avait pas d'ombre ».
  - **Comment ça va ?** Selon ce qu'il fait (travail, repas, veillée, sommeil, voyage) et la confiance.
  - **Au revoir.** Un voyageur qui dort répond seulement « Mmh… laissez-moi dormir. »
- **Le ton** (`TON`) vient des traits de personnalité :
  - **froid :** méfiant, secret, taciturne, solitaire, sceptique, réservé, bourru ;
  - **chaud :** bavard, jovial, sociable, charmeur, bienveillant, drôle, doux, serviable ;
  - **neutre :** tous les autres.

  On dit « Bonjour » ou « Bonsoir » selon l'heure, et les accords suivent le sexe.
- **La mémoire :** la confiance (`a.relation`, de −100 à 100) monte à chaque échange (+8 pour une présentation chaleureuse, +2 pour une présentation froide, +3 quand la raison est confiée, −1 pour un refus). Chaque échange est noté dans `a.memoire` (jour, heure, sujet, confiance). Les noms appris sont dans `DIALOGUE.connus`. Tout est remis à zéro avec l'ouverture.
- **Pendant une conversation,** l'emploi du temps ne déplace pas l'interlocuteur.

## Phase « Les 20 voyageurs » : terminée (lots 6 à 10)

Le jeu s'ouvre sur la cinématique. On se réveille dans le wagon parmi 19 voyageurs, chacun avec sa fiche. On descend, l'homme accueille le groupe et repart avec le train. Chacun rejoint sa maison, puis vit sa journée (travail, repas, veillée au grand mât, nuit). On peut parler à chacun.

**Phase en cours : besoins et survie (lots 11 à 14).** **Phase « Besoins et survie » terminée (lots 11 à 14)** : tes besoins, survivre, les besoins des habitants, météo, froid et maladie. Le portail se referme derrière les arrivants.

**Phase « History » terminée (lots 15 et 16)** : History Sens et la carte spatiale, la vie sociale visible.

**Vers la v1 :** lots 20 à 22 faits (le train scientifique, la capture et la boucle, la violence). **v1.0 terminée (lots 20 à 25)** : le train scientifique, la capture et la boucle, la violence, les lettres d'Ilona, l'évasion, l'accueil. Suivent : la capture et la boucle, la violence et ses conséquences, l'enquête et les indices, l'évasion, puis la finition de la v1.

**Phase « Autarcie » terminée (lots 17 à 19)** : produire, travailler, s'organiser. Le village tient seul plus de 20 jours, avec des crises.

**Prochaines phases du document de conception :** besoins et survie, autarcie et ressources, relations et mémoire individuelle entre habitants, train scientifique et cachettes, boucle temporelle, enquête et véritable fin.

## 0 duodecies. Lot 9 : la journée (HDF : ENCLOS)

**Où le trouver :** la donnée `HORLOGE` (en tête), et le bloc « LOT 9 — LA JOURNÉE » (`metierDuJour`, `activite`, `butPour`, `planifier`, `arriveDehors`, `majJournee`).

- **L'horloge** (`HORLOGE`) avance de 0,5 minute de jeu par seconde réelle, comme dans HDF WALL : une journée dure 48 minutes. Le soleil et les ambiances suivent l'heure. Le panneau affiche « Jour N · hh h mm ». La réglette (0 à 24 h) règle l'horloge, et l'horloge est arrêtée pendant la cinématique.
- **L'emploi du temps** (`activite`) est décalé de ±35 min selon la personne, pour que tout le monde ne bouge pas en même temps :

| Heures | Activité |
|---|---|
| 22 h 30 – 7 h | Au lit |
| 7 h – 7 h 40 | Petit déjeuner à table |
| 7 h 40 – 8 h 20 | Un sur trois va boire au puits, les autres restent chez eux |
| 8 h 20 – 12 h 15 | Travail |
| 12 h 15 – 13 h 15 | Déjeuner |
| 13 h 15 – 17 h 30 | Travail |
| 17 h 30 – 19 h 30 | Veillée autour du grand mât (à partir du jour 2 ; le premier soir, chacun découvre sa maison) |
| 19 h 30 – 20 h 30 | Dîner |
| Après | Chez soi |

- **Le travail** (`metierDuJour`) dépend des compétences de la fiche :
  - **potager** pour cultures, semences, plantes, cueillette, remèdes ou élevage : binage, bêchage, arrosage, semis, râteau, dans le potager de sa maison ;
  - **atelier** pour menuiserie, construction, réparation, moteurs, électricité, soudure ou mécanique : marteau ou scie devant sa cabane ;
  - **bois** pour force, feu, sécurité ou boucherie : fendre du bois à côté de la cabane ;
  - les autres font, selon le cas, potager ou maison.
- **Les déplacements :** chaque minute de jeu, un voyageur dont l'activité change sort de chez lui si besoin, suit les chemins (`itineraire`), entre par la porte et prend la place voulue (`entrer(a, role)` : `lit`, `table`…). Dehors, il se tourne vers son ouvrage et joue l'animation prévue.
- **Vérifié** par la simulation d'une journée :

| Heure | Constat |
|---|---|
| 23 h 36 | 19 au lit |
| 7 h 18 | 11 à table |
| 10 h | 10 au potager, 4 à l'atelier, 3 au bois |
| 12 h 48 | 16 à table |
| Jour 2, 18 h 42 | 15 autour du grand mât, 4 en chemin |

  La simulation complète de 25 h de jeu tient en 1,7 s dans le navigateur de test.
- **À faire plus tard :** à l'intérieur, on passe d'une place à l'autre (de la table au lit) sans marcher, et les villageois ne montent pas les escaliers à pied.

## 0 undecies. Lot 8 : l'installation (HDF : ENCLOS)

**Où le trouver :** les données `RESEAU` et `FOYERS` (en tête), et le bloc « LOT 8 — L'INSTALLATION » (`construireReseau`, `itineraire`, `repartirFoyers`, `allerChezSoi`, `entrer`, `majInstallation`).

- **Le réseau des chemins :** un nœud tous les 3 m sur chaque chemin de `CHEMINS`, des liaisons entre les chemins qui se touchent (moins de 3,2 m), et le plus court chemin par Dijkstra. `itineraire(ax, az, bx, bz)` renvoie la suite de points. Un nouveau chemin ajouté à `CHEMINS` entre tout seul dans le réseau.
- **Les foyers :** chaque maison reçoit autant de voyageurs qu'elle a de places de lit dans son plan (`INTERIEURS`). Un lit de la maison du centre (`FOYERS.joueur`) est gardé pour le joueur ; elle apparaît en ambre sur la mini-carte. La répartition suit une graine fixe et sera toujours la même :

| Maison | Occupants |
|---|---|
| Centre | Nadia, Élodie, Bastien + le joueur |
| Aubry | Sophie, Margaux |
| Berger | Julien, Gérard, Odile |
| Collet | Victor, Raymond, Thomas |
| Delorme | Léa, Paul |
| Fabre | Clara, Hugo, Agathe |
| Ferrand | Karim, Inès, Simone |

  La maison est notée dans la fiche (`p.maison`) et dans le registre (`occupants`).
- **Le déroulé :** 4 s après le départ du train, chaque voyageur quitte l'allée l'un après l'autre et rejoint la porte de sa maison par les chemins, à 1,25–1,45 m/s. Il entre et prend une place « habitant » libre de son plan : table, salon, cuisine ou ménage, avec l'animation prévue.
  - Vérifié par simulation : tous sont chez eux au bout de 6 min de jeu (le trajet le plus long fait environ 240 m).
- **Le rendu :** les voyageurs qui sont dans une maison ne sont dessinés que si son intérieur est construit (à moins de 30 m), avec l'éclairage intérieur.
- **Correctif :** si l'on passait la cinématique et qu'on se levait dans la même image, les voyageurs partaient de leur position du début de la cinématique, à 230 m. Leurs places sont maintenant recalées au début de la descente.

## 0 decies. Lot 7 : l'arrivée, et le grand mât (HDF : ENCLOS)

**Où le trouver :** les données `ARR`, `HOMME` et `MAT` (en tête), le bloc « LOT 7 — L'ARRIVÉE » (`lancerDescente`, `scenarioAccueil`, `lancerDepart`, `resetArrivee`, `majPassagers`, `dessinerPassagers`), la fonction `drapeau(A)`, et le mât dans le bloc domaine de `build`.

**Les étapes** (`ARR.etape`) :

| Étape | Ce qui se passe |
|---|---|
| `assis` | Tout le monde est à bord. La suite démarre quand le joueur se lève, ou au bout de 25 s. |
| `descente` | Les voyageurs se lèvent l'un après l'autre (0,9 s d'écart), longent le couloir jusqu'à la porte la plus proche, descendent et rejoignent leur place sur deux arcs face à l'homme (`spotsQuai`). |
| `accueil` | Il démarre quand le groupe est réuni (ou au bout de 45 s) et que le joueur est descendu. L'homme salue (`Wave`) : « Bonsoir à tous. Bienvenue au Hameau de Feral. » Il parle (`Talk`) : « Vos maisons sont prêtes, derrière ce portail. Vous y trouverez tout le nécessaire. » Puis il montre le portail (`Point`) : « Suivez le chemin. Bonne soirée. » Sous-titres dans `#sousTitre`. |
| `embarque` | Les voyageurs partent vers l'allée du domaine (`cheminDomaine`, `spotsAllee`) et l'homme remonte dans la voiture 1. Si le joueur est encore à bord : « Terminus. Il faut descendre, le train repart. », toutes les 8 s. |
| `depart` | Le train accélère vers l'est (0,55 m/s², 22 m/s au plus). Ses collisions et la zone de marche du wagon sont désactivées. |
| `parti` | Le train a disparu au-delà de 520 m. |

- **L'homme :** long manteau sombre, chapeau, 1,04 fois la taille normale. Il attend en haut de la rampe, face au quai.
- **Éclairage :** à bord, les voyageurs reçoivent l'éclairage intérieur ; dehors, celui du jour (valeurs de VIE).
- **Remise à zéro :** « Revoir l'ouverture » remet l'arrivée à zéro. « Recentrer la vue » ramène au siège, ou sur le quai si le train est parti.
- **Vérifié** par une simulation pas à pas : au bout de 30 s, 17 voyageurs sont arrivés sur le quai ; puis viennent l'accueil, l'embarquement de l'homme, le départ du train, et les voyageurs dans l'allée.

**Le grand mât** (`MAT`) est au milieu du village, à 8 m à l'est de l'allée. Il fait 18 m, avec un socle de pierre à deux degrés, un fût métallique effilé et une boule dorée au sommet.
- **Le drapeau** noir porte le logo (pyramide), recadré pour l'agrandir (`images/drapeau-logo.jpg`, intégré au HTML dans `IMG_LOGO`). Il mesure 7,5 × 5 m.
- **Il flotte** grâce à 16 bandes texturées dont la position suit une onde. Le vent forcit et faiblit lentement, et le drapeau projette son ombre.
- **Pour changer l'image**, on remplace `IMG_LOGO` ; pour changer la taille ou la finesse de l'onde, on modifie `MAT.drapeau` (`L`, `H`, `n`).

## 0 nonies. Lot 6 : les voyageurs à bord (HDF : ENCLOS)

**Où le trouver :**
- le pack « Joe » et son moteur, copiés tels quels de HDF WALL, dans le script placé avant FSM3D (`self.JOE_PACK`, `Joe`) ;
- les données `VOYAGEURS` et `PASSAGERS` (en tête, avant `hauteurSol`) ;
- les fonctions `placesVoiture`, `initPassagers`, `majPassagers` et `dessinerPassagers` (bloc « LOT 6 — LES VOYAGEURS »).

- **Les 19 fiches** (`VOYAGEURS`) donnent pour chacun : prénom, nom, sexe, âge (23 à 67 ans), métier, trois traits de personnalité, trois compétences, raison du voyage et attitude à bord (`lit`, `parle`, `assis`). Exemples : Odile Marchal, institutrice retraitée, veut rejoindre la maison de sa sœur qui ne répond plus à ses lettres ; Victor Ancel, ancien militaire, refuse de dire pourquoi il voyage.
- **Les places** (`placesVoiture`) : 36 places, 2 par banquette (couloir, fenêtre), sur 8 rangs vis-à-vis.
  - Le joueur a la place fenêtre côté quai du rang 6, et Odile est assise en face de lui, en train de lire.
  - Les causeurs sont placés par paires face à face : Bastien et Julien, Hugo et Léa, Clara et Élodie.
- **L'apparence :** `Joe.generateLook`, avec une graine par voyageur, donc toujours la même. Les plus de 60 ans ont la morphologie `elder`. Pas de chapeau à bord.
- **Les animations :** `Read_Sit` (livre), `Sit_Talk` et `Sit_Chair`, avec un décalage par voyageur pour qu'ils ne bougent pas tous ensemble.
- **Le rendu** reprend le shader de VIE (accordé à la chaîne HDR) avec l'éclairage intérieur chaud de VIE. Les voyageurs suivent le train pendant la cinématique. Ils sont animés à moins de 90 m ; au-delà, seule leur horloge avance.
- **Budget :** 35 000 triangles pour les 19 voyageurs ; 325 000 à l'écran depuis le couloir, en mode ordinateur.
- **Correctifs de la voiture 1,** d'après la vidéo de l'iPhone :
  - le sol scintillait, parce que le châssis métallique était à la même hauteur que le plancher ;
  - les portes côté quai étaient fermées par l'allège, un panneau plein et le lambris. Ce sont maintenant de vraies ouvertures, avec montants dorés, seuil, vantail rabattu à l'intérieur et marchepied.

## 0 octies. Lot 5 : la cinématique d'ouverture (HDF : ENCLOS)

**Où le trouver :** le bloc « LOT 5 — CINÉMATIQUE D'OUVERTURE » (`CINE`, `trainDecalage`, `cinePlan`, `cineFrame`, `lancerCinematique`, `finCinematique`). Le CSS se trouve sous « LOT 5 — cinématique », et le HTML dans `#cineHaut`, `#cineBas`, `#cineNoir` et `#cinePasser`.

**Déroulé, environ 19 s,** avec bandes noires et interface masquée :

| Temps | Plan | Ce qu'on voit |
|---|---|---|
| 0 – 2,4 s | Carton | « HDF : ENCLOS », sous-titre « Billet aller simple · Le Hameau de Feral », fondu d'ouverture |
| 2,4 – 7,5 s | A | Survol du train qui traverse la forêt dans son couloir au crépuscule, l'angle du mur en vue |
| 7,5 – 11,8 s | B | Depuis le bout du quai, le train arrive phares allumés, face au soleil couchant, et freine |
| 11,8 – 16,3 s | C | Avancée lente sur le quai vers l'entrée fortifiée, entre deux lampadaires |
| 16,3 – 19 s | D | Fondu au noir, puis réveil assis dans la voiture 1 : c'est le premier plan du jeu |

- **Le train** roule vraiment : `TRAIN.noeud.pos`, avec un freinage régulier sur 230 m en 13 s (`trainDecalage` : 35 m/s au départ, arrêt à sa place à quai).
- **Passer :** bouton « Passer », touches Échap, Espace ou Entrée, ou un toucher sur l'écran. On arrive directement assis dans le wagon.
- **« Revoir l'ouverture »** dans le panneau de droite relance la séquence.
- **Pour modifier un plan :** chaque plan est un bloc de `cinePlan(t)`, qui renvoie `{ eye, look, fov }`. Les durées sont dans `CINE` et dans les bornes de temps de `cinePlan` et du fondu (`cineFrame`).
- **À venir :** le son (grondement du train, freins, ambiance du soir), avec le moteur sonore synthétisé de HDF WALL. Il faudra un premier appui pour l'activer, car les navigateurs l'exigent.

## 0 septies. Lot 4 : la première personne (HDF : ENCLOS)

**Où le trouver :** `ZONES_MARCHE`, `zoneMarche`, `ouSuisJe` et `SIEGE0` (à côté de `hauteurSol`), la fonction `deplacer(W, dx, dz)` (au-dessus de `pousser`) et l'état `Cm.assis`.

- **Départ :** le jeu s'ouvre à la première personne, assis dans la voiture 1, côté quai, face à une baie (`SIEGE0`). Par la fenêtre, on voit le panneau « LE HAMEAU DE FERAL », le quai, l'abri et le pilier du portail. On peut regarder autour de soi. Dès qu'on avance, on se lève dans le couloir.
- **Les zones de marche** (`ZONES_MARCHE`) sont le wagon visitable, le quai, la rampe, l'allée du portail et le domaine. Ailleurs, on glisse le long de la limite. La forêt bloque toujours en plus. Il est impossible de descendre sur la voie, de longer les rails, d'aller au bout du quai ou de contourner le mur.
  - Vérifié par un trajet simulé avec la même fonction `deplacer` que le jeu : siège → couloir → porte → quai → rampe → portail → chemin du domaine, sans blocage. Les cinq sorties interdites ont été testées et sont bien bloquées.
- **L'heure** est fixée à 17 h 45 par défaut (fin de journée dorée) ; la réglette reste disponible.
- **L'état affiché :** « À bord · assis », « À bord · voiture 1 », « Gare · quai », « Devant le portail », « Dans le domaine », « Maison · … ».
- **« Recentrer la vue »** en mode À pied ramène au siège de départ. Le survol reste disponible comme outil de travail.
- **Pour ajouter une zone de marche** (par exemple une dépendance hors les murs), on ajoute un rectangle à `ZONES_MARCHE` et une zone libre à `LIBRES` (lot 1), pour que la forêt n'y pousse pas.

## 0 sexies. Lot 3 : la gare et le train (HDF : ENCLOS)

**Où le trouver :** données `GARE`, `TRAIN` et la fonction `hauteurSol` (en tête), puis la fonction `gareEtTrain(A)` (bloc « LOT 3 — GARE ET TRAIN »).

- **La voie :** l'axe est à `GARE.zr`, soit 37 m au sud du mur. Elle comprend un ballast en trapèze, une traverse tous les 65 cm et deux rails (écartement 1,435 m, hauteur 0,56 m), sur ±900 m à travers la forêt. Un passage planchéié traverse la voie dans l'axe de l'allée.
- **Le quai** (`GARE.quai`, 87 m × 17 m) est surélevé de 1,10 m, soit 55 cm au-dessus des rails. Il est dallé, avec une bordure claire côté voie. Une rampe de 9 m avec rambardes part de l'allée du portail, et des barrières en bois ferment le fond et les côtés (ouvertes au droit de la rampe).
- **L'abri des voyageurs** est à 24 m à gauche de l'allée : planches, façade ouverte côté voie, trois fenêtres éclairées au fond, toit d'ardoise, trois bancs. **Le kiosque** est à 28 m à droite, avec son comptoir éclairé, son toit et des caisses. Il y a des bancs, sept lampadaires allumés, et le panneau de gare **« LE HAMEAU DE FERAL »** en deux faces (texte sur canvas, matériau 30). On le lit depuis les fenêtres de la voiture 1.
- **Le train** est dans un nœud propre (`TRAIN.noeud`), pour que la cinématique puisse le déplacer. Il comprend une locomotive bleu nuit (capot, cabine vitrée, phares, chasse-pierres) et deux voitures vert sombre à filet doré, avec bogies, roues, marchepieds et toit.
  - **La voiture 1 est visitable :** plates-formes aux deux bouts avec des portes ouvertes côté quai, couloir central, banquettes vis-à-vis (des places pour 20 voyageurs et plus), porte-bagages, boiseries, plafond, plafonniers allumés.
  - **Sa porte est (x1 − 1,15) tombe dans l'axe du portail :** en descendant, on voit l'entrée du domaine, encadrée par les pins et deux lampadaires.
- **`hauteurSol(x, z)`** donne la hauteur du sol à pied : 0 dehors, 1,10 sur le quai, montée progressive sur la rampe, 1,75 sur le plancher du wagon. La hauteur des yeux suit en douceur.
- **Le registre** compte trois nouveaux lieux : `G001` l'abri, `G002` le kiosque, `T001` la voiture 1 (avec son nombre de places).
- **Budget :**

| Mode | Triangles à l'écran | Ordres de dessin |
|---|---|---|
| iPad | 139 000 à 165 000 | 210 à 360 |
| Ordinateur | 310 000 à 410 000 | — |

## 0 quinquies. Lot 2 : le domaine (HDF : ENCLOS)

**Où le trouver :** données `MAISONS`, `PORTAIL`, `CHEMINS`, `PUITS` et `OCCUPE` (en tête du script de la scène), et le bloc « LOT 2 — DOMAINE » dans `build`.

- **Les maisons** sont replacées comme sur la photo, façades au sud, sans autre changement (noms, tailles, styles, étages) :

| Emplacement | Maison | Position (x, z) |
|---|---|---|
| Au nord, face au portail | du centre | (−3,5 ; −99,5) |
| Nord-ouest | Collet | (−59,6 ; −67,3) |
| Ouest | Delorme | (−83,6 ; 6,3) |
| Sud-ouest | Fabre | (−46,2 ; 89,5) |
| Nord-est | Berger | (63,3 ; −67,3) |
| Est | Aubry | (87,3 ; 28,5) |
| Sud-est | Ferrand | (63,3 ; 100,6) |

- **Le portail sud** (`PORTAIL`) a une ouverture de 7 m et deux piliers de pierre sombre avec des bandes lumineuses côté gare. Ses deux vantaux en bois cerclés de fer sont ouverts à 90° vers l'intérieur et ont des collisions. Il y a un seuil de pierre et une allée dallée jusqu'à l'emprise de la gare. La brèche nord est bouchée ; la place pavée et la rue intérieure sont retirées.
- **Les chemins de terre** (`CHEMINS`) : chaque chemin est une liste de points de passage. Un id de maison (`'L004'`) se remplace tout seul par le point devant sa porte. Le rendu reprend la recette des chemins de terre de `VILLAGE` (accotement, terre, deux ornières, bande d'herbe au milieu). Il y a l'allée principale du portail à la grande maison, puis des branches vers chaque maison.
- **Pour chaque maison :**
  - un **potager** de 9 m × 7,5 m à l'est, avec terre, rangs de légumes et clôture de `VILLAGE` (poteaux, deux lisses), ouvert côté maison ;
  - une **cabane de stockage** derrière la maison, côté ouest, porte au sud.

  Les deux sont inscrits dans `HAMEAU.lieux` (types `potager` et `cabane`, avec la maison propriétaire) ; la cabane est marquée `stockage` et `cachette`.
- **Le puits** (`PUITS`) a une margelle de pierre, de l'eau sombre, une potence et un seau. Il est inscrit comme lieu `puits` (`eau`).
- **Les arbres et les rochers** évitent les chemins et toutes les emprises de `OCCUPE` (potagers, cabanes, puits), en plus des maisons.
- **Départ à pied :** devant le portail, côté gare, face au domaine. Au lot 4, le départ se fera dans le wagon.
- **Budget :**

| Mode | Triangles à l'écran | Ordres de dessin |
|---|---|---|
| iPad | 117 000 à 167 000 | 190 à 330 |
| Ordinateur | 182 000 à 440 000 | — |

**Pour ajouter ou déplacer un chemin :** on modifie ses points dans `CHEMINS`, et les arbres s'écartent tout seuls. **Pour déplacer une maison :** on change `x` et `z` dans `MAISONS` ; son chemin, son potager, sa cabane et son tableau suivent.

## 0 quater. Lot 1 : forêt et rochers (HDF : ENCLOS)

**Où le trouver :** constantes `FORET`, `PORTAIL`, `LIBRES` et `VEG` (à côté de `MAISONS`), puis la fonction `vegetation(A)` (bloc « LOT 1 — FORÊT ET ROCHERS »). Le module `ARBRES` est copié de HDF WALL dans le script 2.

- **La forêt** couvre tout, sauf les zones `LIBRES`. Chacune est un rectangle modifiable :

| Zone | Étendue |
|---|---|
| `enceinte` | l'enceinte et un dégagement de 9 m autour du mur |
| `voie ferrée` | du mur + 30 m au mur + 44 m, sur toute la largeur |
| `gare` | 120 m de large devant le portail |
| `allée du portail` | 12 m de large |

  - La forêt est faite d'une canopée en relief (procédé de `VILLAGE.forest`, avec des hauteurs mises en cache) et d'un rideau de feuillage à 7 m dans la forêt, pour qu'on ne voie jamais à travers. S'y ajoute une rangée d'arbres de lisière à 2,2 m, un tous les 6 m (8 m sur tablette).
  - `profondeurForet(x, z)` donne la distance à la lisière ; la marche est bloquée au-delà de 0,3 m.
- **Dans le village,** sur une grille de 13 m, chaque case reçoit soit un arbre (52 %), soit un bouquet de 2 à 4 rochers (20 %), soit un massif de buissons denses (8 %). Les massifs n'ont pas de collision : ce sont des cachettes. La fonction `libreVillage` écarte les maisons, les façades, la place, la rue et l'allée. Elle se recalcule seule si la disposition change.
- **Le registre `VEG`** liste chaque arbre, bouquet de rochers et massif de buissons : type, position, rayon, hauteur et `cachette`. Il servira aux cachettes, aux trajets des habitants et aux fouilles des scientifiques.
- **Budget**, suivant les règles de HDF :
  - les arbres sont dessinés en série (`ARBRES.make`, maillages partagés) ;
  - les feuillus sont toujours en version simplifiée ;
  - les arbres de lisière et les rochers ne projettent pas d'ombre ;
  - la distance d'affichage est limitée : lisière à 240 m (170 m sur tablette), village à 380 m (260 m), triplée quand la caméra dépasse 90 m de haut.

  Mesures, en triangles à l'écran :

| Vue | iPad | Ordinateur |
|---|---|---|
| Survol | 105 000 à 113 000 | 462 000 à 499 000 |
| À pied | 111 000 à 148 000 | 279 000 à 457 000 |

  Il y a 190 à 370 ordres de dessin par image. La végétation se construit en environ 1 s.

## 1. Contenu du kit

| Fichier | Rôle |
|---|---|
| `HDF BASE 1.0 KIT.html` | Le programme complet : interface, moteur FSM3D 2.10, scène. |
| `NOTE HDF BASE 1.0 KIT.md` | Cette note. |
| `correctif-roundBox.diff` | Le correctif du moteur, à reporter dans HDF WALL (voir §8). |
| `images/princesse-ilona.jpg` | L'image du tableau, en 768 × 1024 (sa copie en base64 est dans le HTML). |
| `captures/` | Captures de contrôle (survol, à pied, maison, rez-de-chaussée, étage). Elles ont été faites dans un navigateur sans carte graphique (SwiftShader), en qualité basse : le rendu réel est plus fin. |

---

## 2. Vue d'ensemble du fichier HTML

Le fichier compte trois blocs, dans cet ordre :

```
<title>, <style>, corps HTML (HUD)        ← lignes 1 à ~130
<script> 1 : FSM3D 2.10 (moteur)          ← ~555 Ko, copié de HDF WALL v1.0 (+ 1 correctif)
<script> 2 : pont + CATALOGUE             ← noms globaux et registre minimal pour les modules du jeu
<script> 3 : INTERIEURS                   ← copié tel quel de HDF WALL v1.0 (plans, mobilier, escaliers, collisions)
<script> 4 : la scène HDF BASE            ← ~280 lignes, tout ce qu'on modifie au quotidien
<!-- NOTE-INTERNE … -->                   ← résumé interne en fin de fichier (même usage que dans HDF WALL)
```

**Règle d'or :** on travaille dans le **script 4** (la scène). Les scripts 1 et 3 sont des copies du jeu : on n'y touche que pour un correctif, qu'on reporte alors aussi dans HDF WALL.

Pour s'y retrouver sans lire 6 000 lignes, on cherche les ancres (commentaires `// ----` et `// ====`) :

| Ancre à chercher | Contenu |
|---|---|
| `const FSM3D=(function(){` | Début du moteur. |
| `G.roundBox=function` | Boîtes arrondies (contient le correctif HDF BASE). |
| `function createApp(` | Application prête à l'emploi (boucle, rendu, ombres, post-traitement). |
| `PONT HDF BASE` | Script 2 : noms globaux attendus par les modules du jeu (`F`, `M3`, `GEO`, `PI`, `TAU`), registre minimal `VILLAGE` / `HAMEAU`, puis `CATEGORIES` / `SEMAINE` / `CATALOGUE` copiés de HDF WALL. |
| `INTÉRIEURS DU HAMEAU` | Script 3 : module `INTERIEURS`, copié tel quel de HDF WALL v1.0. |
| `HDF BASE 1.0 KIT — l'enceinte seule` | Script 4 : la scène. |
| `MAISON DU CENTRE` | `MAISON_DEF`, `MAISONS`, `poserMaison`. |
| `entrer, sortir, monter` | `actionDispo`, `majAction`, `agir`. |
| `function build(A)` | Construction de toute la géométrie. |
| `// ---- sol` / `// ---- rue` / `// ---- mur d'enceinte` | Les trois parties de `build`. |
| `// ---- heure` | Ambiances et soleil. |
| `// ---- caméra` | Survol, marche, collisions, commandes. |
| `// ---- interface` | Boutons, aide, mini-carte. |

---

## 3. Repère, unités, cotes

- **Unité :** le mètre.
- **Axes :** `x` vers l'**est**, `z` vers le **sud**, `y` vers le **haut**. Le nord est donc vers `z` négatif.
- **Angles de caméra :** `yaw = 0` regarde vers le nord (−z). Un yaw positif tourne vers l'ouest.
- **Soleil :** `sun: [élévation°, azimut°]`, avec un azimut de 90 à l'est, 180 au sud et 270 à l'ouest (fonction `sunFrom` du moteur).

Constantes du script 2 :

```js
const ENCEINTE = { x0: -137, x1: 130, z0: -132.5, z1: 145, h: 6, e: 1 }; // ligne médiane du mur, hauteur, épaisseur (= HDF WALL)
const GAP      = { x: 6, w: 8 };        // brèche du mur nord : centre en x, largeur
const TROT_L = 1.05, TROT_H = .06;      // trottoirs : largeur, hauteur (= HDF WALL)
const C = { grass, grass2, asph, asph2, verge };   // couleurs reprises de VILLAGE.C
const ENV_PM = { … };                   // ambiance d'après-midi du jeu
```

Dimensions qui en découlent : l'enceinte mesure 267 × 277,5 m de centre de mur à centre de mur, et la face intérieure du mur est à `e/2 = 0,5 m` de la ligne médiane. Le socle déborde de 0,2 m de chaque côté et les contreforts de 0,7 m côté intérieur.

---

## 4. Le script de la scène, section par section

### 4.1 Utilitaires

- `smooth(P, step)` : c'est `VILLAGE.smooth` de HDF WALL. Elle prend une liste de points `[[x, z], …]` et la transforme en tracé Catmull-Rom échantillonné tous les `step` mètres. Elle renvoie `{ pts, s, len }` : les points, l'abscisse cumulée et la longueur.
- `RUE` : le tracé de la rue intérieure, avec `{ id, name, w, sol, pts, s, len }`. Il est construit à partir de :
  - `oc = 1.4 + TROT_L + w/2` : la distance entre la ligne médiane du mur et l'axe de la rue. 1,4 m laisse passer les contreforts.
  - `R = 14` : le rayon du virage, mesuré sur l'axe.
  - les points : départ près de la tour nord-ouest, ligne droite le long du nord, quart de cercle de 12 pas, ligne droite le long de l'est, arrivée près de la tour sud-est.
- `COLL` : la liste des obstacles au sol pour la marche, sous forme de boîtes `{ x0, x1, z0, z1 }`. `build` la remplit.

### 4.2 `build(A)` : toute la géométrie

On accumule toute la géométrie dans `m0 = GEO.mergerLots(200, 20000)`. C'est le même procédé que le décor du village : des cellules de 200 m, fusionnées par couple matériau + couleur, ce qui fait peu d'appels de dessin. À la fin :

```js
for (const p of m0.build(mk)) { const n = new F.Node('enceinte'); n.addPart(p.mesh, null, p.color, p.mat, { cast: p.mat !== 12 && p.mat !== 24 }); n.pickable = false; A.add(n); }
```

Le sol (12) et l'asphalte (24) ne projettent pas d'ombre. Tout le reste en projette.

Aides locales, toutes copiées de `VILLAGE.build` :

| Fonction | Usage |
|---|---|
| `cube(w, h, d, r)` | `GEO.roundBox` : boîte centrée sur l'origine, avec un biseau `r` (0 accepté grâce au correctif). |
| `quad4(p, y, col, mat)` | Quadrilatère horizontal (4 points `[x, z]`) posé à la hauteur `y`. |
| `seg(x0, z0, x1, z1, y, h, t, col, mat, r)` | Boîte allongée entre deux points (bordure, muret, clôture), de hauteur `h`, d'épaisseur `t`, posée à `y`. |
| `ribbon(path, w, y, col, mat, off)` | Ruban plat de largeur `w` le long d'un tracé `smooth`, décalé de `off` (positif = à gauche du sens de parcours). |
| `m0.add(src, M, col, mat)` | Ajout bas niveau : un maillage `src` (Float32Array, 6 flottants par sommet : position et normale) transformé par la matrice `M`. |

Les trois parties de `build` :

1. **Le sol.** Un carré de 3 km à `y = −0,16`, matériau 12 (herbe, avec le détail procédural du moteur).
2. **La rue.** On empile, de bas en haut : un accotement d'herbe (`grass2`), une berme (`verge`), la chaussée (`asph`, mat. 24) et une bande centrale plus sombre (`asph2`). Viennent ensuite les deux trottoirs de dalles (`SLAB`, mat. 21, à `TROT_H`) et les bordures de granit (`CURB`, posées par `seg` à chaque pas du tracé). C'est exactement la recette des rues enrobées du bourg de HDF WALL.
3. **Le mur d'enceinte.** C'est le code « v7.12 — ENCEINTE » du jeu, avec trois ajouts :
   - la fonction `cote(horiz, fixe, a, b, inv, breche)`, qui pose un côté de mur. `horiz` vaut true pour les côtés nord et sud, qui suivent `x`. `fixe` est la coordonnée de la ligne médiane, `a..b` l'étendue, `inv` le côté intérieur (+1 ou −1) et `breche` vaut true pour couper le mur à `GAP`.
   - Par tronçon d'environ 16 m : le corps de pierre (6 m), le socle (0,6 m), deux bandeaux à 2 et 4 m et le chaperon.
   - Des contreforts tous les 9 m côté intérieur (aucun à moins de 2,4 m de la brèche), deux piliers de 1,6 m de part et d'autre de la brèche, et quatre tours carrées de 3 m de côté aux angles, avec leur dalle.
   - Chaque élément au sol est ajouté à `COLL`.

### 4.7 Maisons : coque et intérieur

`poserMaison(A, M)` fait pour chaque ligne de `MAISONS` exactement ce que `VILLAGE.build` fait pour une maison du village :
1. **La coque :** `A.make('quartier', { batiments: [o] })` avec `o = { genre: 'maison', x, z, w, d, etages, style, yaw, toit, graine, tuile }`.
2. **L'inscription :** dans `HAMEAU.lieux` (le lieu : id, type, étages, habitants, entrée) et dans `VILLAGE.GEOM` (la géométrie `o`).
3. **La porte d'entrée extérieure :** vantail, chambranle de pierre, seuil, poignée, applique et plaque. C'est le bloc « portes d'entrée des maisons » de `VILLAGE.build`, copié tel quel, avec une couleur de vantail tirée de `PORTES` selon `graine`. Elle tombe face à la porte intérieure (`P.porte.x = 0`).
4. **La collision extérieure :** une boîte dans `COLL`.

Ensuite, `INTERIEURS.init(A)` dresse un plan par lieu (`makePlan` → `TPL.maison`). Pour 2 niveaux, le plan comprend :
- **au rez-de-chaussée,** un séjour-cuisine : cuisinière, évier, frigo, buffet, table et 4 chaises, tapis, canapé, télé, cheminée, plante, cadre, et l'escalier ;
- **à l'étage,** un palier, la chambre des parents (lit double, armoire, tapis), la chambre des enfants (un lit par enfant, armoire) et une salle de bain (baignoire, lavabo).

Le solveur `resoudre` écarte les meubles des portes et de l'escalier. Le maillage est construit à la demande par `INTERIEURS.update(eye)`, appelé à chaque image. Les plafonniers s'allument au niveau où l'on se trouve.

Pour **un autre type de bâtiment** (boulangerie, café, mairie…), on met dans la ligne `type: 'boulangerie'`. Le gabarit correspondant (`FAMILLE` → `TPL.boutique`, etc.) est déjà dans le module copié, et `CATALOGUE` fournit l'enseigne. La façade de boutique (devanture, store) relève en revanche de `VILLAGE.build` (`storefront`), qui n'est pas encore repris.

### 4.7 bis Portes intérieures et correctif du plan d'étage

- **`portesInterieures(A, M)`** est appelée après `INTERIEURS.init`. Pour chaque passage de cloison du plan (`cloisons[].porte`), elle pose un chambranle (deux montants et une traverse) et un vantail en bois à panneaux, avec sa poignée, ouvert à 90°. Le vantail s'ouvre **dans la pièce, jamais sur le palier** (pièces `palier`, `couloir` ou `entrée`) ; sinon, du côté le moins encombré de meubles. Le module du jeu ne posait qu'une ouverture et un linteau.
- **Correctif dans `TPL.maison` (script 3), signalé par `HDF BASE` :** la porte de la chambre des parents était centrée à `D/4`, alors que la cloison de la salle de bain arrive à `D/2 − 2,2`. Pour toute maison à étage de moins de 10,8 m de profondeur, cette cloison coupait la porte en deux, une moitié côté palier et l'autre côté salle de bain. La porte est maintenant centrée sur la partie palier de la cloison, à `zp = min(D/4, (D/2 − 2,2)/2)`. **À reporter dans HDF WALL :** la même erreur touche les maisons à étage du village.

- **Correctif dans `INTERIEURS.build` (script 3), signalé par `HDF BASE` :** le plafond de chaque niveau était une plaque pleine. Il refermait la trémie de l'escalier : vu de l'étage, on voyait une plaque blanche à la place des marches, et vu d'en bas, l'escalier entrait dans le plafond. Le plafond est maintenant percé comme le plancher du dessus. **À reporter dans HDF WALL** (toutes les maisons et tous les commerces à étage).

### 4.8 Entrer, monter, sortir

`actionDispo()` renvoie l'action possible à l'endroit où l'on se trouve. `majAction()` l'affiche dans le bouton `#act` à chaque image, et `agir()` l'exécute en la recalculant à l'appui (touche E ou bouton) :
- **Entrer :** à moins de 1,9 m de `INTERIEURS.porteDehors(id)`, on est téléporté derrière la porte et `Cm.dans` prend la valeur `{ id, lv: 0 }`.
- **Sortir :** près de la porte, côté intérieur, au rez-de-chaussée.
- **Monter / Descendre :** au pied de l'escalier (`st.bas`) ou en haut (`st.haut`), avec changement de niveau `lv`.

À l'intérieur, la marche passe par `INTERIEURS.collide(id, lv, …)` : murs, cloisons (on passe par les portes), meubles et escalier. Les yeux sont à `lv × 3,2 + 1,65 m` et la vitesse vaut 62 % de celle du dehors.

### 4.3 Démarrage

```js
self.FSPD_MSAA = !touch;                    // anticrénelage matériel hors tablette (comme le jeu)
A = F.app('#c', { env: 'jour' });           // crée renderer, scène, caméra, boucle ; qualité auto selon l'appareil
A.camera.set('fixed', { instant: true }); A.camera.controls = false; A.camera.far = 2400;
build(A);
```

La perte du contexte WebGL affiche `#msg` avec un bouton « Recharger ».

### 4.4 L'heure

`heure(h, instant)` reprend `envFor(h)` du jeu :

| Heure | Ambiance |
|---|---|
| avant 5 h 30 | nuit |
| jusqu'à 7 h 30 | aube |
| jusqu'à 16 h | jour |
| jusqu'à 19 h 30 | `ENV_PM` |
| jusqu'à 21 h | crépuscule |
| après | nuit |

De jour, le soleil suit l'heure avec la même formule que `A.cycle` du moteur : élévation `62·sin(2π(h−6,5)/24)` et azimut `90 + (h−6,5)·15`. `A.setEnv(…, false)` fait une transition douce. La réglette `#hour` va de 5 h à 21 h 30, et la valeur de départ est `H0 = 16.5`.

### 4.5 La caméra et les commandes

L'état tient dans `Cm` :
- `mode` : `'orbite'` ou `'pied'` ;
- pour l'orbite : `t` (point visé), `yaw`, `pitch`, `dist` ;
- `w` : position et regard du marcheur `{ x, z, a, p }` ;
- `bob` : balancement de la marche.

Le cadrage de départ est dans `ORB0`, qui reproduit l'image de référence. Le point de départ à pied est dans `WALK0`, face à la brèche.

À chaque image, `A.onUpdate` calcule `eye` et `look`, puis les donne au moteur par `A.camera.fixed.eye` et `A.camera.fixed.look`. Il règle aussi `A.brouillard` (moins de brume en altitude, avec un plancher de 0,3) et `A.camera.near`.

Commandes :

| Appareil | Survol | À pied |
|---|---|---|
| Souris | Glisser : tourner · Clic droit, Maj ou Ctrl : déplacer · Molette : zoom | Glisser : regarder |
| Clavier | ZQSD ou flèches : déplacer · E / C : zoom · V ou Tab : changer de mode | ZQSD ou flèches : marcher · Maj : courir · V : changer de mode |
| Tactile | 1 doigt : tourner · 2 doigts : pincer, glisser | Pouce gauche (45 % de l'écran) : marcher · Droite : regarder |

Le clavier utilise `e.code`, c'est-à-dire les touches physiques. ZQSD en AZERTY et WASD en QWERTY marchent donc sans réglage.

Pour les collisions, `pousser(W)` repousse un cercle de 0,35 m hors de chaque boîte de `COLL` en passant par le côté le plus proche. La brèche est libre, puisqu'aucune boîte ne la couvre.

### 4.6 L'interface

- `#top` : le titre, `#hdfVer`, l'info, la mini-carte `#map` (canvas 2D de 288 px, nord en haut, 300 m de côté) et `#etat`, qui affiche le mode et « dans l'enceinte » ou « hors les murs ».
- `#side` : Survol / À pied, l'heure, Recentrer la vue.
- `#aide` : le texte d'aide propre au mode et à l'appareil. Il s'estompe tout seul.
- Le style reprend le HUD de HDF WALL (verre sombre, bleu `--blue`, ambre `--amber`, Barlow Condensed et Barlow). Sur écran étroit (moins de 640 px), les panneaux se compactent et l'info est masquée.

`self.HDF = { A, Cm, COLL, RUE, ENCEINTE, GAP }` est exposé pour la console et les bancs d'essai.

---

## 5. Les matériaux du moteur (paramètre `mat`)

| N° | Rendu |
|---|---|
| 1 | Planches (teinte par planche, joints). |
| 2 / 3 | Vitrage (2 : fenêtres de bâtiment, 3 : véhicules). |
| 6 | Eau (rubans de rivière du jeu). |
| 8 | Émissif (lumières, enseignes). |
| 12 | Sol, herbe, terre : détail procédural. Pas d'ombre portée conseillée. |
| 13 | Bois brut (fil dans l'axe). |
| 18 / 19 | Carrosserie civile usée / militaire mate. |
| 20 | Feuillage (translucide à contre-jour). |
| 21 | Béton et pierre : taches, coulures, joints. Utilisé pour le mur, les dalles et les bordures. |
| 22 | Métal clair. |
| 23 | Neige. |
| 24 | Asphalte : granulat, usure. |
| 25 | Brique (rangs et joints). |
| 30 | Texture importée (glTF / OBJ). |

Les couleurs sont données en `[r, g, b]` de 0 à 1, dans l'espace de couleur des jeux FSM (les valeurs de `VILLAGE.C` sont la bonne référence). Deux pièces de même matériau et de même couleur sont fusionnées en un seul dessin. Il vaut donc mieux réutiliser des couleurs constantes plutôt que de les faire varier au hasard pièce par pièce.

---

## 6. Faire des modifications courantes

### 6.1 Changer les dimensions du mur

Modifier `ENCEINTE`. Tout suit : le mur, les tours, la rue (calculée à partir de `ENCEINTE`), les collisions et la mini-carte. Il faut seulement revoir `ORB0`, le cadrage de départ, si l'enceinte change beaucoup de taille.

### 6.2 Déplacer, élargir ou supprimer la brèche

- **Déplacer ou élargir :** modifier `GAP.x` et `GAP.w`. Les piliers, les contreforts écartés et la mini-carte suivent.
- **Supprimer** (mur fermé, comme dans HDF WALL) : remplacer `cote(true, E.z0, E.x0, E.x1, 1, true)` par `cote(true, E.z0, E.x0, E.x1, 1)`, puis retirer le tracé de la brèche de la mini-carte (`carte()`).
- **Brèche sur un autre côté :** passer `true` en 6ᵉ argument à l'autre appel de `cote(...)`. `GAP.x` désigne alors une coordonnée **le long de ce mur** : `x` pour nord et sud, `z` pour ouest et est.
- **Plusieurs brèches :** faire de `GAP` une liste et adapter `ivs` dans `cote` pour découper l'intervalle à chaque brèche.

### 6.3 Ajouter un portail dans la brèche

Dans `build`, après le mur :

```js
const BOIS = [.36, .25, .15], FER = [.12, .12, .12];
for (const s of [-1, 1]) {                     // deux vantaux
  const x0 = GAP.x + s * .05, x1 = GAP.x + s * GAP.w / 2;
  m0.add(cube(Math.abs(x1 - x0), 2.6, .12), M3.translate((x0 + x1) / 2, 1.3, ENCEINTE.z0), BOIS, 13);
  m0.add(cube(Math.abs(x1 - x0), .08, .14), M3.translate((x0 + x1) / 2, 2.2, ENCEINTE.z0), FER, 22);
}
COLL.push({ x0: GAP.x - GAP.w / 2, x1: GAP.x + GAP.w / 2, z0: ENCEINTE.z0 - .1, z1: ENCEINTE.z0 + .1 });   // portail fermé
```

Pour un portail qui s'ouvre, il faut le placer dans son propre `F.Node` (hors de `m0`) et modifier sa matrice dans `A.onUpdate` (voir §6.6).

### 6.4 Ajouter un bâtiment simple

```js
// maison 8 × 10 m, mur crépi, toit à deux pans (prismes approchés par deux boîtes inclinées)
const X = -40, Z = 30, CREPI = [.82, .78, .7], TUILE = [.55, .2, .12];
m0.add(cube(8, 5, 10, .05), M3.translate(X, 2.5, Z), CREPI, 21);
for (const s of [-1, 1]) m0.add(cube(4.9, .25, 10.6, .03), M3.mul(M3.translate(X + s * 2.1, 6.3, Z), M3.rotZ(s * .62)), TUILE, 25);
COLL.push({ x0: X - 4, x1: X + 4, z0: Z - 5, z1: Z + 5 });
```

Pour un village complet, on peut porter depuis HDF WALL les fonctions `put`, `lrect` et les gabarits de `CATALOGUE` / `VILLAGE.build`. Elles utilisent les mêmes `m.add`, `cube` et `quad4`.

### 6.5 Ajouter une rue ou un chemin

```js
const CHEMIN = { w: 4, ...smooth([[-60, 140], [-50, 80], [-20, 40], [10, 20]], 2) };
ribbon(CHEMIN, CHEMIN.w + 1.4, -.02, C.grass2, 12);          // accotement
ribbon(CHEMIN, CHEMIN.w, 0, [.47, .39, .27], 12);            // terre (C.dirt du jeu)
for (const o of [-1, 1]) ribbon(CHEMIN, .7, .011, [.37, .3, .21], 12, o * CHEMIN.w * .22);   // ornières
```

Pour une rue enrobée avec trottoirs, on recopie le bloc `// ---- rue` en remplaçant `RUE` par le nouveau tracé. Il faut garder les hauteurs (−0,02 / −0,006 / 0 / 0,004 / `TROT_H`) pour éviter le scintillement entre couches. Pour la faire apparaître sur la mini-carte, on ajoute le tracé dans `carte()` comme `RUE.pts`.

### 6.6 Un objet qui bouge (porte, véhicule, drapeau)

```js
const node = new F.Node('porte');
node.addPart(A.R.makeMesh(cube(2, 2.6, .12)), null, [.36, .25, .15], 13, { cast: true });
node.pos = [GAP.x, 1.3, ENCEINTE.z0];
A.add(node);
A.onUpdate((dt, t) => { node.rot[1] = Math.sin(t) * .8; });   // rotation autour de y, en radians
```

Un `F.Node` a `pos`, `rot` (en radians, `[x, y, z]`) et `scale`. Le moteur recompose sa matrice à chaque image (`updateWorld`). On peut aussi lui imposer une matrice complète avec `node.matrix = M3.…`. Les nœuds s'imbriquent avec `parent.add(enfant)`. Pour qu'une pièce tourne autour d'un gond plutôt qu'autour de son centre, on la décale dans `addPart(mesh, M3.translate(1, 0, 0), …)`.

### 6.7 Changer l'heure de départ ou l'ambiance

- **Heure de départ :** `const H0 = 16.5`, et `value` / `#hv` dans le HTML pour que l'interface affiche la même chose au chargement.
- **Ambiance fixe :** remplacer l'appel `heure(H0, true)` par `A.setEnv(ENV_PM, true)` ou par un nom de `F.ENVS` : `jour`, `aube`, `crepuscule`, `nuit`, `couvert`, `brume`, `neige`…
- **Météo :** `A.meteo('pluie', 1)` (aussi `brume`, `neige`, `sable`, `clair`).
- **Cycle qui avance tout seul :** `A.cycle({ heure: 8, vitesse: 60 })`, soit 60 secondes de jeu par seconde réelle. Il faut alors masquer la réglette, ou la synchroniser avec `A.heure()`.

### 6.8 Changer la caméra

- **Cadrage de départ :** `ORB0 = { t: [x, 0, z], yaw, pitch, dist }`.
- **Point de départ à pied :** `WALK0 = { x, z, a, p }`.
- **Limites :** `pan()` borne le point visé à ±330 m, `Cm.dist` va de 8 à 900, `pitch` de 0,04 à 1,5. `pousser()` borne la marche à ±1 200 m.
- **Champ de vision :** dans `mode()`, 55° en survol et 62° à pied.
- **Hauteur des yeux :** `1.7` dans le calcul de `eye` à pied. Vitesse : `4.2` en marche, `8.5` en course.

### 6.9 Ajouter un bouton ou un réglage dans l'interface

1. Ajouter l'élément HTML dans `#side`, avec un `id` stable et la classe `chip` (bouton) ou `seg` (choix exclusif).
2. Le brancher dans la section `// ---- interface` : `$('monId').onclick = () => { … };`.
3. Pour un état visible, utiliser `aria-pressed="true|false"` : le style ambre et bleu est déjà prévu.

### 6.10 Ajouter des obstacles

Chaque élément qu'on ne doit pas traverser à pied ajoute une boîte `{ x0, x1, z0, z1 }` à `COLL`, en coordonnées monde. Pour un objet tourné, on prend sa boîte englobante, ou on ajoute plusieurs petites boîtes le long de l'objet.

---

## 7. Performances et appareils

- Au repos, la scène compte environ 28 000 triangles : c'est très léger.
- `F.app` choisit la qualité tout seul (basse sur iPad et Android, haute sur téléphone, ultra sur ordinateur) et ajuste la résolution selon le nombre d'images par seconde (`A.autoQuality`). On peut forcer la qualité avec `F.app('#c', { env: 'jour', quality: 'basse', dprMax: .8 })`, comme le profil iPad de HDF WALL.
- Pour les gros ajouts, il vaut mieux tout passer par `m0` (fusion) plutôt que de créer un `F.Node` par objet. Mettre `cast: false` aux pièces plates ou petites, et `maxDist` (en mètres) aux petits objets : `addPart(mesh, null, col, mat, { cast: false, maxDist: 260 })`.
- `A.stats` donne `fps` et `tris` (à lire en console : `HDF.A.stats`).

---

## 8. Correctif moteur : `G.roundBox` avec un rayon 0

**Le problème.** Dans FSM3D 2.10, `G.roundBox(sx, sy, sz, 0)` calcule la normale de chaque sommet comme l'écart au noyau intérieur de la boîte. Avec un rayon nul, cet écart vaut zéro, donc **toutes les normales sont nulles**. Le résultat dépend du processeur graphique : faces noires, éclairage faux ou valeurs NaN.

**Ce qui est touché dans HDF WALL v1.0 :**
- le mur d'enceinte (`GEO.roundBox(…, 0)`) ;
- en mode `LEGER` (tablette, mode sûr), tout `cube()` dont le biseau fait moins de 15 cm, puisqu'il est remis à 0 ;
- tout autre appel avec `r = 0`.

**La correction appliquée ici.** Elle tient en deux lignes, dans `G.roundBox` : quand l'écart est nul, le sommet prend la normale de la face. Le détail se trouve dans `correctif-roundBox.diff`.

```js
const vert=(p,fn)=>{ … const l=Math.hypot(d[0],d[1],d[2]);d=l>1e-9?[d[0]/l,d[1]/l,d[2]/l]:fn; …
const g=(ii,jj)=>{ … const fn=[0,0,0];fn[a]=sg;return vert(p,fn);};
```

Il est à reporter tel quel dans HDF WALL et dans tous les jeux sur FSM3D 2.10. Les boîtes avec un rayon supérieur à 0 ne changent pas.

---

## 9. Versions et livraison

- La version s'écrit à trois endroits, à monter ensemble avec le nom du fichier : `<title>`, `#hdfVer` (sous le titre) et `const HDF_VERSION` (fin du script 2). Exemple pour la suivante : `HDF BASE 1.1 KIT.html`, `Version 1.1 · Kit`, `'BASE 1.1 KIT'`.
- Le résumé `NOTE-INTERNE` en fin de fichier est à tenir à jour, comme dans HDF WALL : une ligne par version, avec ce qui change et où.

## 10. Vérifier après une modification

1. **Syntaxe :** extraire le script 2 et le passer à `node --check`.
2. **Ouvrir la page :** la console ne doit afficher aucune erreur, la mini-carte doit suivre la caméra et `#etat` doit passer de « dans l'enceinte » à « hors les murs » en sortant par la brèche.
3. **Tester les deux modes** à la souris, au clavier (ZQSD et flèches) et au tactile (pouce, pincement).
4. **Tester trois heures** (8 h, 13 h, 19 h) et vérifier que les faces du mur s'éclairent selon le soleil.
5. **Sur iPad :** vérifier la fluidité (`HDF.A.stats.fps`, viser 30) et l'absence de faces noires.
6. **Hors ligne,** avec Chromium et Playwright (SwiftShader) : `chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })`. Ce rendu ne cadence qu'à environ 1 image/s, donc il faut laisser au moins 10 s avant la capture.

## 11. Limites connues

- On ne monte pas les marches en marchant : on monte et on descend avec l'action (touche E), comme dans le jeu.
- Il n'y a pas de villageois dans les maisons : les postes (`P.postes`) sont prêts, mais le pack « Joe » et `VIE` ne sont pas repris.

- La rue s'arrête net contre les tours nord-ouest et sud-est. Il n'y a ni marquage ni passage piéton.
- À pied, on marche toujours à 1,7 m du sol : on ne monte pas sur les trottoirs de 6 cm, et on ne monte pas sur le mur.
- Il n'y a pas de végétation : le moteur la sait faire (`createVegetation`), mais HDF WALL la désactive à l'intérieur des murs.
- Les polices Google se chargent si le réseau le permet. Sinon, ce sont les polices du système.
