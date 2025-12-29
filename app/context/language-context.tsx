"use client";

import { ReactNode, useEffect } from "react";
import ConfirmationDialog from "../components/confirmation-dialog";
import SimpleLoading from "../components/loading";
import { useLanguageStore } from "../zustand/language";

export function useLanguage() {
  const language = useLanguageStore.useLanguage();
  const t = useLanguageStore.useT();
  const toggleLanguage = useLanguageStore.useToggleLanguage();
  const isLoading = useLanguageStore.useIsLoading();
  return {
    language,
    t,
    toggleLanguage,
    isLoading,
  };
}

function LanguageProviderContent({ children }: { children: ReactNode }) {
  const {
    isInitializing,
    isLoading,
    showConfirmation,
    pendingLanguage,
    t,
    finishInit,
    confirmChange,
    cancelChange,
  } = useLanguageStore();

  useEffect(() => {
    finishInit();
  }, [finishInit]);

  if (isLoading || isInitializing) {
    return <SimpleLoading type="skeleton" />;
  }

  return (
    <>
      {children}

      {showConfirmation && (
        <ConfirmationDialog
          isOpen={showConfirmation}
          confirmText={t(`header:switch`)}
          cancelText={t("common:buttons.cancel")}
          title={t("header:switch_language_title")}
          onConfirm={confirmChange}
          onCancel={cancelChange}
          message={
            pendingLanguage === "ar"
              ? t("header:messageToArabic")
              : t("header:messageToEnglish")
          }
        />
      )}
    </>
  );
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  return <LanguageProviderContent>{children}</LanguageProviderContent>;
}
