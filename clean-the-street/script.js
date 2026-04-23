const gameArea = document.getElementById("game-area");
const startBtn = document.getElementById("start-btn");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const messageDisplay = document.getElementById("message");

const trashImages = [
  "images/trash1.png",
  "images/trash2.png",
  "images/trash3.png",
  "images/trash4.png"
];

let score = 0;
let timeLeft = 15;
let gameTimer = null;
let gameActive = false;
let totalTrash = 25;

function startGame() {
  clearOldTrash();

  score = 0;
  timeLeft = 15;
  gameActive = true;

  scoreDisplay.textContent = score;
  timerDisplay.textContent = timeLeft;
  messageDisplay.textContent = "";
  messageDisplay.className = "";
  startBtn.disabled = true;

  createTrashItems(totalTrash);

  gameTimer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame(false);
    }
  }, 1000);
}

function createTrashItems(amount) {
  const dumpy = document.getElementById("dumpy");
  const dumpyBox = {
    left: dumpy.offsetLeft,
    right: dumpy.offsetLeft + dumpy.offsetWidth,
    top: dumpy.offsetTop,
    bottom: dumpy.offsetTop + dumpy.offsetHeight
  };

  for (let i = 0; i < amount; i++) {
    const trash = document.createElement("img");
    trash.classList.add("trash-item");

    const randomImage = trashImages[Math.floor(Math.random() * trashImages.length)];
    trash.src = randomImage;
    trash.alt = "Trash item";

    let x;
    let y;
    let tries = 0;

    do {
      x = Math.random() * (gameArea.clientWidth - 90);
      y = Math.random() * (gameArea.clientHeight - 110);
      tries++;
    } while (overlapsDumpy(x, y, 60, 60, dumpyBox) && tries < 100);

    trash.style.left = `${x}px`;
    trash.style.top = `${y}px`;

    trash.addEventListener("click", handleTrashClick);

    gameArea.appendChild(trash);
  }
}

function overlapsDumpy(x, y, width, height, dumpyBox) {
  return !(
    x + width < dumpyBox.left ||
    x > dumpyBox.right ||
    y + height < dumpyBox.top ||
    y > dumpyBox.bottom
  );
}

function handleTrashClick(event) {
  if (!gameActive) return;

  event.target.remove();
  score++;
  scoreDisplay.textContent = score;

  const remainingTrash = document.querySelectorAll(".trash-item").length;

  if (remainingTrash === 0) {
    endGame(true);
  }
}

function endGame(playerWon) {
  gameActive = false;
  clearInterval(gameTimer);
  startBtn.disabled = false;

  if (playerWon) {
    messageDisplay.textContent = `Awesome job. Dumpy helped clean the whole city. Score: ${score}`;
    messageDisplay.className = "message-win";
  } else {
    messageDisplay.textContent = `Time is up. You cleaned ${score} pieces of trash. Try again.`;
    messageDisplay.className = "message-lose";
  }

  const trashItems = document.querySelectorAll(".trash-item");
  trashItems.forEach((item) => {
    item.removeEventListener("click", handleTrashClick);
  });
}

function clearOldTrash() {
  const oldTrash = document.querySelectorAll(".trash-item");
  oldTrash.forEach((item) => item.remove());
  clearInterval(gameTimer);
}

startBtn.addEventListener("click", startGame);