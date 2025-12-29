import { create } from "zustand";
import {
  translations,
  type Language,
  type TranslationNamespace,
} from "../config/translations";
import { createSelectorHooks } from "auto-zustand-selectors-hook";

type LanguageState = {
  language: Language;
  isInitializing: boolean;
  isLoading: boolean;
  showConfirmation: boolean;
  pendingLanguage: Language | null;

  t: (key: string, params?: Record<string, any>) => string;

  toggleLanguage: () => void;
  cancelChange: () => void;
  confirmChange: () => Promise<void>;
  finishInit: () => Promise<void>;
};

const getInitialLanguage = (): Language => {
  if (typeof window === "undefined") return "en";
  const saved = localStorage.getItem("language");
  return saved === "en" || saved === "ar" ? saved : "en";
};

const applyDocumentLanguage = (lang: Language) => {
  document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  document.documentElement.setAttribute("lang", lang);
};

export const _useLanguageStore = create<LanguageState>((set, get) => {
  const initialLanguage = getInitialLanguage();

  if (typeof window !== "undefined") {
    applyDocumentLanguage(initialLanguage);
  }

  return {
    language: initialLanguage,
    isInitializing: true,
    isLoading: false,
    showConfirmation: false,
    pendingLanguage: null,

    t: (key, params) => {
      const language = get().language;

      const [namespace, ...pathParts] = key.split(":");
      if (!pathParts.length) return key;

      const path = pathParts.join(":").split(".");
      const langTranslations = translations[language];
      const namespaceTranslations =
        langTranslations[namespace as TranslationNamespace];

      if (!namespaceTranslations) return key;

      let value: any = namespaceTranslations;

      for (const k of path) {
        if (value && typeof value === "object" && k in value) {
          value = value[k];
        } else {
          return key;
        }
      }

      if (typeof value !== "string") return key;

      if (params) {
        return value.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (match, p) => {
          return (
            p.split(".").reduce((acc: any, k: any) => acc?.[k], params) ?? match
          );
        });
      }

      return value;
    },

    toggleLanguage: () => {
      const current = get().language;
      set({
        pendingLanguage: current === "en" ? "ar" : "en",
        showConfirmation: true,
      });
    },

    cancelChange: () => {
      set({ showConfirmation: false, pendingLanguage: null });
    },

    confirmChange: async () => {
      const pending = get().pendingLanguage;
      if (!pending) return;

      set({ isLoading: true, showConfirmation: false });

      await new Promise((r) => setTimeout(r, 400));

      localStorage.setItem("language", pending);
      applyDocumentLanguage(pending);

      set({
        language: pending,
        isLoading: false,
        pendingLanguage: null,
      });
    },

    finishInit: async () => {
      await new Promise((r) => setTimeout(r, 400));
      set({ isInitializing: false });
    },
  };
});

export const useLanguageStore = createSelectorHooks(_useLanguageStore);
