export const SUPPORTED_LANGUAGES = [
  "en",
  "hi",
  "kn",
  "te",
  "ml",
  "ta",
  "mr",
  "bn",
] as const;

export type SupportedLanguage =
  (typeof SUPPORTED_LANGUAGES)[number];

export type TranslationDictionary = {
  [key: string]:
    | string
    | TranslationDictionary;
};