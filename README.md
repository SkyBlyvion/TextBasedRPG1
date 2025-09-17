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
