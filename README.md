# Wordle Project

Ce projet implémente le jeu Wordle en TypeScript avec une interface web et une couverture de tests complète sous Vitest.

## Fonctionnalités

- Validation d'un mot (5 lettres, alphabetic)
- Vérification d'une proposition avec feedback :
  - Vert : lettre correcte et bien placée
  - Jaune : lettre présente dans le mot solution mais mal placée
  - Gris : lettre absente
- Gestion des essais (6 tentatives maximum)
- Suivi des statistiques (nombre de parties gagnées, streak, moyenne d'essais)
- Modes de jeu (ex : mode chronométré, mode pratique)
- Support de mots de longueur dynamique (bonus)
- Calcul de score

## Structure

- `src/` : Code source du jeu (validation, logique de jeu, gestion d'état, UI).
- `tests/` : Suites de tests unitaires avec Vitest.
- `index.html` et `style.css` : Interface visuelle.

## Pour démarrer

1. Installer les dépendances :
   ```bash
   npm install
