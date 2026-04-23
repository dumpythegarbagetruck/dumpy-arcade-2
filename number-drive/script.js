const scoreDisplay = document.getElementById("score");
const roundDisplay = document.getElementById("round");
const questionText = document.getElementById("question-text");
const startBtn = document.getElementById("start-btn");
const messageDisplay = document.getElementById("message");
const dumpy = document.getElementById("dumpy");
const answerBoxes = [
  document.getElementById("answer-0"),
  document.getElementById("answer-1"),
  document.getElementById("answer-2")
];

let score = 0;
let currentRound = 0;
let totalRounds = 10;
let currentLane = 1;
let correctLane = 0;
let correctAnswer = 0;
let gameActive = false;
let acceptingInput = false;

const lanePositions = ["16.66%", "50%", "83.33%"];

function startGame() {
  score = 0;
  currentRound = 0;
  currentLane = 1;
  gameActive = true;
  acceptingInput = false;

  scoreDisplay.textContent = score;
  roundDisplay.textContent = currentRound;
  messageDisplay.textContent = "";
  messageDisplay.className = "";
  startBtn.disabled = true;

  updateDumpyPosition();
  nextRound();
}

function nextRound() {
  clearAnswerStyles();

  if (currentRound >= totalRounds) {
    endGame();
    return;
  }

  currentRound++;
  roundDisplay.textContent = currentRound;
  messageDisplay.textContent = "Drive into the lane with the correct answer.";
  messageDisplay.className = "";

  const question = generateQuestion();
  questionText.textContent = question.text;
  correctAnswer = question.answer;

  const answers = generateAnswerChoices(correctAnswer);
  correctLane = answers.indexOf(correctAnswer);

  answers.forEach((value, index) => {
    answerBoxes[index].textContent = value;
  });

  currentLane = 1;
  updateDumpyPosition();
  acceptingInput = true;
}

function generateQuestion() {
  const first = randomNumber(1, 5);
  const second = randomNumber(1, 5);
  return {
    text: `${first} + ${second} = ?`,
    answer: first + second
  };
}

function generateAnswerChoices(correct) {
  const choices = [correct];

  while (choices.length < 3) {
    const offset = randomNumber(-3, 3);
    const wrongAnswer = correct + offset;

    if (
      wrongAnswer > 0 &&
      !choices.includes(wrongAnswer)
    ) {
      choices.push(wrongAnswer);
    }
  }

  return shuffleArray(choices);
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(array) {
  const newArray = [...array];

  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }

  return newArray;
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

  if (currentLane === correctLane) {
    score++;
    scoreDisplay.textContent = score;
    messageDisplay.textContent = `Great job. ${correctAnswer} is correct.`;
    messageDisplay.className = "message-correct";
    answerBoxes[currentLane].classList.add("correct-highlight");
  } else {
    messageDisplay.textContent = `Oops. The correct answer was ${correctAnswer}.`;
    messageDisplay.className = "message-wrong";
    answerBoxes[currentLane].classList.add("wrong-highlight");
    answerBoxes[correctLane].classList.add("correct-highlight");
  }

  setTimeout(() => {
    if (gameActive) {
      nextRound();
    }
  }, 1200);
}

function clearAnswerStyles() {
  answerBoxes.forEach((box) => {
    box.classList.remove("correct-highlight", "wrong-highlight");
  });
}

function endGame() {
  gameActive = false;
  acceptingInput = false;
  startBtn.disabled = false;

  if (score === totalRounds) {
    questionText.textContent = "You did it!";
    messageDisplay.textContent = `Amazing job. You got all ${score} answers right.`;
    messageDisplay.className = "message-win";
  } else {
    questionText.textContent = "Game Over";
    messageDisplay.textContent = `Nice try. You scored ${score} out of ${totalRounds}.`;
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