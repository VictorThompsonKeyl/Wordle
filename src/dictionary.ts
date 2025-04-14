import words from "an-array-of-french-words";


export const VALID_WORDS_5: string[] = [
    "AMOUR", "AVION", "BACON", "BALAI", "BANAL", "BANJO", "BARBE", "BEIGE", "BERET", "BICHE", "BISOU",
    "BLOND", "BOIRE", "BONNE", "BOUTE", "BRUIT", "BULLE", "CACHE", "CADRE", "CALME", "CANAL",
    "CANON", "CARTE", "CEINT", "CERNE", "CHAIR", "CHAMP", "CHANT", "CHIEN", "CHOIX", "CLAIR",
    "CLERC", "COEUR", "COGNE", "COMBE", "CORDE", "COUDE", "COULE", "COUPE", "COURT", "CRIER",
    "CRISE", "CROIX", "CUIRE", "DANSE", "DEBIT", "DENTS", "DEVIN", "DIGNE", "DOIGT", "DONNE",
    "DORER", "DRAME", "DROIT", "ECLAT", "EMAIL", "EPOUX", "ESSAI", "ETAGE", "ETEND",
    "ETUDE", "FABLE", "FACON", "FAIRE", "FEMME", "FENTE", "FERME", "FLEUR",
    "FOIRE", "FONCE", "FONTE", "FORCE", "FOULE", "FRUIT", "GALET", "GARDE", "GAZON", "GENOU",
    "GIRON", "GLACE", "GOUTE", "GRAND", "GRAVE", "HABIT", "HAVRE", "HIVER", "HONTE", "HUMUS",
    "IMAGE", "JANTE", "JAUNE", "JOUER", "JUMEL", "JUPON", "LACET", "LAMPE",
    "LARME", "LEGER", "LENTE", "LIEUX", "LIMON", "LITRE", "LIVRE", "LOIRE", "LUNDI", "LUTTE",
    "MAIRE", "MALLE", "MAMAN", "MANGE", "MARIN", "MERCI", "MIMES", "MODEM", "MORTE",
    "MOTIF", "NAGER", "NERVE", "NEIGE", "NOMME", "NOUER", "NUAGE", "OCEAN", "OMBRE", "OPERA",
    "ORDRE", "ORAGE", "PANSE", "PARLE", "PATIN", "PAUME", "PEINT", "PERDU", "PERLE", "PETIT",
    "PLAGE", "PLIER", "PLUIE", "POMME", "PORTE", "POTIN", "PRUNE", "PUITS", "RADIO",
    "RAIDE", "RANGS", "RAVIN", "RENDU", "RIVEE", "ROUGE", "ROUES", "SAINT", "SALIR", "SAUTE",
    "SAVON", "SUITE", "TABLE", "TACHE", "TARTE", "TERNE", "TERRE", "TIRER",
    "TOAST", "TOMBE", "TROIS", "TROUE", "TROUS", "VACHE", "VASTE", "VENTE",
    "VERRE", "VIEUX", "VOILE", "VOTER", "ZONES"
];



// Fonction pour récupérer des mots de longueur donnée
function getWordsOfLength(length: number, limit: number = 200): string[] {
    return words
        .filter(word => word.length === length) // Garde seulement les mots en majuscules
        .slice(0, limit); // Prend les 200 premiers mots
}

function removeAccents(str: string): string {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}


/**
 * Retourne les mots valides d'une certaine longueur.
 * @param wordLength - La longueur des mots à extraire.
 */
export function getFrenchWords(wordLength: number = 5): string[] {
    return words
        .filter(word => removeAccents(word).length === wordLength)  // filtre sans accent
        .map(word => removeAccents(word).toUpperCase());            // retire accents + uppercase
}

/**
 * Retourne les mots valides d'une certaine longueur.
 * @param wordLength - La longueur des mots à extraire.
 */
export function getValidWords(wordLength: number = 5): string[] {
    return VALID_WORDS_5
        .filter(word => word.length === wordLength)
        .map(word => word.toUpperCase());
}