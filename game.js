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

function updateDateHUD() {
  const weekday = daysOfWeek[gameTime.weekday];
  const month = months[gameTime.month];
  const h = String(gameTime.hours).padStart(2, "0");
  const m = String(gameTime.minutes).padStart(2, "0");
  
  document.getElementById("stat-time").textContent =
    `${weekday}, ${gameTime.day} ${month}, ${h}:${m}`;
}

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
  archive: [],
  notes: [] // Nouveau : système de notes
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
    archive: [],
    notes: []
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
  else if (type === "notes") {
    renderNotes(content);
  }
  else if (type === "archive") {
    content.innerHTML = "<h2>Archive</h2><ul>" +
      player.archive.map(e => `<li>${e}</li>`).join("") + "</ul>";
  }
  else if (type === "map") {
    const modal = document.getElementById("modal");
    modal.classList.add("map-modal");

    content.innerHTML = `
      <div id="map-container">
        <div id="map-viewport"></div>
      </div>
    `;

    const viewport = document.getElementById("map-viewport");

    // Charger le SVG inline
    fetch("/assets/map.svg")
      .then(res => res.text())
      .then(svg => {
        viewport.innerHTML = svg;
      });

    // Variables de zoom/déplacement
    let scale = 1;
    let posX = 0, posY = 0;
    let isDragging = false;
    let isPanning = false;
    let startX, startY;

    // Zoom molette
    document.getElementById("map-container").addEventListener("wheel", (e) => {
      e.preventDefault();
      const zoomSpeed = 0.1;
      if (e.deltaY < 0) {
        scale = Math.min(scale + zoomSpeed, 5);
      } else {
        scale = Math.max(scale - zoomSpeed, 0.5);
      }
      updateTransform(true);
    });

    // Drag clic gauche
    document.getElementById("map-container").addEventListener("mousedown", (e) => {
      if (e.button === 0) {
        e.preventDefault();
        isDragging = true;
        startX = e.clientX - posX;
        startY = e.clientY - posY;
      }
    });

    window.addEventListener("mouseup", () => isDragging = false);

    window.addEventListener("mousemove", (e) => {
      if (isDragging) {
        posX = e.clientX - startX;
        posY = e.clientY - startY;

        if (!isPanning) {
          isPanning = true;
          requestAnimationFrame(() => {
            updateTransform(false);
            isPanning = false;
          });
        }
      }
    });

    function updateTransform(isZoom = false) {
      viewport.style.transition = isZoom ? "transform 0.1s ease" : "none";
      viewport.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
    }
  }

  else if (type === "settings") {
    content.innerHTML = "<h2>Settings</h2><p>Options à venir...</p>";
  }
}

function closeModal() {
  document.getElementById("modal-overlay").classList.add("hidden");
  document.getElementById("modal").classList.remove("map-modal"); // reset
}

// ======================
// Notes CRUD
// ======================
function renderNotes(container) {
  let html = "<h2>Notes</h2><div>";
  html += `<button onclick="addNote()">Nouvelle note</button>`;
  player.notes.forEach((note, index) => {
    html += `<div class="note-item">
      <textarea rows="2" onchange="editNote(${index}, this.value)">${note}</textarea>
      <button onclick="deleteNote(${index})">X</button>
    </div>`;
  });
  html += "</div>";
  container.innerHTML = html;
}

function addNote() {
  player.notes.push("Nouvelle note");
  openModal("notes");
}

function editNote(index, newValue) {
  player.notes[index] = newValue;
}

function deleteNote(index) {
  player.notes.splice(index, 1);
  openModal("notes");
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
