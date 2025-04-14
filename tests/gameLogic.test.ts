// tests/gameLogic.test.ts

import { describe, it, expect } from "vitest";
import { checkGuess, LetterResult } from "../src/gameLogic";

describe("checkGuess", () => {
    it("identifie une correspondance exacte (vert)", () => {
        const result = checkGuess("AVION", "AVION");
        expect(result.every(r => r.status === "green")).toBe(true);
    });

    it("marque les lettres absentes comme gris", () => {
        // "AVION" comporte les lettres A, V, I, O, N.
        // On choisit "PELTS" (P, E, L, T, S) qui ne partage aucune lettre avec "AVION".
        const result = checkGuess("PELTS", "AVION");
        expect(result.every(r => r.status === "gray")).toBe(true);
    });

    it("gère les lettres jaunes correctement", () => {
        // Exemple : solution "AVION" et proposition "VINOA"
        // Attendu : seule la lettre O à la position 3 est à la bonne place (green),
        // les 4 autres lettres sont présentes mais mal placées (yellow).
        const result = checkGuess("VINOA", "AVION");
        const greenCount = result.filter(r => r.status === "green").length;
        const yellowCount = result.filter(r => r.status === "yellow").length;
        expect(greenCount).toBe(1);
        expect(yellowCount).toBe(4);
    });

    it("gère les doublons correctement", () => {
        // Exemple avec des doublons :
        // Solution : "CACAO" (lettres : C, A, C, A, O)
        // Proposition : "CAAAA"
        // Première passe :
        //   index0: C vs C → green (décrémente compte de C de 2 à 1)
        //   index1: A vs A → green (décrémente compte de A de 2 à 1)
        //   index2: A vs C → temp grey
        //   index3: A vs A → green (décrémente compte de A de 1 à 0)
        //   index4: A vs O → temp grey
        // Deuxième passe :
        //   index2: A, mais compte de A est 0 → reste grey
        //   index4: A, compte de A toujours 0 → reste grey
        // Résultat final attendu : [green, green, gray, green, gray]
        const result = checkGuess("CAAAA", "CACAO");
        expect(result[0].status).toBe("green");
        expect(result[1].status).toBe("green");
        expect(result[2].status).toBe("gray");
        expect(result[3].status).toBe("green");
        expect(result[4].status).toBe("gray");
    });
});
