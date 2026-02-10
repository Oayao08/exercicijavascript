// game.js amb imatges

// Elements DOM
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("start-btn");
const scoreEl = document.getElementById("score");
const alertContainer = document.getElementById("alert-container");
const alertText = document.getElementById("alert-text");

// Variables del joc
let gameStarted = false;
let score = 0;
let speed = 2;
let player = { x: canvas.width / 2 - 25, y: canvas.height - 80, width: 50, height: 50 };
let distractions = [];
let keys = { left: false, right: false, space: false };

// Imatges del joc
const imgPlayer = new Image();
imgPlayer.src = "img/personatge_principal.png";

const imgDistrVib = new Image();
imgDistrVib.src = "img/personatge1.png"; // per vibració

const imgDistrPens = new Image();
imgDistrPens.src = "img/personatge2.png"; // per pensament

const backgroundImgs = [
  "img/costat1.png",
  "img/costat2.png",
  "img/costat3.png",
  "img/costat4.png",
  "img/costat5.png"
];

let bgIndex = 0;

// Inicia el joc
startBtn.addEventListener("click", () => {
  gameStarted = true;
  startBtn.style.display = "none";
});

// Genera distraccions
function spawnDistraction() {
  const types = ["vibracion", "pensamiento"];
  const type = types[Math.floor(Math.random() * types.length)];
  distractions.push({
    x: Math.random() * (canvas.width - 40),
    y: -50,
    type: type,
    active: true
  });
}

// Dibuixa fons amb efecte de moviment
function drawBackground() {
  const bg = new Image();
  bg.src = backgroundImgs[bgIndex];
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
  bgIndex++;
  if (bgIndex >= backgroundImgs.length) bgIndex = 0;
}

// Dibuixa jugador
function drawPlayer() {
  ctx.drawImage(imgPlayer, player.x, player.y, player.width, player.height);
}

// Dibuixa distraccions
function drawDistractions() {
  distractions.forEach(d => {
    if (d.type === "vibracion") ctx.drawImage(imgDistrVib, d.x, d.y, 40, 40);
    else ctx.drawImage(imgDistrPens, d.x, d.y, 40, 40);
  });
}

// Actualitza distraccions
function updateDistractions() {
  distractions.forEach(d => {
    if (!d.active) return;
    d.y += speed;

    // Col·lisió amb jugador
    if (
      player.x < d.x + 40 &&
      player.x + player.width > d.x &&
      player.y < d.y + 40 &&
      player.y + player.height > d.y
    ) {
      alertContainer.classList.remove("hidden");
      alertText.textContent = d.type === "vibracion" ? "Vibració del mòbil!" : "Estàs pensant!";
      setTimeout(() => alertContainer.classList.add("hidden"), 1000);
    }
  });

  // Elimina distraccions fora de pantalla
  distractions = distractions.filter(d => d.y < canvas.height + 50);
}

// Moviment jugador
function movePlayer() {
  if (keys.left) player.x -= 5;
  if (keys.right) player.x += 5;
  if (keys.space) speed = 0;
  else speed = 2;
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

// Tecles
document.addEventListener("keydown", e => {
  if (!gameStarted) return;
  if (e.key === "ArrowLeft") keys.left = true;
  if (e.key === "ArrowRight") keys.right = true;
  if (e.key === " ") keys.space = true;

  // Distraccions
  if (e.key.toLowerCase() === "q") {
    score += 10;
    scoreEl.textContent = score;
  }
  if (e.key.toLowerCase() === "t") {
    ctx.filter = "blur(2px)";
    setTimeout(() => ctx.filter = "none", 500);
  }
});

document.addEventListener("keyup", e => {
  if (e.key === "ArrowLeft") keys.left = false;
  if (e.key === "ArrowRight") keys.right = false;
  if (e.key === " ") keys.space = false;
});

// Dibuixa mapa simple
function drawMap() {
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(canvas.width - 150, 10, 140, 100);
  ctx.fillStyle = "white";
  ctx.font = "16px Garamond";
  ctx.fillText("Mapa", canvas.width - 90, 30);
}

// Loop principal
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameStarted) {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100);
    ctx.fillStyle = "white";
    ctx.font = "20px Garamond";
    ctx.fillText("Benvingut al joc!", 100, 100);
    ctx.fillText("Evita distraccions i arriba al final", 100, 140);
    ctx.fillText("Fletxes esquerra/dreta: moure, Espai: frenar", 100, 180);
    ctx.fillText("Q: ignorar distracció, T: interactuar", 100, 220);
    ctx.fillText("Suerte!", 100, 260);
  } else {
    drawBackground();
    movePlayer();
    drawPlayer();
    drawDistractions();
    updateDistractions();
    drawMap();
  }

  requestAnimationFrame(gameLoop);
}

// Generar distraccions cada 3-6 segons
setInterval(() => {
  if (gameStarted) spawnDistraction();
}, Math.random() * 3000 + 3000);

gameLoop();
