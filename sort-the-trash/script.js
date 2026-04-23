const scoreDisplay = document.getElementById("score");
const roundDisplay = document.getElementById("round");
const currentItemDisplay = document.getElementById("current-item");
const startBtn = document.getElementById("start-btn");
const messageDisplay = document.getElementById("message");
const binButtons = document.querySelectorAll(".bin-btn");

const items = [
  { src: "images/can.png", type: "recycling", name: "Soda can" },
  { src: "images/bottle.png", type: "recycling", name: "Plastic bottle" },
  { src: "images/paper.png", type: "recycling", name: "Paper" },
  { src: "images/trashbag.png", type: "trash", name: "Trash bag" }
];

let score = 0;
let currentRound = 0;
let totalRounds = 10;
let currentItem = null;
let gameActive = false;

function startGame() {
  score = 0;
  currentRound = 0;
  gameActive = true;

  scoreDisplay.textContent = score;
  roundDisplay.textContent = currentRound;
  messageDisplay.textContent = "";
  messageDisplay.className = "";
  startBtn.disabled = true;

  showNextItem();
}

function showNextItem() {
  if (currentRound >= totalRounds) {
    endGame();
    return;
  }

  currentRound++;
  roundDisplay.textContent = currentRound;

  currentItem = items[Math.floor(Math.random() * items.length)];
  currentItemDisplay.src = currentItem.src;
  currentItemDisplay.alt = currentItem.name;
  currentItemDisplay.style.display = "block";

  messageDisplay.textContent = "Pick the correct bin.";
  messageDisplay.className = "";
}

function handleBinClick(event) {
  if (!gameActive || !currentItem) return;

  const chosenBin = event.currentTarget.dataset.bin;

  if (chosenBin === currentItem.type) {
    score++;
    scoreDisplay.textContent = score;
    messageDisplay.textContent = `Great job. ${currentItem.name} goes in ${chosenBin}.`;
    messageDisplay.className = "message-correct";
  } else {
    messageDisplay.textContent = `Oops. ${currentItem.name} goes in ${currentItem.type}.`;
    messageDisplay.className = "message-wrong";
  }

  currentItem = null;

  setTimeout(() => {
    if (gameActive) {
      showNextItem();
    }
  }, 1000);
}

function endGame() {
  gameActive = false;
  currentItem = null;
  currentItemDisplay.style.display = "none";
  startBtn.disabled = false;

  if (score === totalRounds) {
    messageDisplay.textContent = `Amazing job. You got all ${score} right.`;
    messageDisplay.className = "message-win";
  } else {
    messageDisplay.textContent = `Game over. You scored ${score} out of ${totalRounds}.`;
    messageDisplay.className = "message-lose";
  }
}

startBtn.addEventListener("click", startGame);

binButtons.forEach((button) => {
  button.addEventListener("click", handleBinClick);
});