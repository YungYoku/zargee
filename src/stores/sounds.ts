import { defineStore } from "pinia";
import bgMp3 from "@/assets/sounds/bg.mp3";
import popMp3 from "@/assets/sounds/pop.mp3";
import mistakeMp3 from "@/assets/sounds/mistake.mp3";

interface State {
  bgMusic: HTMLAudioElement;
  popSound: HTMLAudioElement;
  mistakeSound: HTMLAudioElement;
}

export const useSoundsStore = defineStore({
  id: "sounds",

  state: (): State => ({
    bgMusic: new Audio(bgMp3),
    popSound: new Audio(popMp3),
    mistakeSound: new Audio(mistakeMp3),
  }),

  getters: {},

  actions: {
    playBgMusic() {
      this.bgMusic.volume = 0.5;
      this.bgMusic.play().then(() => {
        return;
      });
    },

    stopBgMusic() {
      this.bgMusic.pause();
      //this.bgMusic.currentTime = 0;
    },

    playPopSound() {
      this.popSound.play().then(() => {
        return;
      });
    },

    playMistakeSound() {
      this.mistakeSound.play().then(() => {
        return;
      });
    },
  },
});
