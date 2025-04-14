import { describe, it, expect } from "vitest";
import { WordleGame, GameMode } from "../src/wordleGame";
import { checkGuess } from "../src/gameLogic";

describe("WordleGame", () => {
    it("rejette une proposition invalide", () => {
        // Utilise un mot de 5 lettres qui est validé par ton dictionnaire français
        const game = new WordleGame("AVION", 6, GameMode.Classic);
        // Par exemple, "CHAT" n'est pas un mot de 5 lettres
        expect(() => game.makeGuess("CHAT")).toThrow();
    });

    it("renvoie un feedback correct pour une proposition", () => {
        const game = new WordleGame("AVION", 6, GameMode.Classic);
        // Propose un mot existant dans ton dictionnaire (par exemple, "AVIDE") si c'est pertinent pour ton feedback
        const feedback = game.makeGuess("AVIDE");
        expect(feedback).toEqual(checkGuess("AVIDE", "AVION"));
    });

    it("met fin à la partie après 6 tentatives", () => {
        const game = new WordleGame("AVION", 6, GameMode.Classic);
        // Effectuer 5 propositions incorrectes avec des mots valides (assure-toi qu'ils existent dans le dictionnaire français)
        for (let i = 0; i < 5; i++) {
            game.makeGuess("BACON");
        }
        // La 6ème tentative
        game.makeGuess("BALAI");
        expect(game.isFinished()).toBe(true);
    });

    it("met à jour les statistiques de jeu", () => {
        const game = new WordleGame("AVION", 6, GameMode.Classic);
        game.makeGuess("BACON"); // incorrecte
        game.makeGuess("AVION"); // correcte
        expect(game.isFinished()).toBe(true);
        expect(game["stats"].gamesPlayed).toBe(1);
        expect(game["stats"].gamesWon).toBe(1);
    });

    it("rejette une proposition après la fin de la partie", () => {
        const game = new WordleGame("AVION", 6, GameMode.Classic);
        game.makeGuess("AVION"); // gagne la partie
        expect(() => game.makeGuess("BACON")).toThrow("La partie est terminée");
    });

    it("ajoute une lettre avec addLetter et retourne la tentative actuelle", () => {
        const game = new WordleGame("AVION", 6, GameMode.Classic);
        game.addLetter("A");
        expect(game.getCurrentGuess()).toBe("A");
        game.addLetter("V");
        expect(game.getCurrentGuess()).toBe("AV");
    });

    it("ne permet pas d'ajouter des lettres une fois la partie terminée", () => {
        const game = new WordleGame("AVION", 6, GameMode.Classic);
        game.makeGuess("AVION"); // gagne la partie
        // Tenter d'ajouter une lettre après la fin ne doit rien changer
        game.addLetter("X");
        expect(game.getCurrentGuess()).toBe("AVION");
    });

    it("retire la dernière lettre avec removeLetter", () => {
        const game = new WordleGame("AVION", 6, GameMode.Classic);
        game.addLetter("A");
        game.addLetter("V");
        expect(game.getCurrentGuess()).toBe("AV");
        game.removeLetter();
        expect(game.getCurrentGuess()).toBe("A");
    });

    it("ne permet pas de retirer une lettre une fois la partie terminée", () => {
        const game = new WordleGame("AVION", 6, GameMode.Classic);
        game.makeGuess("AVION");
        const current = game.getCurrentGuess();
        game.removeLetter();
        expect(game.getCurrentGuess()).toBe(current);
    });

    it("clearCurrentGuess ajoute bien une nouvelle tentative", () => {
        const game = new WordleGame("AVION", 6, GameMode.Classic);
        expect(game.getAttempts().length).toBe(1);
        game.clearCurrentGuess();
        expect(game.getAttempts().length).toBe(2);
        expect(game.getCurrentGuess()).toBe("");
    });

    it("renvoie le feedback correct via makeGuessFeedback sans modifier l'état", () => {
        const game = new WordleGame("AVION", 6, GameMode.Classic);
        game.addLetter("A");
        game.addLetter("V");
        const feedback = game.makeGuessFeedback(game.getCurrentGuess());
        expect(feedback).toEqual(checkGuess("AV", "AVION"));
        // L'état ne doit pas être modifié par makeGuessFeedback
        expect(game.getCurrentGuess()).toBe("AV");
    });
});
