// src/ui.ts

import { WordleGame, GameMode, GameStats } from "./wordleGame";
import { LetterResult } from "./gameLogic";
import { getValidWords } from "./dictionary";

// Returns a random word from our dictionary (assumed 5-letter words)
function chooseRandomWord(wordLength: number = 5): string {
    const validWords = getValidWords(wordLength);
    return validWords[Math.floor(Math.random() * validWords.length)];
}

// Global game statistics (cumulative across games, except Practice mode)
const globalStats: GameStats = {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    averageAttempts: 0,
};

// Global game variable
let game = new WordleGame(chooseRandomWord(5), 6, GameMode.Classic, globalStats);

// DOM Elements
/*
const solutionWordDiv = document.getElementById("solution-word") as HTMLDivElement;
*/

function getBoard(): HTMLDivElement {
    const board = document.getElementById("board");
    if (!board) {
        throw new Error("Element #board not found");
    }
    return board as HTMLDivElement;
}

function getRestartBtn(): HTMLButtonElement {
    const btn = document.getElementById("restartBtn");
    if (!btn) {
        throw new Error("Element #restartBtn not found");
    }
    return btn as HTMLButtonElement;
}

// Idem pour les autres éléments utilisés dans UI (messageDiv, errorMessageDiv, statsDiv, timerDiv, modeSelect, etc.)
function getMessageDiv(): HTMLDivElement {
    const div = document.getElementById("message");
    if (!div) throw new Error("Element #message not found");
    return div as HTMLDivElement;
}

function getErrorMessageDiv(): HTMLDivElement {
    const div = document.getElementById("error-message");
    if (!div) throw new Error("Element #error-message not found");
    return div as HTMLDivElement;
}

function getStatsDiv(): HTMLDivElement {
    const div = document.getElementById("stats");
    if (!div) throw new Error("Element #stats not found");
    return div as HTMLDivElement;
}

function getTimerDiv(): HTMLDivElement {
    const div = document.getElementById("timer");
    if (!div) throw new Error("Element #timer not found");
    return div as HTMLDivElement;
}

function getModeSelect(): HTMLSelectElement {
    const sel = document.getElementById("modeSelect");
    if (!sel) throw new Error("Element #modeSelect not found");
    return sel as HTMLSelectElement;
}


// Initialize the board (create empty tiles)
function initBoard(wordLength: number = 5, maxAttempts: number = 6): void {
    const board = getBoard(); // récupérer dynamiquement l'élément
    board.innerHTML = "";
    for (let i = 0; i < maxAttempts * wordLength; i++) {
        const tile = document.createElement("div");
        tile.className = "tile";
        board.appendChild(tile);
    }
}

// Render the board based on game attempts and current guess
function renderBoard(): void {
    const board = getBoard(); // récupérer dynamiquement l'élément
    const attempts = game.getAttempts();
    const tiles = board.querySelectorAll(".tile");

    // Reset all tiles
    tiles.forEach((tile) => {
        tile.textContent = "";
        tile.classList.remove("green", "yellow", "gray", "red");
    });

    // Render validated attempts (all attempts except current in-progress, if any)
    let validatedAttempts: string[];
    if (game.isFinished()) {
        validatedAttempts = attempts;
    } else {
        validatedAttempts = attempts.slice(0, -1);
    }

    validatedAttempts.forEach((attempt, rowIndex) => {
        const feedback = game.makeGuessFeedback(attempt);
        for (let col = 0; col < feedback.length; col++) {
            const index = rowIndex * 5 + col;
            const tile = tiles[index] as HTMLDivElement;
            tile.textContent = feedback[col].letter;
            tile.classList.add(feedback[col].status);
        }
    });

    // Render current (in-progress) guess in the active row
    if (!game.isFinished()) {
        const currentGuess = game.getCurrentGuess();
        const currentRow = validatedAttempts.length;
        for (let i = 0; i < currentGuess.length; i++) {
            const index = currentRow * 5 + i;
            const tile = tiles[index] as HTMLDivElement;
            tile.textContent = currentGuess[i];
            tile.classList.add("gray");
        }
    }
}

