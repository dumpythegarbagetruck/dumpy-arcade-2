const mazeElement = document.getElementById("maze");
const scoreDisplay = document.getElementById("score");
const trashLeftDisplay = document.getElementById("trash-left");
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");
const messageDisplay = document.getElementById("message");

const mazeTemplates = [
  [
    ["W", "W", "W", "W", "W", "W", "W", "W", "W", "W"],
    ["W", "S", "P", "P", "P", "P", "P", "P", "P", "W"],
    ["W", "P", "W", "W", "P", "W", "W", "W", "P", "W"],
    ["W", "P", "P", "W", "P", "P", "P", "W", "P", "W"],
    ["W", "W", "P", "W", "W", "W", "P", "W", "P", "W"],
    ["W", "P", "P", "P", "P", "W", "P", "P", "P", "W"],
    ["W", "P", "W", "W", "P", "W", "W", "W", "P", "W"],
    ["W", "P", "P", "P", "P", "P", "P", "P", "P", "W"],
    ["W", "P", "W", "W", "W", "P", "W", "W", "E", "W"],
    ["W", "W", "W", "W", "W", "W", "W", "W", "W", "W"]
  ],
  [
    ["W", "W", "W", "W", "W", "W", "W", "W", "W", "W"],
    ["W", "S", "P", "W", "P", "P", "P", "P", "P", "W"],
    ["W", "W", "P", "W", "P", "W", "W", "W", "P", "W"],
    ["W", "P", "P", "P", "P", "W", "P", "P", "P", "W"],
    ["W", "P", "W", "W", "P", "W", "P", "W", "W", "W"],
    ["W", "P", "P", "W", "P", "P", "P", "P", "P", "W"],
    ["W", "W", "P", "W", "W", "W", "W", "W", "P", "W"],
    ["W", "P", "P", "P", "P", "P", "P", "W", "P", "W"],
    ["W", "P", "W", "W", "W", "W", "P", "P", "E", "W"],
    ["W", "W", "W", "W", "W", "W", "W", "W", "W", "W"]
  ],
  [
    ["W", "W", "W", "W", "W", "W", "W", "W", "W", "W"],
    ["W", "S", "P", "P", "W", "P", "P", "P", "P", "W"],
    ["W", "W", "W", "P", "W", "P", "W", "W", "P", "W"],
    ["W", "P", "P", "P", "W", "P", "P", "W", "P", "W"],
    ["W", "P", "W", "W", "W", "W", "P", "W", "P", "W"],
    ["W", "P", "P", "P", "P", "W", "P", "P", "P", "W"],
    ["W", "P", "W", "W", "P", "W", "W", "W", "P", "W"],
    ["W", "P", "P", "W", "P", "P", "P", "P", "P", "W"],
    ["W", "W", "P", "P", "P", "W", "W", "W", "E", "W"],
    ["W", "W", "W", "W", "W", "W", "W", "W", "W", "W"]
  ]
];

const trashTypes = ["can", "bottle", "paper", "trashbag"];

let mazeLayout = [];
let playerPosition = { row: 1, col: 1 };
let score = 0;
let trashLeft = 0;
let gameActive = false;

let timeLeft = 15;
let timerInterval = null;

const trashCountPerGame = 7;

function startGame() {
  stopTimer();

  score = 0;
  gameActive = true;
  timeLeft = 15;

  buildRandomMaze();
  playerPosition = findTile("S");

  placeRandomTrash(trashCountPerGame);
  countTrash();

  scoreDisplay.textContent = score;
  trashLeftDisplay.textContent = trashLeft;
  timerDisplay.textContent = timeLeft;
  messageDisplay.textContent = "Collect all the trash, then drive to the exit.";
  messageDisplay.className = "message-info";
  startBtn.disabled = true;

  renderMaze();
  startTimer();
}

