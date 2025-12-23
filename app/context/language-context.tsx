"use client";

import { Provider as JotaiProvider, useAtom, useSetAtom } from 'jotai';
import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ConfirmationDialog from '../components/confirmation-dialog';
import SimpleLoading from '../components/loading';
import {
  languageActionsAtom,
  isLoading,
  showConfirmation,
  pendingLanguage,
} from '../atoms/language';
import { Language } from '../config/translations';

export function useLanguage() {
  const [state, dispatch] = useAtom(languageActionsAtom);
  
  const setLanguage = async (lang: Language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: lang });
  };

  const toggleLanguage = async () => {
    dispatch({ type: 'TOGGLE_LANGUAGE' });
  };

  return {
    language: state.language,
    t: state.t,
    toggleLanguage,
    setLanguage,
    isLoading: state.isLoading,
  };
}

function LanguageProviderContent({ children }: { children: ReactNode }) {
  const [isCurrentLoading] = useAtom(isLoading);
  const [showConfirmationDialog] = useAtom(showConfirmation);
  const [pendingSelectedLanguage] = useAtom(pendingLanguage);
  const dispatch = useSetAtom(languageActionsAtom);
  const t = useLanguage().t;

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ar")) {
      const updateDocumentLanguage = (lang: Language) => {
        document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
        document.documentElement.setAttribute("lang", lang);
      };
      
      updateDocumentLanguage(savedLanguage);
    }
  }, []);

  const handleConfirm = async () => {
    dispatch({ type: 'CONFIRM_CHANGE' });
  };

  const handleCancel = () => {
    dispatch({ type: 'CANCEL_CHANGE' });
  };

  if (isCurrentLoading) {
    return (
      <SimpleLoading
        fullScreen
        type="spinner"
        text="Changing Language..."
        size="lg"
      />
    );
  }

  return (
    <>
      {children}
      
      {showConfirmationDialog && createPortal(
        <ConfirmationDialog
          isOpen={showConfirmationDialog}
          confirmText={t(`header:switch`)}
          cancelText={t("common:buttons.cancel")}
          title={t("header:switch_language_title")}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          message={
            pendingSelectedLanguage === "ar"
              ? t("header:messageToArabic")
              : t("header:messageToEnglish")
          }
        />,
        document.body
      )}
    </>
  );
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  return (
    <JotaiProvider>
      <LanguageProviderContent>
        {children}
      </LanguageProviderContent>
    </JotaiProvider>
  );
}