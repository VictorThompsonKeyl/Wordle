// src/wordValidator.ts
import { getFrenchWords } from "./dictionary";

/**
 * Vérifie uniquement le format d'un mot (longueur et caractères alphabétiques).
 */
export function isValidFormat(word: string, length: number = 5): boolean {
    const regex = new RegExp(`^[A-Za-z]{${length}}$`);
    return regex.test(word);
}

/**
 * Valide qu'un mot est composé de 'length' lettres alphabétiques
 * et qu'il existe dans le dictionnaire des mots valides.
 * @param word Le mot à valider.
 * @param length La longueur attendue du mot (par défaut 5).
 * @returns true si le mot est valide, false sinon.
 */
export function validateWord(word: string, length: number = 5): boolean {
    if (!isValidFormat(word, length)) {
        return false;
    }
    const validWords = getFrenchWords(length);
    return validWords.includes(word.toUpperCase());
}
