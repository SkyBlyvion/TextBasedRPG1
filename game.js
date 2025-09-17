const output = document.getElementById("output");
const choices = document.getElementById("choices");
const inventoryList = document.getElementById("inventory-list");

let player = {
  name: "Héros",
  hp: 20,
  gold: 10,
  inventory: ["Épée"],
};

function write(text) {
  output.innerHTML += text + "\n";
  output.scrollTop = output.scrollHeight;
}

function updateHUD() {
  document.getElementById("stat-name").textContent = player.name;
  document.getElementById("stat-hp").textContent = player.hp;
  document.getElementById("stat-gold").textContent = player.gold;

  inventoryList.innerHTML = "";
  player.inventory.forEach(item => {
    let li = document.createElement("li");
    li.textContent = item;
    inventoryList.appendChild(li);
  });
}

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
  player = { name: "Héros", hp: 20, gold: 10, inventory: ["Épée"] };
  updateHUD();
  write("[Nouvelle partie]");
}

function showChoices(options) {
  choices.innerHTML = "";
  options.forEach(opt => {
    let btn = document.createElement("button");
    btn.textContent = opt.text;
    btn.onclick = opt.action;
    choices.appendChild(btn);
  });
}

// Démo
write("Bienvenue dans le RPG textuel !");
showChoices([
  { text: "Regarder autour", action: () => write("Tu vois une forêt sombre...") },
  { text: "Avancer au nord", action: () => write("Tu rencontres un gobelin !") },
]);

updateHUD();
