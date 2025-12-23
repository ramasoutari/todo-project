import commonEN from '../locales/en/common.json';
import headerEN from '../locales/en/header.json';
import columnEN from '../locales/en/column.json';
import tasksEN from '../locales/en/tasks.json';

import commonAR from '../locales/ar/common.json';
import headerAR from '../locales/ar/header.json';
import columnAR from '../locales/ar/column.json';
import tasksAR from '../locales/ar/tasks.json';

export type Language = "en" | "ar";
export type TranslationNamespace = "common" | "header" | "column" | "tasks";

export const translations = {
  en: {
    common: commonEN,
    header: headerEN,
    column: columnEN,
    tasks: tasksEN,
  },
  ar: {
    common: commonAR,
    header: headerAR,
    column: columnAR,
    tasks: tasksAR,
  },
} as const;

