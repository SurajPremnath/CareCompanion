import type {
  SupportedLanguage,
  TranslationDictionary,
} from "./types";

import { en } from "./translations/en";
import { hi } from "./translations/hi";
import { kn } from "./translations/kn";
import { te } from "./translations/te";
import { ml } from "./translations/ml";
import { ta } from "./translations/ta";
import { mr } from "./translations/mr";
import { bn } from "./translations/bn";
import { gu } from "./translations/gu";
import { pa } from "./translations/pa";
import { or } from "./translations/or";
import { as } from "./translations/as";

export const translations: Record<
  SupportedLanguage,
  TranslationDictionary
> = {
  en,
  hi,
  kn,
  te,
  ml,
  ta,
  mr,
  bn,
  gu,
  pa,
  or,
  as,
};

function getTranslationValue(
  dictionary: TranslationDictionary,
  key: string
): string | undefined {

  const parts =
    key.split(".");

  let current:
    | string
    | TranslationDictionary =
    dictionary;

  for (const part of parts) {

    if (
      typeof current === "string" ||
      !(part in current)
    ) {

      return undefined;

    }

    current =
      current[part];

  }

  return typeof current === "string"
    ? current
    : undefined;

}

export function translate(
  language: SupportedLanguage,
  key: string
): string {

  const translatedValue =
    getTranslationValue(
      translations[language],
      key
    );

  if (translatedValue) {

    return translatedValue;

  }

  const englishFallback =
    getTranslationValue(
      translations.en,
      key
    );

  if (englishFallback) {

    return englishFallback;

  }

  return key;

}

export type {
  SupportedLanguage,
  TranslationDictionary,
} from "./types";

export {
  DEFAULT_LANGUAGE,
  LANGUAGE_OPTIONS,
  LANGUAGE_STORAGE_KEY,
} from "./config";