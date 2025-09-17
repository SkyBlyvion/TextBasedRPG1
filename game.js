const output = document.getElementById("output");
const choices = document.getElementById("choices");

// ======================
// Configuration du temps
// ======================
const TIME_SCALE = 10; // 1 min IRL = 10 min en jeu

let gameTime = {
  minutes: 0,
  hours: 7,
  day: 1,
  month: 0,
  year: 1,
  weekday: 1 // 0 = Sundas, 1 = Morndas, etc.
};

const daysOfWeek = [
  "Sundas", "Morndas", "Tirdas", "Middas", "Turdas", "Fredas", "Loredas"
];

const months = [
  "Morning Star", "Sun's Dawn", "First Seed", "Rain's Hand",
  "Second Seed", "Mid Year", "Sun's Height", "Last Seed",
  "Hearthfire", "Frost Fall", "Sun's Dusk", "Evening Star"
];

// Avance le temps
function advanceTime(minutesToAdd) {
  gameTime.minutes += minutesToAdd;
  
  while (gameTime.minutes >= 60) {
    gameTime.minutes -= 60;
    gameTime.hours++;
  }
  while (gameTime.hours >= 24) {
    gameTime.hours -= 24;
    gameTime.day++;
    gameTime.weekday = (gameTime.weekday + 1) % 7;
  }
  while (gameTime.day > 30) { // 30 jours par mois
    gameTime.day = 1;
    gameTime.month++;
  }
  while (gameTime.month >= 12) {
    gameTime.month = 0;
    gameTime.year++;
  }

  updateDateHUD();
}

// Affichage dans le HUD
function updateDateHUD() {
  const weekday = daysOfWeek[gameTime.weekday];
  const month = months[gameTime.month];
  const h = String(gameTime.hours).padStart(2, "0");
  const m = String(gameTime.minutes).padStart(2, "0");
  
  document.getElementById("stat-time").textContent =
    `${weekday}, ${gameTime.day} ${month}, ${h}:${m}`;
}

// Avance automatiquement le temps (1 min IRL)
setInterval(() => {
  advanceTime(TIME_SCALE);
}, 60000);

// ======================
// État du joueur
// ======================
let player = {
  name: "Héros",
  hp: 20,
  defense: 10,
  gold: 10,
  fatigue: 0,
  nourishment: 100,
  appearance: "Normal",
  inventory: ["Épée"],
  journal: [],
  archive: []
};

// ======================
// Fonctions HUD & Stats
// ======================
function write(text) {
  output.innerHTML += text + "\n";
  output.scrollTop = output.scrollHeight;
  player.archive.push(text);
}

function updateHUD() {
  document.getElementById("stat-name").textContent = player.name;
  document.getElementById("stat-hp").textContent = player.hp;
  document.getElementById("stat-defense").textContent = player.defense;
  document.getElementById("stat-gold").textContent = player.gold;
  document.getElementById("stat-fatigue").textContent = player.fatigue;
  document.getElementById("stat-nourishment").textContent = player.nourishment;
  document.getElementById("stat-appearance").textContent = player.appearance;
  updateDateHUD();
}

// ======================
// Sauvegarde / Chargement
// ======================
function saveGame() {
  const saveData = {
    player: player,
    gameTime: gameTime
  };
  localStorage.setItem("rpgSave", JSON.stringify(saveData));
  write("[Partie sauvegardée]");
}

function loadGame() {
  let save = localStorage.getItem("rpgSave");
  if (save) {
    const saveData = JSON.parse(save);
    player = saveData.player;
    gameTime = saveData.gameTime;
    updateHUD();
    write("[Partie chargée]");
  } else {
    write("[Aucune sauvegarde trouvée]");
  }
}

function resetGame() {
  localStorage.removeItem("rpgSave");
  gameTime = {
    minutes: 0,
    hours: 7,
    day: 1,
    month: 0,
    year: 1,
    weekday: 1
  };
  player = {
    name: "Héros",
    hp: 20,
    defense: 10,
    gold: 10,
    fatigue: 0,
    nourishment: 100,
    appearance: "Normal",
    inventory: ["Épée"],
    journal: [],
    archive: []
  };
  updateHUD();
  write("[Nouvelle partie]");
}

// ======================
// Modales
// ======================
function openModal(type) {
  const overlay = document.getElementById("modal-overlay");
  const content = document.getElementById("modal-content");
  overlay.classList.remove("hidden");

  if (type === "character") {
    content.innerHTML = `<h2>Character</h2>
      <p>Nom: ${player.name}</p>
      <p>HP: ${player.hp}</p>
      <p>Défense: ${player.defense}%</p>
      <p>Apparence: ${player.appearance}</p>`;
  }
  else if (type === "inventory") {
    content.innerHTML = "<h2>Inventory</h2><ul>" +
      player.inventory.map(i => `<li>${i}</li>`).join("") + "</ul>";
  }
  else if (type === "journal") {
    content.innerHTML = "<h2>Journal</h2><ul>" +
      player.journal.map(e => `<li>${e}</li>`).join("") + "</ul>";
  }
  else if (type === "archive") {
    content.innerHTML = "<h2>Archive</h2><ul>" +
      player.archive.map(e => `<li>${e}</li>`).join("") + "</ul>";
  }
  else if (type === "map") {
    content.innerHTML = "<h2>Map</h2><p>[Carte du monde ici]</p>";
  }
  else if (type === "settings") {
    content.innerHTML = "<h2>Settings</h2><p>Options à venir...</p>";
  }
}

function closeModal() {
  document.getElementById("modal-overlay").classList.add("hidden");
}

// ======================
// Fermeture modale via ESC et clic extérieur
// ======================
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const overlay = document.getElementById("modal-overlay");
    if (!overlay.classList.contains("hidden")) {
      closeModal();
    }
  }
});

document.getElementById("modal-overlay").addEventListener("click", (e) => {
  if (e.target.id === "modal-overlay") {
    closeModal();
  }
});

// ======================
// Actions (Wait / Sleep)
// ======================
function wait() {
  player.fatigue += 1;
  advanceTime(60); // attendre = 1h en jeu
  write("Tu attends un moment...");
  updateHUD();
}

function sleep() {
  player.fatigue = Math.max(0, player.fatigue - 5);
  player.hp = Math.min(20, player.hp + 5);
  advanceTime(480); // dormir = 8h en jeu
  write("Tu dors et récupères un peu d'énergie.");
  updateHUD();
}

// ======================
// Choix interactifs
// ======================
function showChoices(options) {
  choices.innerHTML = "";
  options.forEach(opt => {
    let btn = document.createElement("button");
    btn.textContent = opt.text;
    btn.onclick = opt.action;
    choices.appendChild(btn);
  });
}

// ======================
// Initialisation
// ======================
write("Bienvenue dans le RPG textuel !");
showChoices([
  { text: "Regarder autour", action: () => write("Tu vois une forêt sombre...") },
  { text: "Avancer au nord", action: () => write("Tu rencontres un gobelin !") },
]);

updateHUD();