function startTimer() {
  timerInterval = setInterval(() => {
    if (!gameActive) return;

    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 10 && trashLeft > 0) {
      messageDisplay.textContent = "Hurry up. Time is running low.";
      messageDisplay.className = "message-lose";
    } else if (timeLeft <= 10 && trashLeft === 0) {
      messageDisplay.textContent = "Quick. Drive to the exit.";
      messageDisplay.className = "message-lose";
    }

    if (timeLeft <= 0) {
      loseGame();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function buildRandomMaze() {
  const randomTemplate =
    mazeTemplates[Math.floor(Math.random() * mazeTemplates.length)];

  mazeLayout = randomTemplate.map((row) => [...row]);
}

function findTile(tileType) {
  for (let row = 0; row < mazeLayout.length; row++) {
    for (let col = 0; col < mazeLayout[row].length; col++) {
      if (mazeLayout[row][col] === tileType) {
        return { row, col };
      }
    }
  }

  return { row: 1, col: 1 };
}

function placeRandomTrash(amount) {
  const openTiles = [];

  for (let row = 0; row < mazeLayout.length; row++) {
    for (let col = 0; col < mazeLayout[row].length; col++) {
      if (mazeLayout[row][col] === "P") {
        openTiles.push({ row, col });
      }
    }
  }

  shuffleArray(openTiles);

  const trashAmount = Math.min(amount, openTiles.length);

  for (let i = 0; i < trashAmount; i++) {
    const tile = openTiles[i];
    mazeLayout[tile.row][tile.col] = "T";
  }
}

function countTrash() {
  trashLeft = 0;

  for (let row = 0; row < mazeLayout.length; row++) {
    for (let col = 0; col < mazeLayout[row].length; col++) {
      if (mazeLayout[row][col] === "T") {
        trashLeft++;
      }
    }
  }
}

function renderMaze() {
  mazeElement.innerHTML = "";
  mazeElement.style.gridTemplateColumns = `repeat(${mazeLayout[0].length}, 56px)`;

  if (window.innerWidth <= 700) {
    mazeElement.style.gridTemplateColumns = `repeat(${mazeLayout[0].length}, 46px)`;
  }

  for (let row = 0; row < mazeLayout.length; row++) {
    for (let col = 0; col < mazeLayout[row].length; col++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");

      const cell = mazeLayout[row][col];

      if (cell === "W") {
        tile.classList.add("wall");
      } else if (cell === "E") {
        tile.classList.add("path", "exit");
      } else {
        tile.classList.add("path");

        if (cell === "T") {
          tile.classList.add("trash");
          tile.classList.add(getTrashTypeForTile(row, col));
        }
      }

      if (playerPosition.row === row && playerPosition.col === col) {
        tile.classList.remove("trash", "can", "bottle", "paper", "trashbag");
        tile.classList.add("dumpy");
      }

      mazeElement.appendChild(tile);
    }
  }
}

function getTrashTypeForTile(row, col) {
  const index = (row * 3 + col) % trashTypes.length;
  return trashTypes[index];
}

function movePlayer(rowChange, colChange) {
  if (!gameActive) return;

  const newRow = playerPosition.row + rowChange;
  const newCol = playerPosition.col + colChange;

  if (
    newRow < 0 ||
    newRow >= mazeLayout.length ||
    newCol < 0 ||
    newCol >= mazeLayout[0].length
  ) {
    return;
  }

  if (mazeLayout[newRow][newCol] === "W") {
    return;
  }

  playerPosition = { row: newRow, col: newCol };

  if (mazeLayout[newRow][newCol] === "T") {
    mazeLayout[newRow][newCol] = "P";
    score++;
    trashLeft--;

    scoreDisplay.textContent = score;
    trashLeftDisplay.textContent = trashLeft;

    if (trashLeft === 0) {
      messageDisplay.textContent = "Great job. Now drive to the exit.";
      messageDisplay.className = "message-info";
    }
  }

  if (mazeLayout[newRow][newCol] === "E" && trashLeft === 0) {
    renderMaze();
    endGame();
    return;
  }

  renderMaze();
}

function endGame() {
  gameActive = false;
  stopTimer();
  startBtn.disabled = false;
  messageDisplay.textContent = `Great job. You cleaned the whole park and made it to the exit with ${score} pieces of trash.`;
  messageDisplay.className = "message-win";
}

function loseGame() {
  gameActive = false;
  stopTimer();
  startBtn.disabled = false;
  messageDisplay.textContent = `Oh no. Time ran out. You collected ${score} pieces of trash. Try again.`;
  messageDisplay.className = "message-lose";
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

document.addEventListener("keydown", (event) => {
  if (!gameActive) return;

  if (event.key === "ArrowUp") {
    event.preventDefault();
    movePlayer(-1, 0);
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    movePlayer(1, 0);
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    movePlayer(0, -1);
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    movePlayer(0, 1);
  }
});

startBtn.addEventListener("click", startGame);