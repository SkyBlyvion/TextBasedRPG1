const output = document.getElementById("output");
const choices = document.getElementById("choices");

// État du joueur
let player = {
  name: "Héros",
  hp: 20,
  defense: 10,
  gold: 10,
  fatigue: 0,
  nourishment: 100,
  appearance: "Normal",
  time: "Day 1, 07:00",
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
  document.getElementById("stat-time").textContent = player.time;
}

// ======================
// Sauvegarde / Chargement
// ======================
function saveGame() {
  localStorage.setItem("rpgSave", JSON.stringify(player));
  write("[Partie sauvegardée]");
}

function loadGame() {
  let save = localStorage.getItem("rpgSave");
  if (save) {
    player = JSON.parse(save);
    updateHUD();
    write("[Partie chargée]");
  } else {
    write("[Aucune sauvegarde trouvée]");
  }
}

function resetGame() {
  localStorage.removeItem("rpgSave");
  player = {
    name: "Héros",
    hp: 20,
    defense: 10,
    gold: 10,
    fatigue: 0,
    nourishment: 100,
    appearance: "Normal",
    time: "Day 1, 07:00",
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
  write("Tu attends un moment...");
  updateHUD();
}

function sleep() {
  player.fatigue = Math.max(0, player.fatigue - 5);
  player.hp = Math.min(20, player.hp + 5);
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
