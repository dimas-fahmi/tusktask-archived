import { parseDate } from "chrono-node";
import { NLP_INDONESIAN_RULE } from "../configs/parserReplacer/indonesians";
import { type ReplacementRules, replaceMultiple } from "./replaceMultiple";

export const REGISTERED_RULES: ReplacementRules = [...NLP_INDONESIAN_RULE];

export const naturalLanguageDateParser = (text?: string) => {
  if (!text) return { translatedText: null, date: null };

  const translatedText = replaceMultiple(text, REGISTERED_RULES, false);

  return {
    translatedText,
    date: parseDate(translatedText),
  };
};
