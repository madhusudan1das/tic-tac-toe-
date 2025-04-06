// Theme Toggle
let black = localStorage.getItem("theme") === "black";
document.body.style.backgroundColor = black ? "black" : "white";

document.getElementById("btn1").addEventListener("click", () => {
  black = !black;
  document.body.style.backgroundColor = black ? "black" : "white";
  localStorage.setItem("theme", black ? "black" : "white");
});

// Game Logic
const buttons = document.querySelectorAll("#container button");
const resetButton = document.getElementById("reset");
const ResetButton = document.getElementById("scoreboard1");
const message = document.getElementById("para");
const winCount = document.getElementById("count");

let playerWins = Number(localStorage.getItem("playerWins")) || 0;
let computerWins = Number(localStorage.getItem("computerWins")) || 0;

ResetButton.addEventListener("click", function () {
  playerWins = 0;
  computerWins = 0;

  localStorage.removeItem("playerWins");
  localStorage.removeItem("computerWins");

  updateScore(); // updates the scoreboard text
});


let currentPlayer = "X";
let board = Array(9).fill("");
let gameActive = true;

updateScore();

function updateScore() {
  winCount.textContent = `Player Wins: ${playerWins} | Computer Wins: ${computerWins}`;
}

function checkWinner() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      gameActive = false;
      setTimeout(() => {
        message.innerHTML = `🎉 Player ${board[a]} Wins! 🎉`;
        message.style.color = "aqua";
        if (board[a] === "X") {
          playerWins++;
          localStorage.setItem("playerWins", playerWins);
        } else {
          computerWins++;
          localStorage.setItem("computerWins", computerWins);
        }
        updateScore();
      }, 100);
      return true;
    }
  }

  if (!board.includes("") && gameActive) {
    gameActive = false;
    setTimeout(() => {
      message.innerHTML = "😐 It's a draw!";
      message.style.color = "aqua";
    }, 100);
    return true;
  }

  return false;
}

// Player Move
buttons.forEach((button, index) => {
  button.addEventListener("click", () => {
    if (!board[index] && gameActive && currentPlayer === "X") {
      board[index] = "X";
      button.textContent = "X";
      button.disabled = true;
      if (!checkWinner()) {
        currentPlayer = "O";
        setTimeout(computerMove, 300);
      }
    }
  });
});

// Reset Game
resetButton.addEventListener("click", () => {
  board = Array(9).fill("");
  gameActive = true;
  currentPlayer = "X";
  message.innerHTML = "";
  buttons.forEach(button => {
    button.textContent = "";
    button.disabled = false;
  });
  updateScore();
});

// AI Move - Minimax
function computerMove() {
  if (!gameActive) return;

  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  if (move !== undefined) {
    board[move] = "O";
    buttons[move].textContent = "O";
    buttons[move].disabled = true;
    if (!checkWinner()) {
      currentPlayer = "X";
    }
  }
}

function minimax(newBoard, depth, isMaximizing) {
  const winner = getWinner(newBoard);
  if (winner === "O") return 1;
  if (winner === "X") return -1;
  if (!newBoard.includes("")) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "O";
        let score = minimax(newBoard, depth + 1, false);
        newBoard[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "X";
        let score = minimax(newBoard, depth + 1, true);
        newBoard[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function getWinner(b) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let [a, b1, c] of winPatterns) {
    if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
  }
  return null;
}