// Update statistics display
function updateStats(): void {
    const statsDiv = getStatsDiv();
    statsDiv.textContent = `Parties jouées: ${globalStats.gamesPlayed} - Gagnées: ${globalStats.gamesWon} - Streak: ${globalStats.currentStreak} - Moyenne d'essais: ${globalStats.averageAttempts.toFixed(2)}`;
}

// Update timer display (only in Timed mode)
function updateTimer(): void {
    const timerDiv = getTimerDiv();
    if (game && game.mode === GameMode.Timed && !game.isFinished()) {
        const remaining = Math.ceil(game.getRemainingTime());
        timerDiv.textContent = `Temps restant: ${remaining} sec`;
    } else {
        timerDiv.textContent = "";
    }
}

function setupUI(): HTMLSelectElement {
    const modeSelect = document.getElementById("modeSelect") as HTMLSelectElement;
    if (!modeSelect) throw new Error("Element #modeSelect not found");

    // Initialisation d'autres éléments UI si nécessaire (ex: initBoard, initKeyboard)
    initBoard(5, 6);
    initKeyboard();

    // Retourner modeSelect pour l'utiliser dans startNewGame
    return modeSelect;
}

// Start a new game with the selected mode
function startNewGame(): void {
    // Read selected mode from dropdown avec fallback

    const modeSelect = setupUI();
    const modeValue = modeSelect ? modeSelect.value : "Classic"; // fallback : Classic
    let mode: GameMode;
    if (modeValue === "Timed") {
        mode = GameMode.Timed;
    } else if (modeValue === "Practice") {
        mode = GameMode.Practice;
    } else {
        mode = GameMode.Classic;
    }

    // Create a new game. In practice mode, we might allow more attempts.
    const maxAttempts = mode === GameMode.Practice ? 10 : 6;
    game = new WordleGame(chooseRandomWord(5), maxAttempts, mode, globalStats);

    // Reset board and keyboard
    initBoard(5, maxAttempts);
    initKeyboard();
    const messageDiv = getMessageDiv();
    const errorMessageDiv = getErrorMessageDiv();
    messageDiv.textContent = "";
    errorMessageDiv.textContent = "";
    errorMessageDiv.style.opacity = "0";
    updateStats();
/*
    solutionWordDiv.textContent = `Solution: ${game["solution"]}`; // For testing purposes
*/
    console.log(game['solution']);

    // Set focus (if needed) for key input.
}

// Global keyboard event listener
document.addEventListener("keydown", (event) => {
    // Do nothing if game is finished
    if (game.isFinished()) {
        event.preventDefault();
        return;
    }

    // Process letter keys (A-Z)
    if (event.key.length === 1 && event.key.match(/[a-z]/i) && game.getCurrentGuess().length < 5) {
        game.addLetter(event.key.toUpperCase());
        renderBoard();
        event.preventDefault();
    } else if (event.key === "Backspace") {
        game.removeLetter();
        renderBoard();
        event.preventDefault();
    } else if (event.key === "Enter") {
        validateGuess(game.getCurrentGuess());
        event.preventDefault();
    }
});

// Validate the current guess and update UI
function validateGuess(guess: string): void {
    // Clear any previous message and ensure messageDiv is hidden
    const messageDiv = getMessageDiv();
    const errorMessageDiv = getErrorMessageDiv();
    errorMessageDiv.textContent = "";
    errorMessageDiv.style.opacity = "0";
    // Also clear the regular message
    messageDiv.textContent = "";

    try {
        const feedback = game.makeGuess(guess);
        updateKeyboard(feedback);
        renderBoard();
        updateStats();

        if (game.isFinished()) {
            if (guess.toUpperCase() === game["solution"]) {
                messageDiv.textContent = "Félicitations, vous avez gagné !";
            } else {
                messageDiv.textContent = `Perdu… Le mot était ${game["solution"]}.`;
            }
        }
    } catch (error: any) {
        errorMessageDiv.textContent = error.message;
        errorMessageDiv.style.opacity = "1";
        renderBoard();

        // Optionally, mark current row in red
        const attempts = game.getAttempts();
        const activeRowIndex = attempts.length - 1;
        const board = getBoard();
        const tiles = board.querySelectorAll(".tile");
        const currentGuess = game.getCurrentGuess();
        for (let i = 0; i < currentGuess.length; i++) {
            const index = activeRowIndex * 5 + i;
            const tile = tiles[index] as HTMLDivElement;
            tile.classList.remove("gray");
            tile.classList.add("red", "vibrate");
        }

        // Remove the vibration class after 1 second so the effect doesn't repeat continuously
        setTimeout(() => {
            errorMessageDiv.textContent = "";
            errorMessageDiv.style.opacity = "0";
            for (let i = 0; i < currentGuess.length; i++) {
                const index = activeRowIndex * 5 + i;
                const tile = tiles[index] as HTMLDivElement;
                tile.classList.remove("vibrate");
            }
        }, 1000);
    }
}

