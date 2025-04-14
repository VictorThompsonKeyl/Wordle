import { describe, it, expect, vi } from "vitest";

// On mock le module externe "an-array-of-french-words"
vi.mock("an-array-of-french-words", () => {
    return {
        default: ["amour", "avion", "bacon", "table", "motif"]
    };
});


import { getFrenchWords, getValidWords } from "../src/dictionary";

describe("dictionary", () => {
    it("retourne uniquement des mots de la longueur demandée avec getFrenchWords", () => {
        const words = getFrenchWords(5);
        // Tous les mots doivent avoir 5 lettres et être en majuscules
        expect(words.every(word => word.length === 5)).toBe(true);
        expect(words.every(word => word === word.toUpperCase())).toBe(true);
    });

    it("retourne uniquement des mots de la longueur demandée avec getValidWords", () => {
        const valid = getValidWords(5);
        expect(valid.every(word => word.length === 5)).toBe(true);
        // On suppose que VALID_WORDS_5 n'est pas vide
        expect(valid.length).toBeGreaterThan(0);
    });
});
