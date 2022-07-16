import { defineStore } from "pinia";

export interface State {
  tip: string;
  expireTime: number;
}

export const useTipStore = defineStore({
  id: "tip",

  state: (): State => ({
    tip: "",
    expireTime: 2000,
  }),

  getters: {},

  actions: {
    update(tip: string) {
      this.tip = tip;

      setTimeout(() => {
        this.tip = "";
      }, this.expireTime);
    },
  },
});