// Initialize the virtual keyboard
function initKeyboard(): void {
    const keyboardContainer = document.getElementById("virtual-keyboard") as HTMLDivElement;
    keyboardContainer.innerHTML = "";
    // Reset letter statuses
    for (const key in letterStatuses) {
        delete letterStatuses[key];
    }

    // Define keyboard rows (adapted to French layout)
    const rows = [
        "AZERTYUIOP",
        "QSDFGHJKLM",
        "WXCVBN"
    ];

    rows.forEach((row) => {
        const rowDiv = document.createElement("div");
        rowDiv.className = "keyboard-row";
        for (const letter of row) {
            const keyBtn = document.createElement("button");
            keyBtn.className = "key";
            keyBtn.textContent = letter;
            keyBtn.setAttribute("data-letter", letter);
            keyBtn.addEventListener("click", () => {
                if (game.isFinished()) return;
                game.addLetter(letter);
                renderBoard();
            });
            rowDiv.appendChild(keyBtn);
        }
        keyboardContainer.appendChild(rowDiv);
    });

    // Special keys: Enter and Backspace
    const specialRow = document.createElement("div");
    specialRow.className = "keyboard-row";

    const enterBtn = document.createElement("button");
    enterBtn.textContent = "Enter";
    enterBtn.className = "key special-key";
    enterBtn.addEventListener("click", () => {
        validateGuess(game.getCurrentGuess());
    });
    specialRow.appendChild(enterBtn);

    const backspaceBtn = document.createElement("button");
    backspaceBtn.textContent = "Backspace";
    backspaceBtn.className = "key special-key";
    backspaceBtn.addEventListener("click", () => {
        game.removeLetter();
        renderBoard();
    });
    specialRow.appendChild(backspaceBtn);

    keyboardContainer.appendChild(specialRow);
}

// Letter statuses for keyboard updating
const letterStatuses: { [letter: string]: string } = {};
function updateKeyboard(feedback: LetterResult[]): void {
    feedback.forEach((item) => {
        const letter = item.letter;
        const newStatus = item.status;
        const currentStatus = letterStatuses[letter];
        // Priority: green > yellow > gray
        if (currentStatus === "green") return;
        if (currentStatus === "yellow" && newStatus === "gray") return;
        letterStatuses[letter] = newStatus;
        const keyButton = document.querySelector(`button.key[data-letter="${letter}"]`) as HTMLButtonElement;
        if (keyButton) {
            keyButton.classList.remove("green", "yellow", "gray");
            keyButton.classList.add(newStatus);
            if (newStatus === "gray") {
                keyButton.disabled = true;
            }
        }
    });
}

// Restart button event listener
function setupEventListeners() {
    const restartBtn = getRestartBtn();
    restartBtn.addEventListener("click", () => {
        startNewGame();
    });
}


// Update timer every second (for Timed mode)
setInterval(() => {
    const timerDiv = getTimerDiv();
    if (game && game.mode === GameMode.Timed && !game.isFinished()) {
        updateTimer();
    } else {
        timerDiv.textContent = "";
    }
}, 1000);

// Start the first game on load
if (document.readyState !== 'loading') {
    if (process.env.NODE_ENV !== "test") {
        startNewGame();
        setupEventListeners(); // Ajouté ici
    }
} else {
    document.addEventListener('DOMContentLoaded', () => {
        if (process.env.NODE_ENV !== "test") {
            startNewGame();
            setupEventListeners(); // Et ici aussi
        }
    });
}


export { initBoard, updateStats, initKeyboard, startNewGame, setupEventListeners, setupUI};

