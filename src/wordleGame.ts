// src/wordleGame.ts

import { validateWord, isValidFormat } from "./wordValidator";
import { checkGuess, LetterResult } from "./gameLogic";

export interface GameStats {
    gamesPlayed: number;
    gamesWon: number;
    currentStreak: number;
    averageAttempts: number;
}

export enum GameMode {
    Classic,
    Timed,
    Practice,
}

export class WordleGame {
    private solution: string;
    private maxAttempts: number;
    private attempts: string[] = [];
    private finished: boolean = false;
    public stats: GameStats;
    public mode: GameMode;

    // Timer properties for Timed mode
    private timerId: ReturnType<typeof setTimeout> | null = null;
    private timeLimit: number = 360; // seconds
    private startTime: number = 0;

    constructor(
        solution: string,
        maxAttempts: number = 6,
        mode: GameMode = GameMode.Classic,
        stats?: GameStats
    ) {
        if (!validateWord(solution, solution.length)) {
            throw new Error("Solution invalide");
        }
        this.solution = solution.toUpperCase();
        this.mode = mode;
        // In Practice mode, allow unlimited attempts
        this.maxAttempts = mode === GameMode.Practice ? Infinity : maxAttempts;
        this.stats = stats || {
            gamesPlayed: 0,
            gamesWon: 0,
            currentStreak: 0,
            averageAttempts: 0,
        };
        this.attempts.push(""); // Initialize first guess

        // Start timer if in Timed mode
        if (this.mode === GameMode.Timed) {
            this.startTime = Date.now();
            this.startTimer();
        }
    }

    // Starts the countdown timer (only in Timed mode)
    private startTimer(): void {
        if (this.mode === GameMode.Timed) {
            this.timerId = setTimeout(() => {
                if (!this.finished) {
                    this.finished = true;
                    this.updateStats(false);
                }
            }, this.timeLimit * 1000);
        }
    }

    // Clears the timer
    private clearTimer(): void {
        if (this.timerId !== null) {
            clearTimeout(this.timerId);
            this.timerId = null;
        }
    }

    // Returns the remaining time in seconds (for Timed mode)
    public getRemainingTime(): number {
        if (this.mode !== GameMode.Timed) return Infinity;
        const elapsed = (Date.now() - this.startTime) / 1000;
        return Math.max(0, this.timeLimit - elapsed);
    }

    // Returns the current guess (the last attempt)
    public getCurrentGuess(): string {
        return this.attempts[this.attempts.length - 1] || "";
    }

    // Adds a letter to the current guess
    public addLetter(letter: string): void {
        if (this.getCurrentGuess().length < this.solution.length) {
            this.attempts[this.attempts.length - 1] += letter;
        }
    }

    // Removes the last letter from the current guess
    // Retirez la lettre seulement si le jeu n'est pas terminé.
    public removeLetter(): void {
        if (this.finished) return; // Ajout de ce contrôle pour empêcher la modification en fin de partie.
        const currentGuess = this.getCurrentGuess();
        if (currentGuess.length > 0) {
            this.attempts[this.attempts.length - 1] = currentGuess.slice(0, -1);
        }
    }


    // Clears the current guess (starts a new empty attempt)
    public clearCurrentGuess(): void {
        this.attempts.push("");
    }

    // Validates a guess, returns feedback, and updates the game state.
    public makeGuess(guess: string): LetterResult[] {
        if (this.finished) {
            throw new Error("La partie est terminée");
        }

        // Validate format (length and alphabetic only)
        if (!isValidFormat(guess, this.solution.length)) {
            throw new Error(`Le mot doit contenir ${this.solution.length} lettres alphabétiques`);
        }
        // Validate existence in dictionary
        if (!validateWord(guess, this.solution.length)) {
            throw new Error(`"${guess}" n'est pas un mot valide`);
        }

        const upperGuess = guess.toUpperCase();
        const feedback = checkGuess(upperGuess, this.solution);
        // Replace current guess with the validated one
        this.attempts[this.attempts.length - 1] = upperGuess;

        if (upperGuess === this.solution) {
            this.finished = true;
            this.clearTimer();
            this.updateStats(true);
        } else if (this.attempts.length >= this.maxAttempts) {
            this.finished = true;
            this.clearTimer();
            this.updateStats(false);
        } else {
            // Add new empty attempt for next guess
            this.attempts.push("");
        }

        return feedback;
    }

    // Checks if the game is finished
    public isFinished(): boolean {
        return this.finished;
    }

    // Returns all attempts
    public getAttempts(): string[] {
        return this.attempts;
    }

    // Provides feedback for a given guess without modifying state (useful for rendering)
    public makeGuessFeedback(guess: string): LetterResult[] {
        return checkGuess(guess.toUpperCase(), this.solution);
    }

    // Updates global statistics (except in Practice mode)
    private updateStats(won: boolean): void {
        if (this.mode === GameMode.Practice) return;

        this.stats.gamesPlayed++;
        if (won) {
            this.stats.gamesWon++;
            this.stats.currentStreak++;
        } else {
            this.stats.currentStreak = 0;
        }
        this.stats.averageAttempts =
            (this.stats.averageAttempts * (this.stats.gamesPlayed - 1) + this.attempts.length) /
            this.stats.gamesPlayed;
    }
}
