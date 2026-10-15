import type {
  SupportedLanguage,
} from "./types";

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
}

export const DEFAULT_LANGUAGE: SupportedLanguage =
  "en";

export const LANGUAGE_STORAGE_KEY =
  "carevr-language";

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    code: "en",
    label: "English",
    nativeLabel: "English",
  },
  {
    code: "hi",
    label: "Hindi",
    nativeLabel: "हिन्दी",
  },
  {
    code: "kn",
    label: "Kannada",
    nativeLabel: "ಕನ್ನಡ",
  },
  {
    code: "te",
    label: "Telugu",
    nativeLabel: "తెలుగు",
  },
  {
    code: "ml",
    label: "Malayalam",
    nativeLabel: "മലയാളം",
  },
  {
    code: "ta",
    label: "Tamil",
    nativeLabel: "தமிழ்",
  },
  {
    code: "mr",
    label: "Marathi",
    nativeLabel: "मराठी",
  },
  {
    code: "bn",
    label: "Bengali",
    nativeLabel: "বাংলা",
  },
{
  code: "gu",
  label: "Gujarati",
  nativeLabel: "ગુજરાતી",
},
{
  code: "pa",
  label: "Punjabi",
  nativeLabel: "ਪੰਜਾਬੀ",
},
{
  code: "or",
  label: "Odia",
  nativeLabel: "ଓଡ଼ିଆ",
},
{
  code: "as",
  label: "Assamese",
  nativeLabel: "অসমীয়া",
},
];