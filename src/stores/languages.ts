import type { Language } from "@/api/languages";
import { en, ru } from "@/api/languages";
import { defineStore } from "pinia";

interface State {
  language: Language;
  languages: string[];
  currentLanguage: string;
  en: Language;
  ru: Language;

  [key: string]: any;
}

export const useLanguagesStore = defineStore({
  id: "languages",

  state: (): State => ({
    language: {} as Language,
    languages: ["en", "ru"],
    currentLanguage: "en",
    en,
    ru,
  }),

  getters: {},

  actions: {
    swapLanguage(language: string): void {
      this.currentLanguage = language;
      this.language = this[language];
    },
  },
});
