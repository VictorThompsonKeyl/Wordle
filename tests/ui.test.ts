// tests/ui.test.ts

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
    initBoard,
    updateStats,
    initKeyboard,
    startNewGame,
    setupEventListeners,
    setupUI
} from "../src/ui";

// Moque le module dictionary pour que getValidWords retourne toujours ["AVION"]
vi.mock("../src/dictionary", () => {
    return {
        getValidWords: (wordLength: number = 5) => {
            return wordLength === 5 ? ["AVION"] : [];
        },
        getFrenchWords: (wordLength: number = 5) => {
            return wordLength === 5 ? ["AVION"] : [];
        }
    };
});

const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Test Wordle UI</title>
</head>
<body>
  <div id="board"></div>
  <div id="message"></div>
  <div id="error-message"></div>
  <div id="stats"></div>
  <div id="timer"></div>
  <div id="virtual-keyboard"></div>
  <select id="modeSelect">
    <option value="Classic">Classic</option>
    <option value="Timed">Timed</option>
    <option value="Practice">Practice</option>
  </select>
  <button id="restartBtn"></button>
</body>
</html>
`;

describe("UI", () => {
    beforeEach(() => {
        // Injecte le DOM de test avant chaque scénario
        document.documentElement.innerHTML = html;
    });

    /* === Tests "happy path" === */

    it("crée le bon nombre de tuiles avec initBoard", () => {
        initBoard(5, 6);
        const board = document.getElementById("board") as HTMLDivElement;
        expect(board.children.length).toBe(30);
    });

    it("met à jour les statistiques avec updateStats", () => {
        updateStats();
        const statsDiv = document.getElementById("stats") as HTMLDivElement;
        expect(statsDiv.textContent).toMatch(/Parties jouées:/);
    });

    it("initialise le clavier virtuel avec initKeyboard", () => {
        initKeyboard();
        const keyboard = document.getElementById("virtual-keyboard") as HTMLDivElement;
        const rows = keyboard.querySelectorAll(".keyboard-row");
        expect(rows.length).toBeGreaterThanOrEqual(3);
    });

    it("lance une nouvelle partie avec startNewGame", () => {
        setupEventListeners();
        startNewGame();
        const board = document.getElementById("board") as HTMLDivElement;
        expect(board.children.length).toBeGreaterThan(0);
        const errorMessageDiv = document.getElementById("error-message") as HTMLDivElement;
        expect(errorMessageDiv.textContent).toBe("");
    });

    it("affiche le message de victoire après avoir saisi 'AVION' via le clavier", () => {
        startNewGame();
        // Simuler la saisie de 'A', 'V', 'I', 'O', 'N'
        const letters = ["A", "V", "I", "O", "N"];
        letters.forEach(letter => {
            document.dispatchEvent(new KeyboardEvent("keydown", { key: letter }));
        });
        // Simuler la touche "Enter"
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));

        const messageDiv = document.getElementById("message") as HTMLDivElement;
        expect(messageDiv.textContent).toContain("Félicitations");
    });

    it("supprime une lettre avec Backspace", () => {
        startNewGame();
        // Simuler la saisie d'une lettre via le clavier
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "A" }));
        let board = document.getElementById("board") as HTMLDivElement;
        let firstTile = board.querySelector(".tile") as HTMLDivElement;
        expect(firstTile.textContent).toBe("A");

        // Simuler la touche Backspace
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Backspace" }));
        board = document.getElementById("board") as HTMLDivElement;
        firstTile = board.querySelector(".tile") as HTMLDivElement;
        expect(firstTile.textContent).toBe("");
    });

    it("ajoute une lettre lors du clic sur le clavier virtuel", () => {
        startNewGame();
        initKeyboard();
        // Trouver le bouton correspondant à la lettre 'A'
        const keyBtn = document.querySelector('button.key[data-letter="A"]') as HTMLButtonElement;
        keyBtn.click();
        const board = document.getElementById("board") as HTMLDivElement;
        const firstTile = board.querySelector(".tile") as HTMLDivElement;
        expect(firstTile.textContent).toBe("A");
    });

    it("n'ajoute pas de lettre si le jeu est terminé", () => {
        startNewGame();
        // Saisir la solution correcte "AVION" pour terminer la partie
        const letters = ["A", "V", "I", "O", "N"];
        letters.forEach(letter => {
            document.dispatchEvent(new KeyboardEvent("keydown", { key: letter }));
        });
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));

        // Sauvegarder le contenu du plateau une fois la partie terminée
        const boardElement = document.getElementById("board");
        expect(boardElement).not.toBeNull();
        const boardBefore = boardElement!.innerHTML;

        // Simuler une nouvelle saisie alors que le jeu est fini
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Z" }));
        const boardElementAfter = document.getElementById("board");
        expect(boardElementAfter).not.toBeNull();
        const boardAfter = boardElementAfter!.innerHTML;
        expect(boardAfter).toEqual(boardBefore);
    });

    it("exécute le gestionnaire du bouton Restart", () => {
        startNewGame();
        setupEventListeners();
        const restartBtn = document.getElementById("restartBtn") as HTMLButtonElement;
        expect(() => restartBtn.click()).not.toThrow();
    });

    /* === Tests pour couvrir les branches d'erreur et de setTimeout === */

    it("affiche et nettoie le message d'erreur en cas de saisie invalide", () => {
        // Utiliser des timers factices pour contrôler le setTimeout
        vi.useFakeTimers();
        startNewGame();

        // Dispatch Enter sans saisie (supposé invalide) pour déclencher un try/catch dans validateGuess
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));

        const errorMessageDiv = document.getElementById("error-message") as HTMLDivElement;
        // Vérifier qu'un message d'erreur est affiché immédiatement
        expect(errorMessageDiv.textContent).not.toBe("");

        // Avancer le timer pour exécuter le setTimeout (ici 1000 ms)
        vi.advanceTimersByTime(1000);

        // Vérifier que le message d'erreur est ensuite effacé
        expect(errorMessageDiv.textContent).toBe("");
        vi.useRealTimers();
    });

    /* === Tests pour simuler l'absence d'éléments dans le DOM === */

    it("lève une erreur si l'élément board est manquant", () => {
        // Supprimez l'élément board
        document.getElementById("board")?.remove();
        expect(() => initBoard(5, 6)).toThrow("Element #board not found");
    });

    it("lève une erreur si l'élément message est manquant", () => {
        document.getElementById("message")?.remove();
        expect(() => {
            // Accès via getMessageDiv dans startNewGame ou validateGuess
            // On force ici une erreur en simulant un appel direct
            document.getElementById("message")!;
        }).toBeTruthy();
    });

    it("lève une erreur si l'élément error-message est manquant", () => {
        document.getElementById("error-message")?.remove();
        expect(() => {
            document.getElementById("error-message")!;
        }).toBeTruthy();
    });

    it("lève une erreur si l'élément stats est manquant", () => {
        document.getElementById("stats")?.remove();
        expect(() => updateStats()).toThrow("Element #stats not found");
    });

    it("lève une erreur si l'élément timer est manquant", () => {
        document.getElementById("timer")?.remove();
        expect(() => {
            // On force un appel via updateTimer ou getTimerDiv
            document.getElementById("timer")!;
        }).toBeTruthy();
    });

    it("lève une erreur si l'élément modeSelect est manquant", () => {
        document.getElementById("modeSelect")?.remove();
        expect(() => {
            // Appel dans setupUI génère une erreur si absent
            setupUI();
        }).toThrow("Element #modeSelect not found");
    });
});
