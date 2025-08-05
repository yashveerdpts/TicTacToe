const boxes = document.querySelectorAll(".box");
const resetBtn = document.querySelector("#reset-btn");
const newGameBtn = document.querySelector("#newGame-btn");
const msgContainer = document.querySelector(".msg-container");
const msg = document.querySelector("#msg");
const starterSelect = document.querySelector("#starter");
const themeToggle = document.querySelector("#theme-toggle");
const aiToggle = document.querySelector("#ai-toggle");

const symbolX = document.querySelector("#symbolX");
const symbolO = document.querySelector("#symbolO");

const xScore = document.querySelector("#x-score");
const oScore = document.querySelector("#o-score");
const ties = document.querySelector("#ties");

let turnO = true;
let playVsAI = false;
let scores = { X: 0, O: 0, T: 0 };
const playerSymbols = { X: symbolX.value, O: symbolO.value };

const winPatterns = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

const clickSound = new Audio();
clickSound.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQgAAA==";

const choosePlayer = () => {
  turnO = starterSelect.value === "O";
};

starterSelect.addEventListener("change", choosePlayer);
themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark", themeToggle.checked);
});

symbolX.addEventListener("change", () => {
  playerSymbols.X = symbolX.value;
});
symbolO.addEventListener("change", () => {
  playerSymbols.O = symbolO.value;
});

aiToggle.addEventListener("change", () => {
  playVsAI = aiToggle.checked;
});

const resetGame = () => {
  choosePlayer();
  boxes.forEach(box => {
    box.disabled = false;
    box.innerText = "";
    box.classList.remove("win");
  });
  msgContainer.classList.add("hide");
};

const disableBoxes = () => {
  boxes.forEach(box => box.disabled = true);
};

const showWinner = winner => {
  msg.innerText = `🎉 Winner: ${playerSymbols[winner]} 🎉`;
  msgContainer.classList.remove("hide");
  disableBoxes();
  scores[winner]++;
  updateScores();
};

const showTie = () => {
  msg.innerText = `It's a Tie!`;
  msgContainer.classList.remove("hide");
  scores.T++;
  updateScores();
};

const updateScores = () => {
  xScore.innerText = scores.X;
  oScore.innerText = scores.O;
  ties.innerText = scores.T;
};

const checkWinner = () => {
  for (let pattern of winPatterns) {
    let [a,b,c] = pattern;
    if (boxes[a].innerText && boxes[a].innerText === boxes[b].innerText && boxes[b].innerText === boxes[c].innerText) {
      boxes[a].classList.add("win");
      boxes[b].classList.add("win");
      boxes[c].classList.add("win");
      let winner = boxes[a].innerText === playerSymbols.O ? "O" : "X";
      showWinner(winner);
      return true;
    }
  }
  if ([...boxes].every(box => box.innerText !== "")) {
    showTie();
    return true;
  }
  return false;
};

const computerMove = () => {
  const emptyBoxes = [...boxes].filter(box => box.innerText === "");
  if (emptyBoxes.length === 0) return;
  const choice = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
  choice.innerText = playerSymbols.X;
  choice.disabled = true;
  clickSound.play();
  checkWinner();
  turnO = true;
};

boxes.forEach(box => {
  box.addEventListener("click", () => {
    clickSound.play();
    box.innerText = turnO ? playerSymbols.O : playerSymbols.X;
    box.disabled = true;
    if (!checkWinner() && playVsAI && !turnO) {
      setTimeout(computerMove, 500);
    } else {
      turnO = !turnO;
    }
  });
});

newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);

choosePlayer();
