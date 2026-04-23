const gameArea = document.getElementById("game-area");
const dumpy = document.getElementById("dumpy");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");
const messageDisplay = document.getElementById("message");

const trashImages = [
  "images/can.png",
  "images/bottle.png",
  "images/paper.png",
  "images/trashbag.png"
];

let score = 0;
let timeLeft = 30;
let gameActive = false;
let animationId = null;
let timerInterval = null;

let keys = {
  left: false,
  right: false
};

let dumpyX = 300;
const dumpySpeed = 7;

let fallingItems = [];

function startGame() {
  score = 0;
  timeLeft = 30;
  gameActive = true;
  dumpyX = (gameArea.clientWidth - dumpy.offsetWidth) / 2;
  fallingItems = [];

  scoreDisplay.textContent = score;
  timerDisplay.textContent = timeLeft;
  messageDisplay.textContent = "";
  messageDisplay.className = "";
  startBtn.disabled = true;

  clearFallingItems();
  createStartingItems();

  updateDumpyPosition();

  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);

  gameLoop();
}

function createStartingItems() {
  for (let i = 0; i < 3; i++) {
    spawnFallingItem();
  }
}

function spawnFallingItem() {
  const item = document.createElement("img");
  item.classList.add("falling-item");

  const randomImage = trashImages[Math.floor(Math.random() * trashImages.length)];
  item.src = randomImage;
  item.alt = "Falling trash";

  const x = Math.random() * (gameArea.clientWidth - 60);
  const y = -Math.random() * 250 - 60;
  const speed = Math.random() * 2 + 2.5;

  item.style.left = `${x}px`;
  item.style.top = `${y}px`;

  gameArea.appendChild(item);

  fallingItems.push({
    element: item,
    x: x,
    y: y,
    width: 55,
    height: 55,
    speed: speed
  });
}

function gameLoop() {
  if (!gameActive) return;

  moveDumpy();
  moveFallingItems();
  checkCollisions();

  animationId = requestAnimationFrame(gameLoop);
}

function moveDumpy() {
  if (keys.left) {
    dumpyX -= dumpySpeed;
  }

  if (keys.right) {
    dumpyX += dumpySpeed;
  }

  const maxX = gameArea.clientWidth - dumpy.offsetWidth;

  if (dumpyX < 0) {
    dumpyX = 0;
  }

  if (dumpyX > maxX) {
    dumpyX = maxX;
  }

  updateDumpyPosition();
}

function updateDumpyPosition() {
  dumpy.style.left = `${dumpyX}px`;
}

function moveFallingItems() {
  fallingItems.forEach((itemData) => {
    itemData.y += itemData.speed;
    itemData.element.style.top = `${itemData.y}px`;

    if (itemData.y > gameArea.clientHeight) {
      resetFallingItem(itemData);
    }
  });
}

function resetFallingItem(itemData) {
  itemData.x = Math.random() * (gameArea.clientWidth - 60);
  itemData.y = -Math.random() * 200 - 60;
  itemData.speed = Math.random() * 2 + 2.5;

  const randomImage = trashImages[Math.floor(Math.random() * trashImages.length)];
  itemData.element.src = randomImage;

  itemData.element.style.left = `${itemData.x}px`;
  itemData.element.style.top = `${itemData.y}px`;
}

function checkCollisions() {
  const dumpyRect = {
    left: dumpyX,
    right: dumpyX + dumpy.offsetWidth,
    top: dumpy.offsetTop,
    bottom: dumpy.offsetTop + dumpy.offsetHeight
  };

  fallingItems.forEach((itemData) => {
    const itemRect = {
      left: itemData.x,
      right: itemData.x + itemData.width,
      top: itemData.y,
      bottom: itemData.y + itemData.height
    };

    const isColliding = !(
      dumpyRect.right < itemRect.left ||
      dumpyRect.left > itemRect.right ||
      dumpyRect.bottom < itemRect.top ||
      dumpyRect.top > itemRect.bottom
    );

    if (isColliding) {
      score++;
      scoreDisplay.textContent = score;
      resetFallingItem(itemData);
    }
  });
}

function endGame() {
  gameActive = false;
  startBtn.disabled = false;

  cancelAnimationFrame(animationId);
  clearInterval(timerInterval);

  if (score >= 15) {
    messageDisplay.textContent = `Awesome job. You caught ${score} pieces of trash.`;
    messageDisplay.className = "message-win";
  } else {
    messageDisplay.textContent = `Time is up. You caught ${score} pieces of trash. Try again.`;
    messageDisplay.className = "message-lose";
  }
}

function clearFallingItems() {
  const items = document.querySelectorAll(".falling-item");
  items.forEach((item) => item.remove());
  fallingItems = [];
}

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    keys.left = true;
  }

  if (event.key === "ArrowRight") {
    keys.right = true;
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === "ArrowLeft") {
    keys.left = false;
  }

  if (event.key === "ArrowRight") {
    keys.right = false;
  }
});

startBtn.addEventListener("click", startGame);