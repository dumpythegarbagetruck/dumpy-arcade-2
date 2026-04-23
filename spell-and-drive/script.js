const scoreDisplay = document.getElementById("score");
const roundDisplay = document.getElementById("round");
const targetWordDisplay = document.getElementById("target-word");
const wordProgressDisplay = document.getElementById("word-progress");
const startBtn = document.getElementById("start-btn");
const messageDisplay = document.getElementById("message");
const dumpy = document.getElementById("dumpy");
const letterBoxes = [
  document.getElementById("letter-0"),
  document.getElementById("letter-1"),
  document.getElementById("letter-2")
];

const words = [
  "CAN", "BAG", "BIN", "BUS", "MAP", "SUN",
  "HAT", "CAT", "DOG", "CAR", "BOX", "BED",
  "CUP", "PEN", "FOX", "RED", "RUN", "HOP",
  "BAT", "LOG", "TOP", "JAR", "KEY", "TOY",
  "BOTTLE", "PAPER", "TRASH", "CLEAN", "GREEN"
];

let shuffledWords = [];
let wordIndex = 0;

let score = 0;
let currentRound = 0;
let totalRounds = 5;
let currentLane = 1;
let correctLane = 0;
let currentWord = "";
let currentLetterIndex = 0;
let builtLetters = [];
let gameActive = false;
let acceptingInput = false;

const lanePositions = ["16.66%", "50%", "83.33%"];

function startGame() {
  score = 0;
  currentRound = 0;
  currentLane = 1;
  gameActive = true;
  acceptingInput = false;

  shuffleWords();

  scoreDisplay.textContent = score;
  roundDisplay.textContent = currentRound;
  messageDisplay.textContent = "";
  messageDisplay.className = "";
  startBtn.disabled = true;

  updateDumpyPosition();
  nextRound();
}

function shuffleWords() {
  shuffledWords = [...words];

  for (let i = shuffledWords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledWords[i], shuffledWords[j]] = [shuffledWords[j], shuffledWords[i]];
  }

  wordIndex = 0;
}

function nextRound() {
  clearLetterStyles();

  if (currentRound >= totalRounds) {
    endGame();
    return;
  }

  currentRound++;
  roundDisplay.textContent = currentRound;

  if (wordIndex >= shuffledWords.length) {
    shuffleWords();
  }

  currentWord = shuffledWords[wordIndex];
  wordIndex++;

  currentLetterIndex = 0;
  builtLetters = [];

  targetWordDisplay.textContent = currentWord;
  updateWordProgress();

  messageDisplay.textContent = "Drive into the correct next letter.";
  messageDisplay.className = "";

  currentLane = 1;
  updateDumpyPosition();
  loadLetterChoices();
}

function loadLetterChoices() {
  clearLetterStyles();

  const correctLetter = currentWord[currentLetterIndex];
  const choices = generateLetterChoices(correctLetter);
  correctLane = choices.indexOf(correctLetter);

  choices.forEach((letter, index) => {
    letterBoxes[index].textContent = letter;
  });

  acceptingInput = true;
}

function generateLetterChoices(correctLetter) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const choices = [correctLetter];

  while (choices.length < 3) {
    const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];

    if (!choices.includes(randomLetter)) {
      choices.push(randomLetter);
    }
  }

  return shuffleArray(choices);
}

function shuffleArray(array) {
  const newArray = [...array];

  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }

  return newArray;
}

function updateWordProgress() {
  const display = currentWord
    .split("")
    .map((letter, index) => (index < builtLetters.length ? letter : "_"))
    .join(" ");

  wordProgressDisplay.textContent = display;
}

function updateDumpyPosition() {
  dumpy.style.left = lanePositions[currentLane];
}

function moveLeft() {
  if (!gameActive || !acceptingInput) return;

  if (currentLane > 0) {
    currentLane--;
    updateDumpyPosition();
  }
}

function moveRight() {
  if (!gameActive || !acceptingInput) return;

  if (currentLane < 2) {
    currentLane++;
    updateDumpyPosition();
  }
}

function chooseLane() {
  if (!gameActive || !acceptingInput) return;

  acceptingInput = false;
  const chosenLetter = letterBoxes[currentLane].textContent;
  const correctLetter = currentWord[currentLetterIndex];

  if (currentLane === correctLane) {
    builtLetters.push(correctLetter);
    updateWordProgress();
    letterBoxes[currentLane].classList.add("correct-highlight");

    if (builtLetters.length === currentWord.length) {
      score++;
      scoreDisplay.textContent = score;
      messageDisplay.textContent = `Great job. You spelled ${currentWord}.`;
      messageDisplay.className = "message-correct";

      setTimeout(() => {
        if (gameActive) {
          nextRound();
        }
      }, 1200);
    } else {
      messageDisplay.textContent = `Nice. ${chosenLetter} is correct.`;
      messageDisplay.className = "message-correct";
      currentLetterIndex++;

      setTimeout(() => {
        if (gameActive) {
          currentLane = 1;
          updateDumpyPosition();
          loadLetterChoices();
        }
      }, 900);
    }
  } else {
    letterBoxes[currentLane].classList.add("wrong-highlight");
    letterBoxes[correctLane].classList.add("correct-highlight");

    messageDisplay.textContent = `Oops. The next letter is ${correctLetter}.`;
    messageDisplay.className = "message-wrong";

    setTimeout(() => {
      if (gameActive) {
        currentLane = 1;
        updateDumpyPosition();
        loadLetterChoices();
      }
    }, 1000);
  }
}

function clearLetterStyles() {
  letterBoxes.forEach((box) => {
    box.classList.remove("correct-highlight", "wrong-highlight");
  });
}

function endGame() {
  gameActive = false;
  acceptingInput = false;
  startBtn.disabled = false;

  if (score === totalRounds) {
    targetWordDisplay.textContent = "You Did It!";
    wordProgressDisplay.textContent = "W O W";
    messageDisplay.textContent = `Amazing job. You spelled all ${score} words correctly.`;
    messageDisplay.className = "message-win";
  } else {
    targetWordDisplay.textContent = "Game Over";
    wordProgressDisplay.textContent = "_ _ _";
    messageDisplay.textContent = `Nice try. You completed ${score} out of ${totalRounds} words.`;
    messageDisplay.className = "message-lose";
  }
}

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    moveLeft();
  }

  if (event.key === "ArrowRight") {
    moveRight();
  }

  if (event.key === "ArrowUp" || event.key === " " || event.key === "Enter") {
    event.preventDefault();
    chooseLane();
  }
});

startBtn.addEventListener("click", startGame);