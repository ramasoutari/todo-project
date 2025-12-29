import { atom } from "jotai";
import {
  translations,
  type Language,
  type TranslationNamespace,
} from "../config/translations";

const getInitialLanguage = (): Language => {
  if (typeof window === "undefined") return "en";

  const saved = localStorage.getItem("language");
  return saved === "en" || saved === "ar" ? saved : "en";
};

const initializeLanguage = (): Language => {
  const lang = getInitialLanguage();

  if (typeof window !== "undefined") {
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", lang);
  }

  return lang;
};

export const currentlanguage = atom<Language>(initializeLanguage());
export const isInitializing = atom(true); 
export const isLoading = atom(false);
export const showConfirmation = atom(false);
export const pendingLanguage = atom<Language | null>(null);

export const t = atom((get) => {
  const language = get(currentlanguage);

  return (key: string, params?: Record<string, any>): string => {
    const [namespace, ...pathParts] = key.split(":");

    if (!pathParts.length) {
      return key;
    }

    const path = pathParts.join(":");
    const keys = path.split(".");

    const langTranslations = translations[language];
    const namespaceTranslations =
      langTranslations[namespace as TranslationNamespace];

    if (!namespaceTranslations) {
      return key;
    }

    let value: any = namespaceTranslations;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }

    if (typeof value !== "string") return key;

    if (params) {
      return value.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (match, path) => {
        const pathKeys = path.split(".");
        let result: any = params;

        for (const pk of pathKeys) {
          result = result?.[pk];
        }

        return result !== undefined ? String(result) : match;
      });
    }

    return value;
  };
});

export const languageActionsAtom = atom(
  (get) => {
    return {
      language: get(currentlanguage),
      isInitializing: get(isInitializing),
      isLoading: get(isLoading),
      t: get(t),
    };
  },
  (
    get,
    set,
    action: {
      type:
        | "TOGGLE_LANGUAGE"
        | "CANCEL_CHANGE"
        | "CONFIRM_CHANGE"
        | "FINISH_INIT";
    }
  ) => {
    const updateDocumentLanguage = (lang: Language) => {
      document.documentElement.setAttribute(
        "dir",
        lang === "ar" ? "rtl" : "ltr"
      );
      document.documentElement.setAttribute("lang", lang);
    };

    const changeLanguageWithLoading = async (lang: Language) => {
      set(isLoading, true);
      await new Promise((resolve) => setTimeout(resolve, 400));
      set(currentlanguage, lang);
      localStorage.setItem("language", lang);
      updateDocumentLanguage(lang);
      set(isLoading, false);
    };

    const finishInitWithDelay = async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      set(isInitializing, false);
    };

    switch (action.type) {
      case "FINISH_INIT":
        finishInitWithDelay();
        break;

      case "TOGGLE_LANGUAGE":
        const currentLang = get(currentlanguage);
        const toggledLang = currentLang === "en" ? "ar" : "en";

        set(pendingLanguage, toggledLang);
        set(showConfirmation, true);
        break;

      case "CANCEL_CHANGE":
        set(showConfirmation, false);
        set(pendingLanguage, null);
        break;

      case "CONFIRM_CHANGE":
        const pendingLang = get(pendingLanguage);
        if (!pendingLang) return;

        set(showConfirmation, false);
        changeLanguageWithLoading(pendingLang);
        set(pendingLanguage, null);
        break;
    }
  }
);
