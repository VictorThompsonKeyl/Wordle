import { describe, it, expect } from "vitest";
import { validateWord } from "../src/wordValidator";

describe("validateWord", () => {
    it("rejette un mot de moins de 5 lettres", () => {
        expect(validateWord("CAT")).toBe(false);
    });

    it("rejette un mot contenant des chiffres ou symboles", () => {
        expect(validateWord("AV1ON")).toBe(false);
        expect(validateWord("AV!ON")).toBe(false);
    });

    it("accepte un mot de 5 lettres alphabétiques", () => {
        expect(validateWord("AVION")).toBe(true);
    });

    it("accepte un mot de longueur dynamique", () => {
        expect(validateWord("BANANE", 6)).toBe(true);
    });
});
