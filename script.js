const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');
const pvpButton = document.getElementById('mode-pvp');
const pvcButton = document.getElementById('mode-pvc');
const currentPlayerDisplay = document.querySelector('#current-player span');
const xWinsDisplay = document.getElementById('x-wins');
const oWinsDisplay = document.getElementById('o-wins');
const drawsDisplay = document.getElementById('draws');
let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameActive = true;
let isPvPMode = true;
let xWins = 0;
let oWins = 0;
let draws = 0;

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function handleCellClick(e) {
  const index = e.target.dataset.index;

  if (board[index] !== null || !gameActive) return;

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;  // This line ensures that 'X' or 'O' is shown in the clicked cell

  checkWinner();
  if (gameActive && isPvPMode === false && currentPlayer === 'O') {
      computerMove();
  } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      updateCurrentPlayerDisplay();
  }
}


function computerMove() {
    let bestMove = minimax(board, 'O').index;
    board[bestMove] = 'O';
    cells[bestMove].textContent = 'O';
    checkWinner();
    currentPlayer = 'X';
    updateCurrentPlayerDisplay();
}

function checkWinner() {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameActive = false;
            highlightWinner([a, b, c]);
            updateScore(currentPlayer);
            return;
        }
    }

    if (!board.includes(null)) {
        gameActive = false;
        draws++;
        drawsDisplay.textContent = draws;
        alert("It's a draw!");
    }
}

function highlightWinner(winningCells) {
    winningCells.forEach(index => cells[index].style.backgroundColor = '#4CAF50');
    alert(`${currentPlayer} wins!`);
}

function updateScore(player) {
    if (player === 'X') {
        xWins++;
        xWinsDisplay.textContent = xWins;
    } else {
        oWins++;
        oWinsDisplay.textContent = oWins;
    }
}

function updateCurrentPlayerDisplay() {
    currentPlayerDisplay.textContent = currentPlayer;
}

function resetGame() {
    board = Array(9).fill(null);
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.backgroundColor = '#fff';
    });
    currentPlayer = 'X';
    gameActive = true;
    updateCurrentPlayerDisplay();
}

pvpButton.addEventListener('click', () => {
    isPvPMode = true;
    resetGame();
});

pvcButton.addEventListener('click', () => {
    isPvPMode = false;
    resetGame();
});

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);

// Minimax algorithm for AI
function minimax(newBoard, player) {
    const availableCells = newBoard.map((val, index) => val === null ? index : null).filter(val => val !== null);

    // Check terminal state
    let winner = getWinner(newBoard);
    if (winner === 'X') return { score: -10 };
    if (winner === 'O') return { score: 10 };
    if (availableCells.length === 0) return { score: 0 };

    let moves = [];
    for (let i = 0; i < availableCells.length; i++) {
        let move = {};
        move.index = availableCells[i];
        newBoard[availableCells[i]] = player;

        if (player === 'O') {
            let result = minimax(newBoard, 'X');
            move.score = result.score;
        } else {
            let result = minimax(newBoard, 'O');
            move.score = result.score;
        }

        newBoard[availableCells[i]] = null;
        moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function getWinner(board) {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}
