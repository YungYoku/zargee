import { defineStore } from "pinia";

export interface State {
  tip: string;
  expireTime: number;
  timeout: number;
}

export const useTipStore = defineStore({
  id: "tip",

  state: (): State => ({
    tip: "",
    expireTime: 2000,
    timeout: 0,
  }),

  getters: {},

  actions: {
    update(tip: string) {
      this.reset();

      this.tip = tip;

      this.timeout = setTimeout(() => {
        this.tip = "";
      }, this.expireTime);
    },

    reset() {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.tip = "";
    },
  },
});
