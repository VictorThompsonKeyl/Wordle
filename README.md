# Wordle Project

Ce projet implémente une version francisée du jeu Wordle en TypeScript, avec une interface web simple et une couverture de tests complète sous Vitest.

---

## Fonctionnalités

- Validation des propositions : mots de 5 lettres, uniquement alphabétiques, insensibles aux accents.
- Vérification avec feedback visuel :
  - Vert : lettre correcte et bien placée.
  - Jaune : lettre présente dans le mot solution mais mal placée.
  - Gris : lettre absente.
- Gestion des tentatives : 6 essais maximum.
- Suivi des statistiques : nombre de victoires, série en cours, moyenne d’essais.
- Modes de jeu :
  - Mode classique.
  - Mode chronométré.
  - Mode pratique.
- Support des mots de longueur dynamique.
- Calcul du score basé sur le nombre d'essais et la rapidité.
- Validation des propositions contre une liste officielle de mots français (`an-array-of-french-words`).
- Gestion des accents : les mots sont normalisés pour permettre une saisie sans accent.

---

## Structure du projet

- `src/` : Code source du jeu.
  - `game/` : Logique métier et gestion des états.
  - `utils/` : Fonctions utilitaires (suppression des accents, validation de mots).
  - `wordlist.ts` : Listes des mots valides à deviner.
- `tests/` : Tests unitaires organisés par module, réalisés avec Vitest.
- `index.html` / `style.css` : Interface utilisateur minimale pour le jeu.

---

## Installation

1. Installer les dépendances :

```bash
npm install
```

2. Lancer le serveur de développement :

```bash
npm run dev
```

L'interface sera accessible dans le navigateur.

3. Lancer les tests unitaires :

```bash
npm run test
```

Pour visualiser la couverture de code :

```bash
npm run coverage
```

---

## Gestion des mots et des accents

Les propositions du joueur sont validées contre une liste complète de mots français (`an-array-of-french-words`) pour empêcher les entrées incorrectes ou inventées.

Les accents sont supprimés avant toute comparaison, afin que la saisie reste simple et intuitive.  

---

## Objectifs pédagogiques

Ce projet a été conçu pour répondre aux attentes du **Testing Exam 1 - Wordle**, en mettant l'accent sur :

- La validation d'entrée robuste (longueur, alphabet, accents).
- Une séparation claire entre logique métier, état et affichage.
- L’application stricte des bonnes pratiques de tests unitaires :
  - Tests isolés, déterministes et rapides.
  - Tests respectant une couverture minimale de 80%.
  - Utilisation d’une stratégie de test structurée et progressive.
  - Prise en compte des cas limites et erreurs d'entrée.

---

## Exigences de l'examen

Le projet est conforme au cahier des charges :

- Fonctionnalités de base, intermédiaires et avancées implémentées.
- Couverture de test supérieure à 80%.
- Respect des principes : test unitaire, test d'intégration limité, DI, mocks/stubs/fakes.
- Compatible avec une présentation live :  
  - Lancement des tests en direct.
  - Visualisation de la couverture.
  - Démonstration fonctionnelle.
