/**
 * Multilingual Profanity & Abusive Language ("Gali") Guard Utility
 * Detects profanity, abusive slurs, vulgarities, and troll words in English, Hindi/Hinglish,
 * and Gujarati, with anti-evasion normalization for leetspeak, punctuation, and spaced letters.
 */

// Abusive & profane word patterns (multilingual)
const ABUSIVE_PATTERNS = [
  // English Profanity & Slurs
  'fuck', 'fucking', 'fucker', 'shit', 'bitch', 'asshole', 'bastard', 'cunt', 'dick', 'pussy',
  'motherfucker', 'cock', 'whore', 'slut', 'bullshit', 'prick', 'twat', 'wanker', 'retard',
  'nigger', 'faggot', 'idiot', 'stupid', 'dumbass', 'garbage', 'useless', 'scam', 'fraud',

  // Hindi / Hinglish Abusive Slurs ("Gali")
  'bhenchod', 'benchod', 'bhanchod', 'bc', 'madarchod', 'mc', 'chutiya', 'chutya', 'chootiya',
  'bsdk', 'bhosdike', 'bhosdika', 'bhosdi', 'lauda', 'loda', 'lodu', 'laund', 'gand', 'gaand',
  'gaandu', 'gandu', 'choot', 'chut', 'harami', 'hrami', 'saala', 'sala', 'kamina', 'kamine',
  'bkl', 'bhenke lode', 'bhenkelode', 'randi', 'rndi', 'raand', 'kutta', 'kutti', 'tatte', 'tatta',
  'jhantu', 'jhatu', 'chutiye', 'bhenchods', 'bhosad', 'maderchod', 'madarchodh', 'bhenchodh',

  // Gujarati Regional Abusive Slurs
  'ghando', 'gandiyad', 'bhosdi', 'gandmaru', 'lodu', 'chod', 'chodina', 'chodya', 'bakwas'
];

// Regex patterns for spaced out evasion (e.g. c.h.u.t.i.y.a or b h e n c h o d)
const SPAGHETTI_PATTERNS = [
  /b\s*h\s*e\s*n\s*c\s*h\s*o\s*d/i,
  /m\s*a\s*d\s*a\s*r\s*c\s*h\s*o\s*d/i,
  /c\s*h\s*u\s*t\s*i\s*y\s*a/i,
  /b\s*h\s*o\s*s\s*d\s*i\s*k\s*e/i,
  /b\s*s\s*d\s*k/i,
  /f\s*u\s*c\s*k/i,
  /s\s*h\s*i\s*t/i,
  /b\s*i\s*t\s*c\s*h/i,
  /l\s*a\s*u\s*d\s*a/i,
  /g\s*a\s*a\s*n\s*d/i
];

/**
 * Normalize string to neutralize common leetspeak and evasion tricks.
 * e.g., '@' -> 'a', '$' -> 's', '0' -> 'o', '1' -> 'i', '!' -> 'i', etc.
 * @param {string} text - Raw input text.
 * @returns {string} Cleaned normalized string.
 */
export function normalizeText(text) {
  if (!text || typeof text !== 'string') return '';

  return text
    .toLowerCase()
    .replace(/@/g, 'a')
    .replace(/\$/g, 's')
    .replace(/0/g, 'o')
    .replace(/1|!|\|/g, 'i')
    .replace(/3/g, 'e')
    .replace(/5/g, 's')
    .replace(/7/g, 't')
    .replace(/8/g, 'b')
    .replace(/\*/g, '')
    .replace(/[^a-z0-9\s]/g, '') // remove special symbols
    .replace(/(.)\1{2,}/g, '$1$1') // collapse repeated characters like 'chuuumtiya' -> 'chumtiya'
    .trim();
}

/**
 * Check if text contains profane, abusive, or "gali" content.
 * @param {string} text - Text to analyze.
 * @returns {object} { isAbusive: boolean, matchedWord: string|null }
 */
export function containsAbusiveContent(text) {
  if (!text || typeof text !== 'string') return { isAbusive: false, matchedWord: null };

  const rawLower = text.toLowerCase();
  const normalized = normalizeText(text);
  const spaceless = normalized.replace(/\s+/g, '');

  // 1. Check exact word boundaries on raw & normalized text
  for (const word of ABUSIVE_PATTERNS) {
    // Word boundary regex for standard words or abbreviations (e.g. \bbc\b, \bmc\b, \bbsdk\b)
    const pattern = new RegExp(`\\b${word}\\b`, 'i');
    if (pattern.test(rawLower) || pattern.test(normalized)) {
      return { isAbusive: true, matchedWord: word };
    }

    // For longer abusive words (>= 4 chars), check substring match inside spaceless string
    if (word.length >= 4 && spaceless.includes(word)) {
      return { isAbusive: true, matchedWord: word };
    }
  }

  // 2. Check regex anti-evasion spaghetti patterns
  for (const reg of SPAGHETTI_PATTERNS) {
    if (reg.test(text) || reg.test(normalized)) {
      return { isAbusive: true, matchedWord: 'abusive_term' };
    }
  }

  return { isAbusive: false, matchedWord: null };
}

/**
 * Filter and censor profanity by replacing bad words with asterisks.
 * @param {string} text - Input text.
 * @returns {string} Censored text.
 */
export function censorProfanity(text) {
  if (!text || typeof text !== 'string') return '';
  let result = text;

  ABUSIVE_PATTERNS.forEach(word => {
    if (word.length < 3) return; // avoid over-censoring short 2-letter tokens like 'bc' in normal sentences
    const reg = new RegExp(`\\b${word}\\b`, 'gi');
    result = result.replace(reg, '*'.repeat(word.length));
  });

  return result;
}
