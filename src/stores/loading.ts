import { defineStore } from "pinia";

export interface State {
  loading: boolean;
}

export const useLoadingStore = defineStore({
  id: "loading",

  state: (): State => ({
    loading: false,
  }),

  getters: {},

  actions: {
    show(): void {
      this.loading = true;
    },

    hide(): void {
      this.loading = false;
    },
  },
});
