// Banc de tests HDF : ENCLOS — chaque test vaut un point ; le score doit être 100/100.
// node banc.js <fichier.html> [captures:0|1]
const { chromium } = require('playwright');
const FICHIER = process.argv[2], CAPT = process.argv[3] !== '0';
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 860, height: 540 } });
  const R = [], erreurs = [];
  const ok = (nom, cond, detail) => { try { detail = typeof detail === 'string' ? detail : JSON.stringify(detail); } catch (e) { detail = ''; } R.push({ nom, ok: !!cond, detail: detail || '' }); console.log((cond ? '✔ ' : '✘ ') + nom + (detail ? ' — ' + detail : '')); };
  const nouvellePage = async (init) => { const p = await ctx.newPage(); p.on('pageerror', e => erreurs.push(e.message + ' ' + (e.stack || '').split('\n')[1])); p.on('console', m => { if (m.type() === 'error' && !/ERR_FAILED|Failed to load resource/.test(m.text())) erreurs.push(m.text().slice(0, 240)); });
    if (init) await p.addInitScript(init); await p.route(/fonts\.(googleapis|gstatic)/, r => r.abort()); await p.goto('file://' + FICHIER, { timeout: 240000 }); return p; };
  const ev = async (p, f, x) => { try { const v = await p.evaluate(f, x); return v === undefined ? {} : v; } catch (e) { return { ERREUR: e.message.slice(0, 300), st: '', T: [], rep: '', aide: '', obj: '', v: [], journal: '', rum: [] }; } };
  const shot = async (p, n) => { if (!CAPT) return; await p.waitForTimeout(6000); await p.screenshot({ path: n, timeout: 400000 }); console.log('  capture ' + n); };

  // fausse synthèse vocale (comme Safari) : les répliques démarrent (onstart) seulement après un geste
  const synth = (demarre) => `(() => { const V = ['Thomas','Amélie','Aurélie (amélioré)','Daniel','Grandma','Grandpa','Jacques','Marie'].map((n, i) => ({ name: n, lang: 'fr-FR', localService: true, voiceURI: n }));
    window.__parle = []; const ss = { speaking: false, paused: false, getVoices: () => V, speak(u) { window.__parle.push(u.text); if (${demarre}) setTimeout(() => { u.onstart && u.onstart(); setTimeout(() => u.onend && u.onend(), 300); }, 50); }, cancel() {}, resume() {}, addEventListener() {} };
    Object.defineProperty(self, 'speechSynthesis', { value: ss, configurable: true }); self.SpeechSynthesisUtterance = function (t) { this.text = t; }; })();`;

  // ===== 1. Démarrage, menu, emplacements
  let p = await nouvellePage(synth('true'));
  await ev(p, () => localStorage.clear()); await p.reload({ timeout: 240000 }); await p.waitForTimeout(3000);
  let r = await ev(p, () => ({ accueil: !document.getElementById('accueil').hidden, nouvelle: !!document.getElementById('acNouvelle'), cont: document.getElementById('acContinuer').hidden, ver: document.title }));
  ok('Démarrage sans erreur', erreurs.length === 0, erreurs.slice(0, 2).join(' | '));
  ok('Menu principal affiché', r.accueil && r.nouvelle && r.cont, JSON.stringify(r));
  ok('Titre et version', /HDF : ENCLOS \d/.test(r.ver), r.ver);
  r = await ev(p, () => { document.getElementById('acNouvelle').click(); const v = [1, 2, 3].map(n => document.getElementById('sl' + n).textContent); return { slots: !document.getElementById('slots').hidden, v }; });
  ok('Trois emplacements proposés', r.slots && r.v.length === 3 && r.v.every(t => /Emplacement \d/.test(t)), r.v.join(' | '));
  r = await ev(p, () => { document.getElementById('sl1').click(); return { slot: HDF.PARTIE.slot, accueil: document.getElementById('accueil').hidden }; });
  ok('Nouvelle partie dans l’emplacement 1', r.slot === 1 && r.accueil, JSON.stringify(r));
  // ===== 2. Voyage, annonce, porte du train
  r = await ev(p, () => { const H = HDF; H.finCinematique(); H.A.autoQuality = false; H.A.setQuality('basse'); H.A.renderScale = .45; return { voy: H.VOYAGE.actif, o: H.VOYAGE.o, assis: H.Cm.assis }; });
  ok('Le jeu commence dans le train qui roule', r.voy && r.o < -500 && r.assis, JSON.stringify(r));
  r = await ev(p, () => { const H = HDF; for (let i = 0; i < 130; i++) H.pasSimulation(.25); return { annonce: H.VOYAGE.annonce, st: document.getElementById('sousTitre').textContent }; });
  ok('Annonce à 30 s : « Le Hameau de Feral, tout le monde descend »', r.annonce, String(r.st || '').slice(0, 80));
  r = await ev(p, () => { const H = HDF; for (let i = 0; i < 140; i++) H.pasSimulation(.25); return { voy: H.VOYAGE.actif, dx: H.TRAIN.noeud.pos[0] - H.TRAIN.x }; });
  ok('Le train s’arrête à quai à 60 s', !r.voy && Math.abs(r.dx) < .01, JSON.stringify(r));
  r = await ev(p, () => { const H = HDF; H.Cm.assis = false; Object.assign(H.Cm.w, { x: H.PORTAIL.x + 4, z: H.GARE.quai.z0 + 8 }); let n = 0, minD = 99; const Hm = H.PASSAGERS.homme;
    while (!Hm.cache && n++ < 8000) { H.pasSimulation(.1); if (H.ARR.etape === 'descente' || H.ARR.etape === 'accueil') { const L = H.PASSAGERS.liste.filter(a => a.etat === 'marche' && !(Math.abs(a.c.pos[2] - H.GARE.zr) < 1.45 && a.c.pos[1] > 1.2)); for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) minD = Math.min(minD, Math.hypot(L[i].c.pos[0] - L[j].c.pos[0], L[i].c.pos[2] - L[j].c.pos[2])); } }
    return { cache: Hm.cache, porte: H.TRAIN.portes[1].ouv, minD }; });
  ok('L’homme ne disparaît qu’une fois la porte fermée', r.cache && r.porte <= .02, JSON.stringify(r));
  ok('Descente : les habitants gardent leurs distances (≥ 45 cm)', r.minD >= .45, 'mini ' + (+r.minD).toFixed(2) + ' m');
  // ===== 3. Rassemblement, installation, trame acte I
  r = await ev(p, () => { const H = HDF; Object.assign(H.Cm.w, { x: 13.5, z: 9.25 }); let n = 0; while (H.RASS.etat !== 'repartition' && n++ < 20000) { H.pasSimulation(.25); H.majRassemblement(.25); } return H.RASS.etat; });
  ok('Rassemblement au mât puis répartition', r === 'repartition', r);
  await p.waitForTimeout(4500);
  r = await ev(p, () => { const H = HDF; const bt = document.querySelector('#chBtns button'); if (bt) bt.click(); for (let i = 0; i < 8; i++) { H.pasSimulation(.25); H.majRassemblement(.25); } H.majTrame(); const O = H.objectifs();
    return { install: H.ARR.install, m1: !!H.VIE.quetes.m1, ban: !document.getElementById('banniere').hidden, obj: (O.find(o => /★/.test(o.t)) || {}).t || '', cible: !!(O.find(o => /★/.test(o.t)) || {}).cible }; });
  ok('Installation, puis acte I lancé avec son bandeau', r.install && r.m1 && r.ban, JSON.stringify(r));
  ok('Objectif de la trame toujours affiché (★) avec repère', /★/.test(r.obj) && r.cible, r.obj);
  await shot(p, 'b_acte1.png');
  r = await ev(p, () => { const H = HDF, q = H.QPAR().m1, L = { x: H.MAT.x - 2.2, z: H.MAT.z + 2.4 }; H.Cm.dans = null; Object.assign(H.Cm.w, { x: L.x, z: L.z + 1 }); H.majQuetesLieux(); return { etape: H.VIE.quetes.m1.etape, st: document.getElementById('sousTitre').textContent.slice(0, 60) }; });
  ok('Étape « lire le panneau du mât » accomplie sur place', r.etape === 1, JSON.stringify(r));
  r = await ev(p, () => { const H = HDF, id = H.FOYERS.joueur; H.fouiller(id, 'armoire', id + ':armoire'); if (H.JEU.actif) { H.JEU.scores = [1, 1]; H.terminerJeu(false); } return { etape: H.VIE.quetes.m1.etape, carnet: !!(H.SAC.objets.carnetAncien || (H.VIE.sacQuete || {}).carnetAncien) }; });
  ok('Fouiller sa maison : le carnet de l’ancien occupant', r.etape === 2, JSON.stringify(r));
  r = await ev(p, () => { const H = HDF; Object.assign(H.Cm.w, { x: H.PORTAIL.x - 2.2, z: H.ENCEINTE.z1 - 2.6 }); H.majQuetesLieux(); return H.VIE.quetes.m1.etape; });
  ok('Les encoches du portail', r === 3, 'étape ' + r);
  r = await ev(p, () => { const H = HDF, a = H.PASSAGERS.liste.find(o => o.p.id === 'V10'); a.connu = true; const S = H.sujetsQuetes(a), k = (S.find(s => /^q:m1/.test(s[0])) || [])[0]; const rep = k ? H.reponseQuete(a, k) : ''; return { k, etape: H.VIE.quetes.m1.etape, rep: rep.slice(0, 60) }; });
  ok('Parler à Paul des encoches (sujet de quête, réponse)', r.k && r.etape === 4, JSON.stringify(r));
  r = await ev(p, () => { const H = HDF, a = H.PASSAGERS.liste.find(o => o.p.id === 'V07'); a.connu = true; const T = H.sujetsTrame(a), k = (T.find(s => s[0] !== 't:aide') || [])[0]; return { T: T.map(s => s[1]), rep: k ? H.reponseTrame(a, k) : '', aide: H.reponseTrame(a, 't:aide') }; });
  ok('Dialogues de la trame : sujet ouvert et réponse propre au personnage', r.T.length >= 2 && r.rep.length > 20, r.T.join(' / ') + ' → ' + r.rep.slice(0, 50));
  ok('« Qu’est-ce que je pourrais faire ? » donne une piste concrète', r.aide.length > 20, r.aide.slice(0, 70));
  // ===== 4. Nuit, lits, matin, lettre
  r = await ev(p, () => { const H = HDF; let n = 0; while (!(H.HORLOGE.jour >= 2 && H.HORLOGE.min > 60) && n++ < 400000) { H.RAID.prochain = null; H.RAID.planJour = H.HORLOGE.jour; H.pasSimulation(.25); }
    const L = H.PASSAGERS.liste.filter(a => a.couche && a.etat === 'chez'), cles = L.map(a => a.dedans + ':' + a.couche.k); return { n: L.length, uniques: new Set(cles).size, total: H.PASSAGERS.liste.length }; });
  ok('La nuit, chacun dans son lit (aucune place partagée)', r.n >= r.total - 2 && r.uniques === r.n, JSON.stringify(r));
  r = await ev(p, () => { const H = HDF; let n = 0; while (H.HORLOGE.min < 7.4 * 60 && n++ < 400000) { H.RAID.prochain = null; H.RAID.planJour = H.HORLOGE.jour; H.pasSimulation(.25); } const plein = !!H.BOITE.pleine; if (plein) { H.ouvrirBoite(); document.getElementById('lettre').hidden = true; } H.majTrame(); return { plein, fini: !!(H.VIE.quetes.m1 || {}).fini }; });
  ok('Lettre du matin : l’acte I se conclut', r.plein && r.fini, JSON.stringify(r));
  // ===== 5. Journée : places, metteur en scène, rumeurs
  r = await ev(p, () => { const H = HDF; let n = 0, pire = 99, paire = ''; while (H.HORLOGE.min < 11 * 60 && n++ < 400000) { H.RAID.prochain = null; H.RAID.planJour = H.HORLOGE.jour; H.pasSimulation(.25);
      if (n % 40 === 0) { const L = H.PASSAGERS.liste.filter(a => !a.dedans && a.etat === 'activite'); for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) { const d = Math.hypot(L[i].c.pos[0] - L[j].c.pos[0], L[i].c.pos[2] - L[j].c.pos[2]); if (d < pire) { pire = d; paire = L[i].p.prenom + '/' + L[j].p.prenom + ' ' + L[i].act; } } } }
    return { pire, paire, m2: !!H.VIE.quetes.m2 }; });
  ok('Activités : jamais deux habitants au même endroit (≥ 80 cm)', r.pire >= .8, 'mini ' + (+r.pire).toFixed(2) + ' m ' + r.paire);
  ok('L’acte II s’ouvre après l’acte I', r.m2, '');
  r = await ev(p, () => { const H = HDF; H.INTERIEURS.setInside(null); H.Cm.dans = null; Object.assign(H.Cm.w, { x: H.MAT.x + 6, z: H.MAT.z + 6 }); H.VIE.progres = performance.now() - 200000; H.DIR.appel = null; H.majMetteurEnScene(.1); const A = H.DIR.appel; return A ? { qui: A.a.p.prenom, q: A.q.id } : { rien: true, c: !!H.queteAppelable() }; });
  ok('Metteur en scène : quelqu’un vient vous chercher quand rien n’avance', r.qui, JSON.stringify(r));
  if (r.qui) { r = await ev(p, () => { const H = HDF; let n = 0; while (H.DIR.appel && n++ < 3000) { H.pasSimulation(.1); H.majMetteurEnScene(.1); } const S = H.DIALOGUE.ouvert ? H.sujets(H.DIALOGUE.a).map(s => s[0]) : []; return { ouvert: H.DIALOGUE.ouvert, quete: S.some(k => /^q:.*:go$/.test(k)), texte: document.getElementById('dlTexte').textContent.slice(0, 70) }; });
    ok('… il vous rejoint, vous interpelle et propose sa quête', r.ouvert && r.quete, JSON.stringify(r)); await shot(p, 'b_appel.png'); await ev(p, () => HDF.fermerDialogue()); }
  else ok('… il vous rejoint, vous interpelle et propose sa quête', false, 'pas d’appel');
  r = await ev(p, () => { const H = HDF; H.fermerDialogue(); if (H.ACTION.scene) H.passerScene(); H.ACTION.sceneFile = null; H.DIR.rumeurT = -1e9; H.HIST.file.length = 0; H.HIST.tFile = 0; const a = H.PASSAGERS.liste.find(o => !o.dedans && o.act !== 'dormir'); Object.assign(H.Cm.w, { x: a.c.pos[0] + 2, z: a.c.pos[2] + 2 }); H.VIE.progres = performance.now(); const A0 = H.ACTION, diag = { ea: H.enAction(), sc: !!A0.scene, cb: !!A0.combat, ch: !!A0.chasse, po: !!A0.port, gr: !!A0.grimpe, tr: !!A0.traque, co: !!A0.coince, dlg: H.DIALOGUE.ouvert, dort: H.TEMPS.dort, occ: !!H.TEMPS.occupe, jeu: H.JEU.actif, raid: H.RAID.etat, st: A0.stats, j: H.ORGA.journal.slice(0, 6) }; H.majMetteurEnScene(.1); return { rum: Object.keys(H.VIE.flags.rumeurs || {}), file: H.HIST.file.length, journal: (H.ORGA.journal[0] || '').slice(0, 70), diag }; });
  ok('Rumeur entendue : notée au journal et rend la quête disponible', r.rum.length >= 1 && /Rumeur/.test(r.journal), JSON.stringify(r));
  // ===== 5 bis. Chaque recoin : les traces ; les actes II à V ; les choix ; l'épilogue
  r = await ev(p, () => { const H = HDF; H.fermerDialogue(); H.Cm.dans = null; H.INTERIEURS.setInside(null); const bad = [], sol = [];
    for (const t of H.TRACES) { const [x, z] = H.posTrace(t); Object.assign(H.Cm.w, { x, z: z + .8 }); if (!H.actionsTraces().some(a => a.t === t.t)) bad.push(t.id); if (!H.solLibre(x, z + .8) && !H.solLibre(x + .8, z) && !H.solLibre(x - .8, z) && !H.solLibre(x, z - .8)) sol.push(t.id); }
    return { n: H.TRACES.length, bad, sol, q40: !!H.VIE.quetes.q40 }; });
  ok('Quinze traces de ceux d’avant, chacune accessible et proposée sur place', r.n === 15 && !r.bad.length && !r.sol.length, JSON.stringify(r));
  ok('La quête « Les traces de ceux d’avant » s’ouvre après le carnet', r.q40, '');
  r = await ev(p, () => { const H = HDF; for (const t of H.TRACES) H.examinerTrace(t); H.majTrame(); for (let i = 0; i < 4; i++) { const s = H.VIE.quetes.q40; const e = s && !s.fini && H.QPAR().q40.e[s.etape]; if (e && e.f()) H.avancerQuete('q40'); }
    const a = H.PASSAGERS.liste.find(o => o.p.id === 'V01'); a.connu = true; a.trameVus = {}; const T = H.sujetsTrame(a); return { vues: H.tracesVues(), fini: !!(H.VIE.quetes.q40 || {}).fini, secret: !!H.VIE.flags.secretPorte, sujet: T.map(x => x[0]).join(','), rep: H.reponseTrame(a, 't:traces').slice(0, 60) }; });
  ok('Toutes les traces : quête accomplie et secret de la porte du milieu', r.vues === 15 && r.fini && r.secret, JSON.stringify(r));
  ok('Dialogue : « Les traces des convois d’avant », réponse propre à Odile', /t:traces/.test(r.sujet) && /Jeanne/.test(r.rep), r.rep);
  r = await ev(p, () => { const H = HDF, s = H.VIE.quetes.m2, q = H.QPAR().m2; const out = [];
    while (s && !s.fini && s.etape < 1) { H.ouvrirBoite && (H.BOITE.pleine = 'l2') && H.ouvrirBoite(); document.getElementById('lettre').hidden = true; H.majTrame(); out.push('lettre'); break; }
    H.HORLOGE.min = 22 * 60; H.HORLOGE.dernier = -1; const M = H.MAISONS.find(m => m.id === 'L001'); H.Cm.dans = null; Object.assign(H.Cm.w, { x: M.x, z: M.z + (M.d || 12) / 2 + 7 }); H.majQuetesLieux(); out.push('lampe:' + s.etape);
    for (const a of H.PASSAGERS.liste) if (a.dedans === 'L001') { a.dedans = null; a.c.pos = [M.x + 20, 0, M.z + 30]; a.etat = 'attend'; }
    H.fouiller('L001', 'buffet', 'L001:buffet'); if (H.JEU.actif) { H.JEU.scores = [1, 1]; H.terminerJeu(false); } out.push('photo:' + s.etape);
    const so = H.PASSAGERS.liste.find(o => o.p.id === 'V17'); so.connu = true; const k = (H.sujetsQuetes(so).find(x => /^q:m2/.test(x[0])) || [])[0]; if (k) H.reponseQuete(so, k); out.push('sophie:' + s.etape);
    const C = { x: (H.ENCEINTE.x0 + H.ENCEINTE.x1) / 2 - 22, z: H.ENCEINTE.z0 + 2.4 }; Object.assign(H.Cm.w, C); H.majQuetesLieux(); out.push('chaussures:' + (s.fini ? 'fini' : s.etape));
    H.HORLOGE.min += 60; H.majTrame(); return { out, m2: !!s.fini, m3: !!H.VIE.quetes.m3, solC: H.solLibre(C.x, C.z) }; });
  ok('Acte II joué de bout en bout (lettre, lampe, photo, Sophie, chaussures)', r.m2, JSON.stringify(r));
  ok('Les chaussures du mur nord sont accessibles', r.solC, '');
  ok('L’acte III s’ouvre après l’acte II', r.m3, '');
  r = await ev(p, () => { const H = HDF, s = H.VIE.quetes.m3; const si = H.PASSAGERS.liste.find(o => o.p.id === 'V13'); si.connu = true; const k = (H.sujetsQuetes(si).find(x => /^q:m3/.test(x[0])) || [])[0]; if (k) H.reponseQuete(si, k);
    H.MEMOIRE.code = true; H.majTrame(); H.VIE.flags.reserveOuverte = true; H.majTrame(); H.RESERVE.page = 1; H.majTrame(); H.VIE.flags.terminalVu = true; H.majTrame(); return { fini: !!s.fini, choix: !document.getElementById('choix').hidden }; });
  ok('Acte III : Simone, le code, la réserve, la chronique, le terminal', r.fini, JSON.stringify(r));
  await p.waitForTimeout(5500);
  r = await ev(p, () => { const H = HDF, ch = !document.getElementById('choix').hidden, t = document.getElementById('chTitre').textContent, avant = H.GARDE_MANGER ? null : null; const id = H.FOYERS.joueur;
    const b = [...document.querySelectorAll('#chBtns button')].find(x => /révéler/i.test(x.textContent)); if (b) b.click(); return { ch, t, revele: !!H.VIE.flags.reserveRevelee, choixFerme: document.getElementById('choix').hidden }; });
  ok('Fin de l’acte III : choisir de révéler la réserve (le hameau change)', r.ch && /réserve/i.test(r.t) && r.revele, JSON.stringify(r));
  r = await ev(p, () => { const H = HDF; H.HORLOGE.min += 60; H.majTrame(); const s = H.VIE.quetes.m4; if (!s) return { m4: false }; H.RAID.passes = 1; H.majTrame();
    for (const id of ['V10', 'V12']) { const a = H.PASSAGERS.liste.find(o => o.p.id === id); a.connu = true; const k = (H.sujetsQuetes(a).find(x => /^q:m4/.test(x[0])) || [])[0]; if (k) H.reponseQuete(a, k); }
    H.VIE.flags.puitsVu = true; H.majTrame(); (H.VIE.flags.lettresLues = H.VIE.flags.lettresLues || []).push('l4'); H.majTrame(); return { m4: true, fini: !!s.fini, horaire: !!H.SAC.objets.horaireTrains || true }; });
  ok('Acte IV : la fouille, Paul, Thomas, le puits, la lettre', r.m4 && r.fini, JSON.stringify(r));
  await p.waitForTimeout(5500);
  r = await ev(p, () => { const H = HDF, b = [...document.querySelectorAll('#chBtns button')].find(x => /garde/i.test(x.textContent)); if (b) b.click(); H.HORLOGE.min = 23 * 60; const g = H.PASSAGERS.liste.filter(a => H.butGarde(a, 'dormir')); return { gardes: !!H.VIE.flags.gardes, n: g.length, qui: g.map(a => a.p.prenom) }; });
  ok('Fin de l’acte IV : tours de garde, deux veilleurs au portail la nuit', r.gardes && r.n === 2, JSON.stringify(r));
  r = await ev(p, () => { const H = HDF; const t0 = H.minutesTotales(), f4 = (H.VIE.quetes.m4 || {}).fini; let tt = H.HORLOGE.jour * 1440 + 660; if (typeof f4 === 'number' && tt < f4 + 31) tt += 1440; H.HORLOGE.jour = Math.floor(tt / 1440); H.HORLOGE.min = tt % 1440; H.HORLOGE.dernier = -1; H.majTrame();   /* 11 h, au moins une demi-heure après la fin de l'acte IV */ const s = H.VIE.quetes.m5; if (!s) return { m5: false, t0, t1: H.minutesTotales ? H.minutesTotales() : -1, m4: H.VIE.quetes.m4, j: H.HORLOGE.jour, journal: H.ORGA.journal.slice(0, 8) }; H.VIE.flags.lettresLues = ['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7', 'l8']; H.majTrame();
    const v = H.PASSAGERS.liste.find(o => o.p.id === 'V08'); v.connu = true; const k = (H.sujetsQuetes(v).find(x => /^q:m5/.test(x[0])) || [])[0]; if (k) H.reponseQuete(v, k); H.POUVOIR.conseilJour = H.HORLOGE.jour; H.majTrame(); H.EVASION.carte = true; H.majTrame(); const e = H.QPAR().m5.e[s.etape];
    return { m5: true, etape: s.etape, derniere: e ? e.t : '', cible: e && e.cible ? !!e.cible() : false, epi: H.epilogueChoix() }; });
  ok('Acte V : lettres, Victor, conseil, carte à ruban → dernière étape, la porte du milieu', r.m5 && r.etape === 4 && /porte du milieu/.test(r.derniere) && r.cible, JSON.stringify(r));
  ok('Épilogue : il raconte vos choix (réserve, gardes, traces)', r.epi && r.epi.length === 3, JSON.stringify(r.epi));
  // ===== 5 ter. La vie de la maison (lot 5)
  r = await ev(p, () => { const H = HDF; H.fermerDialogue(); let n = 0; while (!(H.HORLOGE.min >= 11 * 60 + 55 && H.HORLOGE.min < 12 * 60 + 30) && n++ < 300000) { H.RAID.prochain = null; H.RAID.planJour = H.HORLOGE.jour; H.pasSimulation(.25); }
    const ids = Object.keys(H.FOYERS.maisons), cuis = ids.map(id => H.roleDuJour(id, 'cuisine', 1)).filter(Boolean), auFourneau = cuis.filter(a => a.act === 'cuisine').length;
    n = 0; while (H.HORLOGE.min < 12 * 60 + 45 && n++ < 300000) { H.RAID.prochain = null; H.RAID.planJour = H.HORLOGE.jour; H.pasSimulation(.25); }
    const L = H.PASSAGERS.liste.filter(a => H.present ? true : true).filter(a => a.maison && !a.mort && !a.malade && a.act !== 'dormir'), aTable = L.filter(a => a.act === 'repas').length, postes = L.filter(a => a.dedans && a.poste).map(a => a.dedans + ':' + a.poste.x + ':' + a.poste.z);
    return { cuisiniers: cuis.length, auFourneau, total: L.length, aTable, postesUniques: new Set(postes).size === postes.length }; });
  ok('Avant le repas, le cuisinier du jour est au fourneau', r.cuisiniers >= 4 && r.auFourneau >= r.cuisiniers - 1, JSON.stringify(r));
  ok('Le repas se prend ensemble : tout le monde à table en même temps', r.aTable >= r.total - 2, JSON.stringify(r));
  ok('À table, chacun sa chaise (aucune place partagée)', r.postesUniques, '');
  r = await ev(p, () => { const H = HDF; let n = 0; while (H.HORLOGE.min < 13 * 60 + 16 && n++ < 300000) { H.RAID.prochain = null; H.RAID.planJour = H.HORLOGE.jour; H.pasSimulation(.25); } const ids = Object.keys(H.FOYERS.maisons), sales = ids.map(id => H.vieMaison(id).sale);
    n = 0; while (H.HORLOGE.min < 13 * 60 + 41 && n++ < 300000) { H.RAID.prochain = null; H.RAID.planJour = H.HORLOGE.jour; H.pasSimulation(.25); } const apres = ids.map(id => H.vieMaison(id).sale); return { sales, apres }; });
  ok('Après le repas, la vaisselle sale reste ; le plongeur du jour la fait', r.sales.some(v => v > 0) && r.apres.reduce((s, v) => s + v, 0) < r.sales.reduce((s, v) => s + v, 0), JSON.stringify(r));
  r = await ev(p, () => { const H = HDF, id = H.FOYERS.joueur, I = H.INTERIEURS, P = I.plan(id), V = H.vieMaison(id); V.sale = 4; H.EAU[id] = Math.max(2, H.EAU[id] || 0); const ev = P.mobilier.find(m => m.t === 'evier'); const act = H.actionsMaison(id, P, ev.niveau, ev.x + .3, ev.z + .3); let ok2 = false;
    if (act) { act.f(); if (H.JEU.actif) { H.JEU.scores = [1, 1]; H.terminerJeu(false); } ok2 = V.sale === 0; } I.ensure(id); I.setInside(id); H.Cm.dans = { id, lv: 0 }; const A0 = H.assiettesDe(id); return { action: act ? act.t : null, ok2, assiettes: !!(A0 && A0.propres && A0.sales) }; });
  ok('Le joueur peut faire la vaisselle chez lui (mini-jeu, colocataires reconnaissants)', r.action && r.ok2, JSON.stringify(r));
  ok('Les assiettes et les couverts existent sur la table de la maison', r.assiettes, '');
  r = await ev(p, () => { const H = HDF, id = H.FOYERS.joueur, P = H.INTERIEURS.plan(id), B = H.BESOINS; B.confort = 30; const sdb = P.mobilier.find(m => m.t === 'lavabo' || m.t === 'baignoire'); const act = sdb ? H.actionsMaison(id, P, sdb.niveau, sdb.x + .3, sdb.z + .3) : null; if (act && /toilettes/.test(act.t)) { act.f(); } const apres = B.confort; return { action: act ? act.t : null, apres, info: H.BESOINS_INFO.some(x => x[0] === 'confort'), msg: !!H.MSG_BAS.confort }; });
  ok('Besoin « confort » : aller aux toilettes', r.action && /toilettes/.test(r.action) && r.info && r.msg, JSON.stringify(r));
  await ev(p, () => { const H = HDF; if (H.TEMPS.occupe) H.TEMPS.occupe.fin = 0; H.Cm.dans = null; H.INTERIEURS.setInside(null); });
  // ===== 5 quater. Audit de cohérence des données (toutes les quêtes, objets, lieux, fragments, lettres, dialogues)
  r = await ev(p, () => { const H = HDF, P = H.PASSAGERS.liste, ids = new Set(P.map(a => a.p.id)), err = [], Q = H.QUETES, typesOk = new Set(['aller', 'occuper', 'ramasser', 'rdv', 'apporter', 'avoir', 'parler', 'parlerN', 'fouiller', 'faire', 'animal', 'si', 'lettre']);
    const meubleExiste = (maison, meuble) => { if (meuble === 'cabane') return true; const P0 = H.INTERIEURS.plan(maison); return !!(P0 && P0.mobilier.some(m => m.t === meuble)); };
    if (new Set(Q.map(q => q.id)).size !== Q.length) err.push('ids de quêtes en double');
    for (const q of Q) { if (q.qui && !ids.has(q.qui)) err.push(q.id + ' donneur ' + q.qui);
      for (const e of q.e.flatMap(e => [e, e.alt].filter(Boolean))) { if (!typesOk.has(e.type)) err.push(q.id + ' type ' + e.type);
        if (e.qui && !ids.has(e.qui)) err.push(q.id + ' qui ' + e.qui);
        for (const o of Object.keys(e.objets || {}).concat(e.objet ? [e.objet] : [], Object.keys(e.donne || {}), Object.keys(e.retire || {}))) if (!H.OBJETS[o]) err.push(q.id + ' objet ' + o);
        if (e.type === 'fouiller') { const mais = e.maison === 'qui' ? (H.PASSAGERS.liste.find(a => a.p.id === q.qui) || {}).maison || 'L001' : e.maison === 'joueur' ? H.FOYERS.joueur : e.maison; if (!meubleExiste(mais, e.meuble)) err.push(q.id + ' meuble ' + e.meuble + ' @' + mais); }
        if (e.lieu && !/^res:/.test(e.lieu)) { let L = null; try { L = H.LQ(e.lieu, q); } catch (x) { } if (!L && !/qui/.test(e.lieu)) err.push(q.id + ' lieu ' + e.lieu); }
        if ((e.type === 'si' || e.type === 'lettre') && e.cible) { try { e.cible(); } catch (x) { err.push(q.id + ' cible ' + x.message); } }
        if (e.type === 'si') { try { e.f(); } catch (x) { err.push(q.id + ' condition ' + x.message); } } }
      const r0 = q.rec || {}; for (const o of Object.keys(r0.objets || {}).concat(Object.keys(r0.retire || {}))) if (!H.OBJETS[o]) err.push(q.id + ' récompense ' + o); if (r0.fragment && !H.FRAGMENTS.some(f => f.id === r0.fragment)) err.push(q.id + ' fragment ' + r0.fragment); if (r0.recette && !H.RECETTES.some(x => x.id === r0.recette)) err.push(q.id + ' recette ' + r0.recette); }
    if (new Set(H.FRAGMENTS.map(f => f.id)).size !== H.FRAGMENTS.length) err.push('fragments en double');
    for (const f of H.FRAGMENTS) if (f.ou && f.ou.maison && !meubleExiste(f.ou.maison, f.ou.meuble)) err.push('fragment ' + f.id + ' meuble ' + f.ou.meuble);
    for (const r of H.RECETTES) for (const o of Object.keys(r.o || {}).concat(Object.keys(r.r || {}))) if (o !== 'sac' && !H.OBJETS[o]) err.push('recette ' + r.id + ' objet ' + o);
    for (const l of H.LETTRES) { try { l.quand(); } catch (x) { err.push('lettre ' + l.id + ' ' + x.message); } }
    for (const r of H.RUMEURS_Q) { const q = Q.find(x => x.id === r.q); if (!q) err.push('rumeur ' + r.q); else if (q.qui !== r.qui) err.push('rumeur ' + r.q + ' donneur ' + r.qui + ' ≠ ' + q.qui); }
    for (const k in H.SAIT) for (const id in H.SAIT[k]) if (!ids.has(id)) err.push('savoir ' + k + ' ' + id);
    for (const id of ids) if (!H.CONFIDENCES[id] || H.CONFIDENCES[id].length !== 3) err.push('confidences ' + id);
    for (const j of H.JEUX) for (const ph of j.phases || []) if (!H.PH[ph.type]) err.push('mini-jeu ' + j.titre + ' phase ' + ph.type);
    return { err: err.slice(0, 12), n: err.length, quetes: Q.length, frag: H.FRAGMENTS.length, lettres: H.LETTRES.length, jeux: H.JEUX.length }; });
  ok('Audit des quêtes : étapes, lieux, meubles, objets, personnes, récompenses', r.n === 0, JSON.stringify(r));
  r = await ev(p, () => { const H = HDF, err = []; let n = 0; const sauve = JSON.stringify({ q: Object.keys(H.VIE.quetes) });
    for (const a of H.PASSAGERS.liste) { if (a.mort) continue; a.connu = true; let S = []; try { S = H.sujets(a); } catch (x) { err.push(a.p.prenom + ' sujets ' + x.message); continue; } if (!S.some(s => s[0] === 'fin') || S.length > 8) err.push(a.p.prenom + ' choix ' + S.length);
      for (const [k] of S) { if (/^q:.*:go$|^fin$|^off:|^v:offrir|^reveiller$|^w:|^p:|^donner$/.test(k)) continue; try { const t = H.reponse(a, k); n++; if (typeof t !== 'string' || !t.trim()) err.push(a.p.prenom + ' ' + k + ' réponse vide'); } catch (x) { err.push(a.p.prenom + ' ' + k + ' ' + x.message); } }
      for (const k of ['t:aide', 't:panneau', 't:lettres', 't:traces', 't:train', 't:feral']) { try { const t = H.reponseTrame(a, k); n++; if (!t || !t.trim()) err.push(a.p.prenom + ' ' + k + ' vide'); } catch (x) { err.push(a.p.prenom + ' ' + k + ' ' + x.message); } } }
    return { n, err: err.slice(0, 10), nerr: err.length }; });
  ok('Audit des dialogues : chaque sujet de chaque habitant répond sans erreur', r.nerr === 0 && r.n > 150, JSON.stringify(r));
  r = await ev(p, () => { const H = HDF, S = H.SONx(); let joue = 0; const vieux = { f: () => { joue++; }, duree: .1, t: performance.now() - 5000 }; S.file.evt.length = 0; S.file.evt.push(vieux); S.libre.evt = 0; H.majFiles(); return { joue, reste: S.file.evt.length, max: S.max.evt }; });
  ok('Sons : un bruitage trop ancien n’est jamais joué en retard ; file bornée', r.joue === 0 && r.reste === 0 && r.max > 0, JSON.stringify(r));
  r = await ev(p, async () => { const H = HDF; H.Cm.dans = null; H.INTERIEURS.setInside(null); Object.assign(H.Cm.w, { x: H.MAT.x + 8, z: H.MAT.z + 20, a: 0, p: 0 }); H.A.renderScale = .3; await new Promise(f => setTimeout(f, 5000)); const dehors = H.A.stats.tris;
    const I = H.INTERIEURS, [x, z] = I.porteDedans('L001'); H.Cm.dans = { id: 'L001', lv: 0 }; I.setInside('L001'); I.ensure('L001'); Object.assign(H.Cm.w, { x, z, a: 0, p: 0 }); await new Promise(f => setTimeout(f, 5000)); const dedans = H.A.stats.tris; H.Cm.dans = null; I.setInside(null); return { dehors, dedans }; });
  ok('Budget : moins de 500 000 triangles dehors comme dedans', r.dehors > 0 && r.dehors < 500000 && r.dedans < 500000, JSON.stringify(r));
  // ===== 5 quinquies. L'action (1.3) : infiltration, poursuites, corps à corps, épreuves
  r = await ev(p, () => { const H = HDF; H.Cm.dans = null; H.CACHE.lieu = null; H.HORLOGE.min = 60; H.RAID.etat = 'fouille'; const s = H.scientifiques()[0]; s.c.visible = true; s.dedans = null; s.poursuite = 0; s.vue = 0; s.mefie = null; s.etat = 'vers_maison'; s.chemin = [[0, 0]];
    s.c.pos = [10, 0, 10]; s.c.yaw = 0; Object.assign(H.Cm.w, { x: 10, z: 18 }); H.JOUEUR.accroupi = false; H.ETAT_JOUEUR.vitesse = 0; const T = [];
    for (let i = 0; i < 40; i++) { H.infiltration(s, .1); T.push(+s.vue.toFixed(2)); if (s.poursuite) break; } return { T: T.filter((_, i) => i % 4 === 0), pours: s.poursuite, n: T.length, mef: T.findIndex(v => v > .4) }; });
  ok('Infiltration : la jauge de soupçon monte peu à peu, puis la blouse court', r.pours === 1 && r.n > 5 && r.T[0] < 1, JSON.stringify(r));
  r = await ev(p, () => { const H = HDF, s = H.scientifiques()[0]; s.poursuite = 0; s.vue = 0; s.mefie = null; s.c.yaw = 0; Object.assign(H.Cm.w, { x: 10, z: 22 }); H.JOUEUR.accroupi = true; for (let i = 0; i < 30; i++) H.infiltration(s, .1); const loin = s.vue;
    H.JOUEUR.accroupi = false; s.vue = 0; s.poursuite = 0; s.mefie = null; s.c.yaw = Math.PI; H.ETAT_JOUEUR.vitesse = 7; Object.assign(H.Cm.w, { x: 10, z: 17 }); for (let i = 0; i < 4; i++) H.infiltration(s, .1); const bruit = s.vue, mef = !!s.mefie; H.ETAT_JOUEUR.vitesse = 0; return { loin, bruit, mef }; });
  ok('Infiltration : accroupi hors de portée, invisible ; en courant, on s’entend dans le dos', r.loin === 0 && r.bruit > 0 && r.mef, JSON.stringify(r));
  r = await ev(p, () => { const H = HDF, s = H.scientifiques()[0], M = H.MAISONS[1], P = H.INTERIEURS.plan(M.id); let res = null;
    for (const d of [[0, 1], [1, 0], [0, -1], [-1, 0]]) { const ax = M.x + d[0] * (P.W / 2 + 4), az = M.z + d[1] * (P.D / 2 + 4), bx = M.x - d[0] * (P.W / 2 + 4), bz = M.z - d[1] * (P.D / 2 + 4); if (H.cacheParMaison(ax, az, bx, bz)) { s.c.pos = [ax, 0, az]; s.c.yaw = Math.atan2(bx - ax, bz - az); Object.assign(H.Cm.w, { x: bx, z: bz }); s.vue = 0; s.poursuite = 0; s.mefie = null; for (let i = 0; i < 30; i++) H.infiltration(s, .1); res = { vue: s.vue, d: Math.hypot(bx - ax, bz - az) }; break; } }
    H.RAID.etat = 'aucun'; s.c.visible = false; s.etat = 'fini'; return res || { aucun: true }; });
  ok('Infiltration : une maison entre la lampe et vous, on ne vous voit pas', r && r.vue === 0 && r.d < 18, JSON.stringify(r));
  r = await ev(p, () => { const H = HDF; H.HORLOGE.min = 11 * 60; const L = H.vivants().filter(a => a.maison && !a.dedans); const a = L.find(o => H.chaudSang(o) < 1) || L[0]; a.connu = true; const cible = H.MAISONS.map(m => m.id).find(id => id !== a.maison && H.rations(id) > 4);
    Object.assign(H.Cm.w, { x: a.c.pos[0] + 14, z: a.c.pos[2] }); const r0 = H.rations(cible), ok = H.lancerVol(a, cible, 2, false), r1 = H.rations(cible); const C = H.ACTION.chasse;
    for (let i = 0; i < 6; i++) H.pasSimulation(.25); const fuit = a.etat === 'marche' && a.court; Object.assign(H.Cm.w, { x: a.c.pos[0] + .8, z: a.c.pos[2] }); H.ETAT_JOUEUR.vitesse = 7; H.pasAction(.05); H.ETAT_JOUEUR.vitesse = 0;
    const combat = !!H.ACTION.combat; if (combat) H.finCombat('victoire'); const r2 = H.rations(cible); return { ok, r0, r1, r2, fuit, combat, chasse: !!H.ACTION.chasse, appr: a.approche, objectif: !!C }; });
  ok('Poursuite : le voleur s’enfuit en courant avec les rations', r.ok && r.r1 === r.r0 - 2 && r.fuit && r.objectif, JSON.stringify(r));
  ok('Poursuite : rattrapé en courant, il rend les rations (ou se bat)', !r.chasse && r.r2 === r.r0 && !r.appr, JSON.stringify(r));
  r = await ev(p, () => { const H = HDF; const a = H.vivants().filter(o => o.maison && !o.dedans && !o.approche)[2]; const cible = H.MAISONS.map(m => m.id).find(id => id !== a.maison && H.rations(id) > 4); Object.assign(H.Cm.w, { x: a.c.pos[0] + 30, z: a.c.pos[2] }); H.lancerVol(a, cible, 1, false);
    let n = 0; while (H.ACTION.chasse && n++ < 800) { H.pasSimulation(.25); H.pasAction(.25); } return { fin: !H.ACTION.chasse, n, appr: a.approche, vols: H.VIOL.vols.length }; });
  ok('Poursuite : s’il rentre chez lui, le vol est consommé et il retrouve sa journée', r.fin && !r.appr && r.vols >= 1, JSON.stringify(r));
  r = await ev(p, () => { const H = HDF; H.BESOINS.sante = 100; const a = H.vivants().find(o => o.maison && !o.dedans && !o.approche); Object.assign(H.Cm.w, { x: a.c.pos[0], z: a.c.pos[2] + 1.35 }); const ok = H.lancerCombat(a, 'provocation'); const K = H.ACTION.combat; const mus = H.quelleMusique();
    let n = 0, vuAlerte = false; while (K.ph !== 'arme' && n++ < 200) H.pasAction(.05); H.majHudAction(0); vuAlerte = !document.getElementById('cbAlerte').hidden;
    const s0 = H.BESOINS.sante; while (K.ph === 'arme' && n++ < 400) H.pasAction(.05); const recu = s0 - H.BESOINS.sante; return { ok, mus, vuAlerte, recu, hud: !document.getElementById('combat').hidden }; });
  ok('Corps à corps : garde, coup annoncé à l’écran, musique d’action', r.ok && r.vuAlerte && r.hud && r.mus === 'action', JSON.stringify(r));
  ok('Corps à corps : sans esquive, le coup porte', r.recu > 0, JSON.stringify(r));
  r = await ev(p, async () => { const H = HDF, K = H.ACTION.combat; const hp0 = K.hp, s0 = H.BESOINS.sante; let n = 0; while (K.ph !== 'arme' && n++ < 400) H.pasAction(.05); while (K.t > .25 && n++ < 800) H.pasAction(.02); H.esquiver(); while (K.ph === 'arme' && n++ < 900) H.pasAction(.02);
    const ouvert = K.ph === 'ouvert'; await new Promise(f => setTimeout(f, 500)); H.frapper(); return { ouvert, esq: K.esquives, sante: s0 - H.BESOINS.sante, coup: hp0 - K.hp }; });
  ok('Corps à corps : esquive au bon moment, il est découvert', r.ouvert && r.esq >= 1 && Math.abs(r.sante) < .5, JSON.stringify(r));
  ok('Corps à corps : la riposte porte (Carré)', r.coup >= 20, JSON.stringify(r));
  r = await ev(p, async () => { const H = HDF, K = H.ACTION.combat, a = K.a, rel0 = a.relation || 0; let n = 0;
    while (H.ACTION.combat && n++ < 30) { let m = 0; while (K.ph !== 'arme' && H.ACTION.combat && m++ < 400) H.pasAction(.05); while (K.t > .25 && m++ < 800) H.pasAction(.02); H.esquiver(); while (K.ph === 'arme' && m++ < 900) H.pasAction(.02); await new Promise(f => setTimeout(f, 480)); if (K.ph === 'ouvert') H.frapper(); H.pasAction(.05); }
    await new Promise(f => setTimeout(f, 1300)); return { fini: !H.ACTION.combat, vic: H.ACTION.stats.victoires, rel: (a.relation || 0) - rel0, appr: a.approche, fuit: a.etat === 'marche' && a.court, sante: H.BESOINS.sante }; });
  ok('Corps à corps : victoire, il s’enfuit, la relation en garde la trace', r.fini && r.vic >= 1 && r.rel < 0 && !r.appr, JSON.stringify(r));
  r = await ev(p, () => { const H = HDF; H.BESOINS.sante = 100; H.HORLOGE.min = 23 * 60; H.VIOL.attaqueJ = 0; H.VIE.flags.armeConnue = false; const a = H.vivants().find(o => o.maison && !o.dedans && !o.approche && H.chaudSang(o) >= 1) || H.vivants().find(o => o.maison && !o.dedans); a.relation = -40; a.b = a.b || {}; a.b.faim = 20;
    const c0 = H.ACTION.stats.combats; Object.assign(H.Cm.w, { x: a.c.pos[0] + 2, z: a.c.pos[2] }); H.Cm.dans = null; H.attaqueJoueur(); const K = H.ACTION.combat, res = { combat: !!K, pourquoi: K && K.pourquoi, sante: H.BESOINS.sante, n: H.ACTION.stats.combats - c0 }; if (K) H.finCombat('fin'); a.relation = 0; return res; });
  ok('Agression de nuit : un vrai combat (plus de dégâts instantanés)', r.combat && r.pourquoi === 'agression' && r.sante === 100, JSON.stringify(r));
  r = await ev(p, () => { const H = HDF; H.HORLOGE.min = 10 * 60; H.BESOINS.sante = 100; H.BESOINS.soif = 100; H.BESOINS.hygiene = 100; H.ORGA.puits = 100; const J = H.FOYERS.joueur; H.EAU[J] = 2; Object.assign(H.Cm.w, { x: H.PUITS.x + 1.6, z: H.PUITS.z }); H.Cm.dans = null;
    const ac = H.actionPuits(); ac.f(); const P = H.ACTION.port; const fv = H.facteurVitesse(); H.ETAT_JOUEUR.vitesse = 2.6; for (let i = 0; i < 100 && H.ACTION.port; i++) H.pasAction(.25); const ch = P.chutes, eau = P.eau; H.ETAT_JOUEUR.vitesse = 0;
    H.JOUEUR.h = .3; H.pasAction(.05); H.JOUEUR.h = 0; const eau2 = P.eau; const [x, z] = H.INTERIEURS.porteDehors(J); Object.assign(H.Cm.w, { x, z }); H.pasAction(.05); return { t: ac.t, port: !!P, fv: +fv.toFixed(2), ch, eau, eau2, fini: !H.ACTION.port, eauMaison: H.EAU[J] }; });
  ok('Porter : deux seaux, on ralentit, les bras lâchent, l’eau se renverse', /Puiser et porter/.test(r.t) && r.port && r.fv <= .63 && r.ch >= 1 && r.eau < 100 && r.eau2 < r.eau, JSON.stringify(r));
  ok('Porter : à la porte, l’eau rejoint les bacs de la maison', r.fini && r.eauMaison > 2, JSON.stringify(r));
  r = await ev(p, async () => { const H = HDF, G = H.GRIMPES[0], [x, z] = G.pos(); H.Cm.dans = null; H.BESOINS.energie = 90; Object.assign(H.Cm.w, { x, z: z + .6 }); const ac = H.actionAction(); if (!ac) return { aucune: true }; ac.f(); const R = H.ACTION.grimpe; if (!R) return { pas: true };
    const h0 = R.h; await new Promise(f => setTimeout(f, 320)); H.main('g'); await new Promise(f => setTimeout(f, 320)); H.main('g'); const glisse = R.h <= h0 + .33 - .3;
    let mainC = 'd', n = 0; while (!R.haut && !R.chute && n++ < 40) { await new Promise(f => setTimeout(f, 300)); if (R.cede) { H.rattraper(); continue; } H.main(mainC); mainC = mainC === 'g' ? 'd' : 'g'; H.pasAction(.3); }
    const haut = R.haut, clous = H.SAC.objets.clou || 0, flag = !!(H.VIE.flags.grimpes || {})[G.id]; R.descente = true; for (let i = 0; i < 20 && H.ACTION.grimpe; i++) H.pasAction(.25); return { t: ac.t, glisse, haut, clous, flag, fini: !H.ACTION.grimpe, ch: R.chute }; });
  ok('Grimper : main gauche, main droite ; deux fois la même main, on glisse', /Grimper/.test(r.t) && r.glisse, JSON.stringify(r));
  ok('Grimper : en haut, la niche et ce qu’elle cache ; on redescend', r.haut && r.clous >= 3 && r.flag && r.fini, JSON.stringify(r));
  r = await ev(p, () => { const H = HDF; H.HORLOGE.min = 11 * 60; const a = H.vivants().find(o => o.maison && !o.dedans && !o.approche); const rel0 = a.relation || 0; H.lancerCoince(a); const C = H.ACTION.coince; Object.assign(H.Cm.w, { x: C.x + 1, z: C.z }); const ac = H.actionAction(); ac.f(); const jeu = H.JEU.actif;
    if (jeu) { H.JEU.scores = [1, 1]; H.terminerJeu(false); } return { t: ac.t, jeu, fini: !H.ACTION.coince, rel: (a.relation || 0) - rel0, appr: a.approche }; });
  ok('Épreuve de force : soulever les bûches effondrées sur un habitant', /Soulever/.test(r.t) && r.jeu && r.fini && r.rel >= 15 && !r.appr, JSON.stringify(r));
  r = await ev(p, () => { const H = HDF; H.Cm.dans = null; H.HORLOGE.min = 11 * 60; const a = H.vivants().find(o => o.maison && !o.dedans && !o.approche); Object.assign(H.Cm.w, { x: a.c.pos[0] + 14, z: a.c.pos[2] }); const ok = H.lancerTraque(a);
    for (let i = 0; i < 6; i++) H.pasAction(.1); const d1 = Math.hypot(a.c.pos[0] - H.Cm.w.x, a.c.pos[2] - H.Cm.w.z); const [x, z] = H.INTERIEURS.porteDehors(H.FOYERS.joueur); H.Cm.dans = { id: H.FOYERS.joueur, lv: 0 }; for (let i = 0; i < 30 && H.ACTION.traque; i++) H.pasAction(.1); H.Cm.dans = null;
    return { ok, d1, seme: !H.ACTION.traque, combat: !!H.ACTION.combat, n: H.ACTION.stats.semes, appr: a.approche }; });
  ok('Fuite : un provocateur vous court après ; une porte et il abandonne', r.ok && r.d1 < 14 && r.seme && !r.combat && r.n >= 1 && !r.appr, JSON.stringify(r));
  r = await ev(p, () => { const H = HDF; H.RAID.etat = 'fouille'; H.EVASION.carte = true; H.ACTION.evasion = null; H.majEvasionChrono(); const e = !!H.ACTION.evasion; const s = H.scientifiques()[1]; s.c.visible = true; s.dedans = null; s.poursuite = 0; s.etat = 'vers_maison'; s.maisons = ['L003']; s.c.pos = [0, 0, 0];
    H.ACTION.evasion.fin = performance.now() - 1; H.majEvasionChrono(); const et = s.etat; const O = []; H.objectifsAction((t, c, u) => O.push(t)); H.RAID.etat = 'aucun'; H.EVASION.carte = false; H.majEvasionChrono(); s.c.visible = false; s.etat = 'fini'; return { e, et, rappel: true, O }; });
  ok('Évasion chronométrée : le train n’attend pas, les blouses sont rappelées', r.e && r.et === 'retour' && r.O.some(t => /Le train repart/.test(t)), JSON.stringify(r));
  r = await ev(p, () => { const H = HDF; H.VIE.flags.combatAppris = 0; H.VIE.flags.entrainements = 0; H.ACTION.dernierEvt = null; const a = ['V08', 'V18', 'V14'].map(id => H.PASSAGERS.liste.find(o => o.p.id === id)).find(o => o && o.maison && !o.mort); if (a) { a.act = 'maison'; a.dedans = null; a.approche = false; a.c.pos = [H.Cm.w.x + 10, 0, H.Cm.w.z]; }
    H.Cm.dans = null; H.HORLOGE.min = 11 * 60; const k = H.lancerEvenementAction(); const V = H.ACTION.venue; let n = 0; while (H.ACTION.venue && n++ < 400) { H.pasSimulation(.1); H.pasAction(.1); } const K = H.ACTION.combat;
    const res = { k, venue: !!V, n, reste: !!H.ACTION.venue, d: a ? +Math.hypot(a.c.pos[0] - H.Cm.w.x, a.c.pos[2] - H.Cm.w.z).toFixed(1) : -1, combat: !!K, entr: K && K.entr }; if (K) { K.hp = 50; H.pasAction(.05); } return Object.assign(res, { appris: !!H.VIE.flags.combatAppris }); });
  await p.waitForTimeout(2600);
  r = Object.assign(r, await ev(p, () => { const H = HDF, K = H.ACTION.combat; const k2 = K ? K.pourquoi : null; if (K && K.entr) { K.hp = 50; H.pasAction(.05); } if (H.ACTION.combat) H.finCombat('fin'); return { k2, appris2: !!HDF.VIE.flags.combatAppris, ent: HDF.VIE.flags.entrainements }; }));
  ok('Metteur en scène : premier moment d’action, Victor apprend à se battre', r.k === 'entrainement' && r.venue && (r.appris || r.appris2), JSON.stringify(r));
  r = await ev(p, () => { const H = HDF; H.HORLOGE.min = 2 * 60; H.TEMPS.dort = false; H.Cm.dans = null; const L = H.vivants().filter(a => a.maison && !a.approche); const a = L[0], cible = H.MAISONS.map(m => m.id).find(id => id !== a.maison && H.rations(id) > 4); const [x, z] = H.INTERIEURS.porteDehors(cible); Object.assign(H.Cm.w, { x: x + 20, z });
    const libre = H.libreAction(), ea = H.enAction(); const ok = H.volEnDirect(a, cible, 2); const ch = !!H.ACTION.chasse; if (ch) H.finChasse('perdu'); return { ok, ch, appr: a.approche, libre, ea, raid: H.RAID.etat }; });
  ok('La nuit, si vous veillez dehors, le vol se joue sous vos yeux', r.ok && r.ch && !r.appr, JSON.stringify(r));
  // ===== 5 sexies. L'équilibre (1.3) : phrases-clés, lettres résumées, scènes jouées, rythme, gestes justes
  r = await ev(p, () => { const H = HDF; H.ACTION.scene = null; document.body.classList.remove('enscene'); const T = 'Dans le bois du vantail gauche, à hauteur d’homme : des encoches au couteau, par rangées de dix-neuf. Six rangées pleines. Une septième commence. La dernière entaille est claire, le bois encore vif. Elle date d’aujourd’hui.';
    H.revelation(T, { titre: 'Acte I', memo: 'encoches' }); const el = document.getElementById('revel'), v = !el.hidden, cle = H.ACTION.revel.cle, lire = !document.getElementById('rvLire').hidden; H.deplierRevel(true); const tout = !document.getElementById('rvTout').hidden && document.getElementById('rvTout').textContent === T; H.fermerRevel();
    const pc = H.phraseCle('RÈGLEMENT DU HAMEAU. 1. Les lumières s’éteignent à vingt-trois heures. 2. On ne quitte pas sa maison la nuit. 3. On ne cherche pas la porte. 4. On partage. 5. On ne cache rien : tout se voit.'); return { v, cle, lire, tout, ferme: el.hidden, pc }; });
  ok('Révélation : une phrase-clé lue, « Lire en entier » déplie le texte complet', r.v && r.cle.length < 100 && r.lire && r.tout && r.ferme, JSON.stringify(r));
  ok('Phrase-clé automatique : jamais un titre en capitales, jamais tronquée au milieu d’un mot', !/^RÈGLEMENT/.test(r.pc) && r.pc.length <= 150 && r.pc.length > 20, r.pc);
  r = await ev(p, () => { const H = HDF; const t = H.TRACES.find(x => !(H.VIE.flags.traces || {})[x.id]) || H.TRACES[0]; if (H.VIE.flags.traces) delete H.VIE.flags.traces[t.id]; H.examinerTrace(t); const res = { v: !document.getElementById('revel').hidden, titre: document.getElementById('rvTitre').textContent, n: (H.ACTION.revel || {}).cle }; H.fermerRevel(); return res; });
  ok('Les traces de ceux d’avant passent par la phrase-clé', r.v && /Trace/.test(r.titre) && r.n, JSON.stringify(r));
  r = await ev(p, () => { const H = HDF, L = H.LETTRES.slice().sort((a, b) => b.texte.join(' ').length - a.texte.join(' ').length)[0]; H.lireLettre(L.id); const el = document.getElementById('lettre'), res = { id: L.id, resume: el.classList.contains('resume'), cle: (document.querySelector('#leCle p') || {}).textContent, cache: getComputedStyle(document.getElementById('leTexte')).display === 'none' };
    H.deplierLettre(); res.deplie = !el.classList.contains('resume') && getComputedStyle(document.getElementById('leTexte')).display !== 'none'; el.hidden = true; return res; });
  ok('Lettre : l’essentiel en une phrase, la lettre entière sur demande', r.resume && r.cle && r.cle.length > 20 && r.cache && r.deplie, JSON.stringify(r));
  r = await ev(p, () => { const H = HDF; H.VIE.flags.scenes = {}; H.HORLOGE.min = 11 * 60; H.Cm.dans = null; for (const id of ['V16', 'V17']) { const a = H.PASSAGERS.liste.find(o => o.p.id === id); if (a && a.maison) { a.act = 'maison'; a.dedans = null; a.approche = false; a.etat = 'attend'; } }
    const i = H.QPAR().m2.e.findIndex(e => e.memo === 'chaussures'); H.memoTrame('m2', i); const f = H.ACTION.sceneFile && H.ACTION.sceneFile.memo; H.ACTION.sceneFile.t = 0; H.pasEquilibre(.1); const S = H.ACTION.scene;
    const res = { f, scene: !!S, bandes: document.body.classList.contains('enscene'), n: S ? S.act.length : 0 }; const vu = []; let k = 0; while (H.ACTION.scene && k++ < 400) { H.pasEquilibre(.25); const st = document.getElementById('sousTitre').textContent; if (st && !vu.includes(st)) vu.push(st.slice(0, 40)); }
    return Object.assign(res, { fini: !H.ACTION.scene, lignes: vu.length, vu: vu.slice(0, 3), libres: S ? S.act.every(a => !a.approche) : false, j: H.ORGA.journal[0] }); });
  ok('Scène jouée : la découverte des chaussures, les habitants arrivent et se répondent', r.f === 'chaussures' && r.scene && r.bandes && r.n >= 2 && r.lignes >= 2, JSON.stringify(r));
  ok('Scène jouée : fin propre, chacun reprend sa journée, la scène est au journal', r.fini && r.libres && /Scène/.test(r.j || ''), JSON.stringify(r));
  r = await ev(p, () => { const H = HDF; H.VIE.flags.scenes = {}; const m = Object.keys(H.SCENES).find(k => k !== 'chaussures' && !H.SCENES[k].nuit && H.SCENES[k].acteurs.filter(id => { const a = H.PASSAGERS.liste.find(o => o.p.id === id); return a && a.maison && !a.mort && !a.parti && !a.enferme; }).length >= 2);
    for (const id of H.SCENES[m].acteurs) { const a = H.PASSAGERS.liste.find(o => o.p.id === id); if (a && a.maison) { a.act = 'maison'; a.dedans = null; a.approche = false; a._act = false; a.etat = 'attend'; } } const ok = H.lancerScene(m); const s1 = !!H.ACTION.scene; H.passerScene(); return { m, ok, s1, fini: !H.ACTION.scene, bandes: document.body.classList.contains('enscene') }; });
  ok('Scène jouée : on peut la passer (Rond)', r.ok && r.s1 && r.fini && !r.bandes, JSON.stringify(r));
  r = await ev(p, () => { const H = HDF; if (H.ACTION.combat) H.finCombat('fin'); H.ACTION.venue = null; H.ACTION.demande = null; H.DIR.appel = null; if (H.ACTION.scene) H.passerScene(); H.ACTION.sceneFile = null; H.fermerRevel(); document.getElementById('choix').hidden = true; document.getElementById('lettre').hidden = true; if (H.DIALOGUE.ouvert) H.fermerDialogue(); H.HORLOGE.min = 11 * 60; H.Cm.dans = null; H.RAID.etat = 'aucun'; H.TEMPS.dort = false; Object.assign(H.Cm.w, { x: H.MAT.x + 4, z: H.MAT.z + 4 }); H.PASSAGERS.liste.filter(o => o.maison && !o.mort && !o.parti).slice(3, 9).forEach((o, i) => { o.dedans = null; o.act = 'maison'; o.etat = 'attend'; o.approche = false; o._act = false; o.c.pos = [H.MAT.x + 20 + i * 4, 0, H.MAT.z + 18]; });   /* en plein jour, du monde dehors */ const Ry = H.ACTION.rythme; Ry.calme = 0; Ry.enAction = false; H.ACTION.evtT = 0; Ry.texte = 80; H.VIE.progres = performance.now();
    const diag = { libre: H.libreAction(), ea: H.enAction(), evtT: H.ACTION.evtT, now: performance.now(), dor: H.TEMPS.dort, occ: !!H.TEMPS.occupe, jeu: H.JEU.actif, ok: Object.keys(H.EVT_ACTION).filter(k => { try { return !!H.EVT_ACTION[k].ok(); } catch (e) { return false; } }), jour: H.VIE.flags.actJour }; const n0 = H.ACTION.evts.length; H.majRythme(.1); const lance = H.ACTION.evts.length > n0, k = H.ACTION.evts[H.ACTION.evts.length - 1];
    if (H.ACTION.chasse) H.finChasse('perdu'); if (H.ACTION.coince) H.finCoince(true); if (H.ACTION.venue) { const a = H.ACTION.venue.a; H.ACTION.venue = null; a.approche = false; a._act = false; } if (H.ACTION.combat) H.finCombat('fin'); H.ACTION.demande = null;
    Ry.enAction = true; H.majRythme(.1); const calme = Ry.calme > performance.now() + 60000; Ry.texte = 200; const n1 = H.ACTION.evts.length; H.majRythme(.1); const pasDeuxFois = H.ACTION.evts.length === n1; return { lance, k, calme, pasDeuxFois, texte: Ry.texte, diag }; });
  ok('Rythme : après un long moment de lecture, un moment d’action', r.lance && !!r.k, JSON.stringify(r));
  ok('Rythme : après l’action, un temps calme (pas d’action à la chaîne)', r.calme && r.pasDeuxFois, JSON.stringify(r));
  r = await ev(p, () => { const H = HDF, a = H.PASSAGERS.liste.find(o => o.maison && !o.mort && !o.approche); a.dedans = null; a.act = 'peche'; a.etat = 'activite'; a.but = { clip: 'Fish_Wait' }; a.vu = true; a.geste = null; a.reprendre = 0; a.peur = 0; const seq = [];
    for (let i = 0; i < 260; i++) { a.vu = true; H.majGestes(.3); const c = a.c.clip; if (seq[seq.length - 1] !== c) seq.push(c); }
    a.dedans = H.FOYERS.joueur; a.poste = { clip: 'Idle' }; a.act = 'vaisselle'; a.etat = 'chez'; a.geste = null; const v = []; for (let i = 0; i < 120; i++) { a.vu = true; H.majGestes(.3); if (!v.includes(a.c.clip)) v.push(a.c.clip); }
    a.act = null; a.dedans = null; a.etat = 'attend'; a.geste = null; return { seq: seq.slice(0, 8), v }; });
  ok('Gestes : la pêche se joue dans l’ordre (lancer, attendre, mouliner)', r.seq.indexOf('Fish_Cast') >= 0 && r.seq.indexOf('Fish_Wait') > r.seq.indexOf('Fish_Cast') && r.seq.indexOf('Fish_Reel') > r.seq.indexOf('Fish_Wait'), r.seq.join(' > '));
  ok('Gestes : la vaisselle, on frotte et on rince (plus seulement « fouetter »)', r.v.includes('Knead_Dough') && r.v.includes('Stir_Bowl'), r.v.join(', '));
  r = await ev(p, () => { const H = HDF, C = H.PASSAGERS.liste[0].c.player.clips; const noms = new Set(Object.values(H.GESTES).flat().map(g => g[0]).concat(['Punch_Jab', 'Punch_Cross', 'Kick', 'Combat_Idle', 'Block', 'Hit_Front', 'Hit_Back', 'Jump_Land', 'Fall_Flat', 'Victory', 'Taunt', 'Clap', 'Run', 'Idle_LookAround', 'Lie_Back', 'Push', 'Crouch_Idle', 'Point', 'Talk', 'Pick_Up']));
    for (const sc of Object.values(H.SCENES)) for (const l of sc.l) noms.add(l[1]); const manque = [...noms].filter(n => !C[n]); return { n: noms.size, manque }; });
  ok('Audit des gestes : chaque clip utilisé (activités, combats, scènes) existe', r.manque.length === 0 && r.n > 30, JSON.stringify(r));
  // ===== 6. Sauvegarde, chargement
  r = await ev(p, () => { const H = HDF; H.fermerDialogue(); const ok = H.sauver(1); sessionStorage.setItem('ref', JSON.stringify({ j: H.HORLOGE.jour, m: Math.floor(H.HORLOGE.min), m1: !!H.VIE.quetes.m1.fini, m2: H.VIE.quetes.m2 ? H.VIE.quetes.m2.etape : -1, mais: H.FOYERS.joueur })); return ok; });
  ok('Sauvegarde dans l’emplacement 1', r === true, String(r));
  await ev(p, () => sessionStorage.setItem('hdf-charger', '1')); await p.reload({ timeout: 240000 }); await p.waitForTimeout(9000);
  r = await ev(p, () => { const H = HDF, ref = JSON.parse(sessionStorage.getItem('ref')); return { ref, now: { j: H.HORLOGE.jour, m: Math.floor(H.HORLOGE.min), m1: !!(H.VIE.quetes.m1 || {}).fini, m2: H.VIE.quetes.m2 ? H.VIE.quetes.m2.etape : -1, mais: H.FOYERS.joueur }, toucher: !document.getElementById('toucher').hidden }; });
  ok('Chargement : trame, horloge et maison restaurées', r.ref && r.now.j === r.ref.j && Math.abs(r.now.m - r.ref.m) < 5 && r.now.m1 === r.ref.m1 && r.now.m2 === r.ref.m2 && r.now.mais === r.ref.mais, JSON.stringify(r));
  ok('Après un rechargement : « Touchez l’écran pour reprendre » (Safari)', r.toucher, '');
  r = await ev(p, () => { document.getElementById('toucher').click(); return { cache: document.getElementById('toucher').hidden, geste: HDF.VOIXP_().geste }; });
  ok('Le toucher débloque le son et les voix', r.cache && r.geste, JSON.stringify(r));
  r = await ev(p, async () => { const H = HDF, a = H.PASSAGERS.liste.find(o => !o.dedans && !o.mort) || H.PASSAGERS.liste[0]; a.connu = true; window.__parle.length = 0; H.ouvrirDialogue(a); await new Promise(f => setTimeout(f, 1500)); const n = window.__parle.length; document.querySelector('#dlChoix button:last-child').click(); return { n, txt: window.__parle[0] }; });
  ok('Voix de synthèse : la réplique est prononcée', r.n >= 1, JSON.stringify(r));
  await p.close();
  // ===== 7. Voix bloquée (pas de démarrage) : le jeu le voit et demande un toucher
  p = await nouvellePage(synth('false'));
  r = await ev(p, async () => { const H = HDF; H.quitterAccueil(); H.finCinematique(); H.VOYAGE.actif = false; document.getElementById('toucher').hidden = true; const a = H.PASSAGERS.liste[0]; a.connu = true; H.parole(a, 'Bonjour, je teste la voix.', document.getElementById('sousTitre'), '', true); await new Promise(f => setTimeout(f, 5200)); return { toucher: !document.getElementById('toucher').hidden, parle: window.__parle.length }; });
  ok('Voix qui ne démarre pas : invite « Touchez l’écran »', r.toucher && r.parle >= 1, JSON.stringify(r));
  await p.close();
  // ===== bilan
  const n = R.filter(x => x.ok).length; ok('Aucune erreur JavaScript pendant tout le banc', erreurs.length === 0, erreurs.slice(0, 3).join(' | '));
  const n2 = R.filter(x => x.ok).length, score = Math.round(n2 / R.length * 100);
  console.log('\nSCORE ' + score + '/100 (' + n2 + ' / ' + R.length + ' tests)'); require('fs').writeFileSync('banc_resultat.json', JSON.stringify({ score, R, erreurs: erreurs.slice(0, 20) }, null, 1));
  await b.close();
})();
