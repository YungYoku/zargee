import { defineStore } from "pinia";

export interface State {
  complexity: number;
  isMusicPlayable: boolean;
  isMusicChangeable: boolean;
}

export const useSettingsStore = defineStore({
  id: "settings",

  state: (): State => ({
    complexity: 1,
    isMusicPlayable: false,
    isMusicChangeable: false,
  }),

  getters: {},

  actions: {
    resetIsMusicPlayable() {
      localStorage["isMusicPlayable"] = false;
      this.isMusicPlayable = false;
    },

    updateIsMusicPlayable() {
      const LocalStorageIsMusicPlayable = localStorage["isMusicPlayable"];

      if (LocalStorageIsMusicPlayable) {
        if (LocalStorageIsMusicPlayable === "true") {
          this.isMusicPlayable = true;
        } else if (LocalStorageIsMusicPlayable === "false") {
          this.isMusicPlayable = false;
        } else {
          this.resetIsMusicPlayable();
        }
      } else {
        this.resetIsMusicPlayable();
      }
    },

    resetIsMusicChangeable() {
      localStorage["isMusicChangeable"] = false;
      this.isMusicChangeable = false;
    },

    updateIsMusicChangeable() {
      const LocalStorageIsMusicChangeable = localStorage["isMusicChangeable"];

      if (LocalStorageIsMusicChangeable) {
        if (LocalStorageIsMusicChangeable === "true") {
          this.isMusicChangeable = true;
        } else if (LocalStorageIsMusicChangeable === "false") {
          this.isMusicChangeable = false;
        } else {
          this.resetIsMusicChangeable();
        }
      } else {
        this.resetIsMusicChangeable();
      }
    },

    updateSoundSettings() {
      this.updateIsMusicPlayable();
      this.updateIsMusicChangeable();
    },

    updateComplexitySettings() {
      const LocalStorageComplexity = parseInt(localStorage["complexity"]);

      if (
        LocalStorageComplexity &&
        LocalStorageComplexity > 0 &&
        LocalStorageComplexity < 5
      ) {
        this.complexity = LocalStorageComplexity;
      } else {
        localStorage["complexity"] = "1";
        this.complexity = 1;
      }
    },

    setComplexity(complexity: number) {
      this.complexity = complexity;
      localStorage["complexity"] = complexity;
    },

    updateSettings() {
      this.updateSoundSettings();

      this.updateComplexitySettings();
    },

    swapSound() {
      this.isMusicPlayable = !this.isMusicPlayable;
      this.isMusicChangeable = this.isMusicPlayable;

      localStorage["isMusicPlayable"] = this.isMusicPlayable;
      localStorage["isMusicChangeable"] = this.isMusicChangeable;
    },

    offSound() {
      if (this.isMusicChangeable) {
        this.isMusicPlayable = false;
      }
    },

    onSound() {
      if (this.isMusicChangeable) {
        this.isMusicPlayable = true;
      }
    },
  },
});
