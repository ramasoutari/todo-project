"use client";

import { Provider as JotaiProvider, useAtom } from "jotai";
import { ReactNode, useEffect } from "react";
import ConfirmationDialog from "../components/confirmation-dialog";
import SimpleLoading from "../components/loading";
import {
  languageActionsAtom,
  isLoading,
  showConfirmation,
  pendingLanguage,
} from "../atoms/language-atom";

export function useLanguage() {
  const [state, dispatch] = useAtom(languageActionsAtom);

  const toggleLanguage = async () => {
    dispatch({ type: "TOGGLE_LANGUAGE" });
  };

  return {
    language: state.language,
    t: state.t,
    toggleLanguage,
    isLoading: state.isLoading,
  };
}

function LanguageProviderContent({ children }: { children: ReactNode }) {
  const [isCurrentLoading] = useAtom(isLoading);
  const [showConfirmationDialog] = useAtom(showConfirmation);
  const [pendingSelectedLanguage] = useAtom(pendingLanguage);
  const [{ isInitializing }, dispatch] = useAtom(languageActionsAtom);

  const t = useLanguage().t;

  useEffect(() => {
    dispatch({ type: "FINISH_INIT" });
  }, [dispatch]);

  const handleConfirm = async () => {
    dispatch({ type: "CONFIRM_CHANGE" });
  };

  const handleCancel = () => {
    dispatch({ type: "CANCEL_CHANGE" });
  };

  if (isCurrentLoading || isInitializing) {
    return <SimpleLoading type="skeleton" />;
  }

  return (
    <>
      {children}

      {showConfirmationDialog && (
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
        />
      )}
    </>
  );
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  return (
    <JotaiProvider>
      <LanguageProviderContent>{children}</LanguageProviderContent>
    </JotaiProvider>
  );
}
