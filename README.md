# Text-Based RPG (HTML/CSS/JS)

## Présentation

Ce projet est un **RPG textuel en HTML, CSS et JavaScript**, pensé pour fonctionner directement dans le navigateur.  
Le joueur évolue dans une aventure narrative où il fait des choix qui influencent son personnage, son inventaire, et le déroulement de l’histoire.

L’interface est conçue avec un **HUD en trois colonnes** :

- **Gauche :** zone illustration (images ou placeholders).  
- **Milieu :** zone narrative avec texte et choix interactifs (boutons).  
- **Droite :**
  - **Haut :** boutons ouvrant différentes modales (*Character, Inventory, Settings, Journal, Archive, Map, Wait, Sleep, Save, Load*).  
  - **Bas :** encart HUD détaillant les stats du personnage (*heure, vie, défense, fatigue, nourishment, apparence/charisme*).  

---

## Structure du projet
```
/rpg-text-based
│── index.html        → Structure HTML principale
│── style.css         → Styles et HUD
│── game.js           → Logique du jeu (narration, choix, stats, inventaire)
│── assets/           → Illustrations, icônes, polices
│── saves/ (optionnel)→ Export/import manuels de sauvegardes
│── README.md         → Présentation + Cahier des charges
```

---

# 📑 Cahier des Charges (CDC)

## 1. Contexte
Le projet vise à développer un **jeu narratif textuel moderne et accessible** dans un navigateur, inspiré des RPG classiques mais présenté sous une interface claire et immersive.

## 2. Objectifs
- Créer une expérience RPG narrative jouable en ligne.  
- Permettre une gestion complète du personnage (stats, inventaire, journal).  
- Offrir un système de **sauvegarde/chargement** local via `localStorage`.  
- Développer un HUD intuitif reprenant les codes des jeux de rôle mais adapté au **text-based**.  

## 3. Fonctionnalités principales

### Interface (HUD)
- **Zone gauche :** illustration (placeholder ou image générée).  
- **Zone centrale :** narration avec texte dynamique + choix interactifs (boutons).  
- **Zone droite :**
  - **Haut :**  
    - Boutons ouvrant des modales :  
      - Character (stats détaillées)  
      - Inventory (objets, équipement)  
      - Settings (volume, affichage, etc.)  
      - Journal (notes automatiques, quêtes en cours)  
      - Archive (anciens textes, dialogues passés)  
      - Map (affiche la carte du monde)  
      - Wait (attente dans le temps du jeu)  
      - Sleep (repos, récupération de fatigue/HP)  
    - Boutons **Save** et **Load** (sauvegarde/chargement via `localStorage`).  
  - **Bas :** Encart HUD avec :  
    - Heure du jeu  
    - Vie (HP)  
    - Défense (% armure)  
    - Gold
    - Fatigue (endurance)  
    - Nourishment (faim/satiété)  
    - Appearance (charisme/présentation)  

### Système de jeu
- Narration interactive via choix multiples.  
- Gestion des stats du personnage.  
- Inventaire dynamique.  
- Sauvegarde/chargement en local. 
- Ajout systéme date & Heure basée sur Elder Scrolls.
- Ajout fonctionnalité : Notes
### Modales
- ajout de modales pour [Character, Inventory, Journal, Archive, Map, Settings] 

---

## 4. Contraintes techniques
- **Technologies :** HTML5, CSS3, JavaScript (ES6).  
- **Compatibilité :** navigateurs modernes (Chrome, Firefox, Edge).  
- **Aucun framework imposé**, mais possibilité d’ajouter *TailwindCSS* ou *Bootstrap* si besoin.  
- **Modularité :** chaque fonctionnalité (combat, inventaire, journal) doit être isolée en fonctions/classes pour évoluer facilement.  

---

## 5. Livrables
- Code source complet (HTML, CSS, JS).  
- README technique (installation, utilisation).  
- Version jouable dans navigateur (`index.html`).  
- Documentation technique (commentaires, structure du code).  

---

## 6. Évolutions prévues
- Ajout d’un **système de combat** (HP, défense, loot).  
- Gestion de l’**aléatoire** (rencontres, événements).  
- Export/import de sauvegardes via fichiers JSON.  
- Intégration de **visuels générés par IA** pour illustrer les scènes.  





A implémenter : 

- Menu principal avec New Game / Load Game / Options.

- 20 saves manuelles max (slots réutilisables) + 2 autosaves qui écrasent.

- Narration indexée (chaque choix/scène a un ID).

- Sauvegarde = juste l’ID courant + état du joueur.

- Chargement = on relance showScene(ID).


1. Écran Menu principal

À l’ouverture du jeu, avant même d’afficher le HUD :

New Game → réinitialise le joueur et démarre directement.

Load Game → ouvre une liste (modale ou menu) avec les sauvegardes disponibles :

jusqu’à 20 manuelles (nommées par le joueur ou datées automatiquement)

2 autosaves (écrasées toutes les 10 et 30 min).

Options → paramètres de jeu (on pourra y gérer la vitesse du temps, volume, affichage…).

Techniquement, tu peux :

masquer ton #game-container par défaut,

afficher un #menu-screen,

puis afficher le jeu quand on clique New Game ou qu’on charge une save.

2. Système de sauvegardes
🔹 Organisation

Autosaves :

autosave_10 (remplacée toutes les 10 min)

autosave_30 (remplacée toutes les 30 min)

Manuelles :

manual_0 → manual_19 (20 slots max)

si le joueur veut en créer une de plus : soit il choisit le slot à écraser, soit tu empêches.

Toutes stockées dans localStorage sous forme JSON.
Un petit index JSON peut lister les saves existantes pour remplir ton menu Load Game.

Exemple :

{
  "manual_saves": ["manual_0", "manual_1"],
  "autosaves": ["autosave_10", "autosave_30"]
}

3. Enregistrement de la progression narrative (showChoices)

Tu as raison : sauvegarder tout le texte affiché n’a pas de sens → ça prend de la place.
Le mieux est de gérer la narration par index ou ID :

🔹 Exemple concret
// Table des scènes
const scenes = {
  0: { text: "Bienvenue dans le RPG textuel !", choices: [1, 2] },
  1: { text: "Tu vois une forêt sombre...", choices: [3] },
  2: { text: "Tu rencontres un gobelin !", choices: [] },
  3: { text: "La forêt devient plus dense...", choices: [] }
};

// État du joueur
let player = {
  currentScene: 0,
  // ... autres stats
};

🔹 Fonction d’affichage
function showScene(sceneId) {
  const scene = scenes[sceneId];
  player.currentScene = sceneId;

  write(scene.text);
  showChoices(scene.choices.map(id => ({
    text: scenes[id].text.substring(0, 30) + "...", // exemple
    action: () => showScene(id)
  })));
}

systéme de voyage entre chaque poi utilisant une certaine durée en fonction de la distance a parcourir
