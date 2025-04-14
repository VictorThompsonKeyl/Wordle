// src/gameLogic.ts

export type LetterStatus = "green" | "yellow" | "gray";

export interface LetterResult {
    letter: string;
    status: LetterStatus;
}

/**
 * Vérifie la proposition d'un joueur et retourne un tableau de résultats pour chaque lettre.
 * - Vert: lettre correcte et bien placée.
 * - Jaune: lettre présente dans le mot solution mais à une autre position.
 * - Gris: lettre absente.
 *
 * Cette fonction gère correctement les doublons.
 *
 * @param guess Le mot proposé.
 * @param solution Le mot solution.
 * @returns Un tableau de LetterResult.
 */
export function checkGuess(guess: string, solution: string): LetterResult[] {
    guess = guess.toUpperCase();
    solution = solution.toUpperCase();

    const result: LetterResult[] = [];
    const solutionLetterCount: Record<string, number> = {};

    // Comptabiliser le nombre d'occurrences de chaque lettre dans la solution.
    for (const letter of solution) {
        solutionLetterCount[letter] = (solutionLetterCount[letter] || 0) + 1;
    }

    // Premier passage : marquer les "verts"
    for (let i = 0; i < guess.length; i++) {
        if (guess[i] === solution[i]) {
            result.push({ letter: guess[i], status: "green" });
            solutionLetterCount[guess[i]]--;
        } else {
            result.push({ letter: guess[i], status: "gray" }); // statut temporaire
        }
    }

    // Second passage : marquer les "jaunes"
    for (let i = 0; i < guess.length; i++) {
        if (result[i].status === "gray") {
            const letter = guess[i];
            if (solutionLetterCount[letter] && solutionLetterCount[letter] > 0) {
                result[i].status = "yellow";
                solutionLetterCount[letter]--;
            }
        }
    }
    return result;
}
