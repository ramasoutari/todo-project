import { atom } from 'jotai';
import { translations, type Language, type TranslationNamespace } from '../config/translations';

// Helper function to safely access localStorage
const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en'; // SSR fallback
  
  const saved = localStorage.getItem("language");
  return (saved === 'en' || saved === 'ar') ? saved : 'en';
};

export const currentlanguage = atom<Language>(getInitialLanguage());
export const isLoading = atom(false);
export const showConfirmation = atom(false);
export const pendingLanguage = atom<Language | null>(null);

export const t = atom((get) => {
  const language = get(currentlanguage);
  
  return (key: string): string => {
    const [namespace, ...pathParts] = key.split(":");

    if (!pathParts.length) {
      console.warn(
        `Translation key "${key}" is missing namespace. Use format "namespace:key"`
      );
      return key;
    }

    const path = pathParts.join(":");
    const keys = path.split(".");

    // Type-safe access to translations
    const langTranslations = translations[language];
    const namespaceTranslations = langTranslations[namespace as TranslationNamespace];

    if (!namespaceTranslations) {
      console.warn(`Namespace "${namespace}" not found for language: ${language}`);
      return key;
    }

    let value: any = namespaceTranslations;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation not found: ${key} for language: ${language}`);
        return key;
      }
    }

    return typeof value === "string" ? value : key;
  };
});

export const languageActionsAtom = atom(
  (get) => {
    return {
      language: get(currentlanguage),
      isLoading: get(isLoading),
      t: get(t),
    };
  },
  (get, set, action: {
    type: 'SET_LANGUAGE' | 'TOGGLE_LANGUAGE' | 'SHOW_CONFIRMATION' | 'CANCEL_CHANGE' | 'CONFIRM_CHANGE';
    payload?: any;
  }) => {
    const updateDocumentLanguage = (lang: Language) => {
      document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
      document.documentElement.setAttribute("lang", lang);
    };

    const changeLanguageWithLoading = async (lang: Language) => {
      set(isLoading, true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      set(currentlanguage, lang);
      localStorage.setItem("language", lang);
      updateDocumentLanguage(lang);
      set(isLoading, false);
    };

    switch (action.type) {
      case 'SET_LANGUAGE':
        const newLang = action.payload as Language;
        if (get(currentlanguage) === newLang) return;
        
        set(pendingLanguage, newLang);
        set(showConfirmation, true);
        break;

      case 'TOGGLE_LANGUAGE':
        const currentLang = get(currentlanguage);
        const toggledLang = currentLang === "en" ? "ar" : "en";
        
        set(pendingLanguage, toggledLang);
        set(showConfirmation, true);
        break;

      case 'SHOW_CONFIRMATION':
        set(showConfirmation, action.payload);
        break;

      case 'CANCEL_CHANGE':
        set(showConfirmation, false);
        set(pendingLanguage, null);
        break;

      case 'CONFIRM_CHANGE':
        const pendingLang = get(pendingLanguage);
        if (!pendingLang) return;
        
        set(showConfirmation, false);
        changeLanguageWithLoading(pendingLang);
        set(pendingLanguage, null);
        break;
    }
  }
);