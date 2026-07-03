"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  translate,
} from "@/lib/i18n";

import {
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from "@/lib/i18n/types";


//------------------------------------------------------------
// Context Type
//------------------------------------------------------------

interface LanguageContextValue {

  language: SupportedLanguage;

  setLanguage: (
    language: SupportedLanguage
  ) => void;

  t: (
    key: string
  ) => string;

}


//------------------------------------------------------------
// Context
//------------------------------------------------------------

const LanguageContext =
  createContext<
    LanguageContextValue | undefined
  >(
    undefined
  );


//------------------------------------------------------------
// Helpers
//------------------------------------------------------------

function isSupportedLanguage(
  value: string
): value is SupportedLanguage {

  return (
    SUPPORTED_LANGUAGES as readonly string[]
  ).includes(
    value
  );

}


//------------------------------------------------------------
// Provider
//------------------------------------------------------------

interface LanguageProviderProps {

  children: React.ReactNode;

}

export function LanguageProvider({

  children,

}: LanguageProviderProps) {

  const [
    language,
    setLanguageState,
  ] = useState<SupportedLanguage>(
    DEFAULT_LANGUAGE
  );


  //----------------------------------------------------------
  // Load Stored Language
  //----------------------------------------------------------

  useEffect(() => {

    const storedLanguage =
      window.localStorage.getItem(
        LANGUAGE_STORAGE_KEY
      );

    if (
      storedLanguage &&
      isSupportedLanguage(
        storedLanguage
      )
    ) {

      setLanguageState(
        storedLanguage
      );

    }

  }, []);


  //----------------------------------------------------------
  // Change Language
  //----------------------------------------------------------

  function setLanguage(
    nextLanguage: SupportedLanguage
  ) {

    setLanguageState(
      nextLanguage
    );

    window.localStorage.setItem(
      LANGUAGE_STORAGE_KEY,
      nextLanguage
    );

  }


  //----------------------------------------------------------
  // Translation Function
  //----------------------------------------------------------

  const value =
    useMemo<LanguageContextValue>(
      () => ({

        language,

        setLanguage,

        t: (
          key: string
        ) =>
          translate(
            language,
            key
          ),

      }),
      [
        language
      ]
    );


  //----------------------------------------------------------
  // Render
  //----------------------------------------------------------

  return (

    <LanguageContext.Provider
      value={value}
    >

      {children}

    </LanguageContext.Provider>

  );

}


//------------------------------------------------------------
// Hook
//------------------------------------------------------------

export function useLanguage():
  LanguageContextValue {

  const context =
    useContext(
      LanguageContext
    );

  if (!context) {

    throw new Error(
      "useLanguage must be used within LanguageProvider."
    );

  }

  return context;

}