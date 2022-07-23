import { defineStore } from "pinia";
import type { Task } from "@/interfaces/task";
import type { GameProps } from "@/interfaces/gameProps";
import type { Target } from "@/interfaces/target";
import type { Score } from "@/interfaces/score";
import popMp3 from "@/assets/sounds/pop.mp3";
import mistakeMp3 from "@/assets/sounds/mistake.mp3";
import { useMainStore } from "@/stores/main";

const popSound = new Audio(popMp3);
const mistakeSound = new Audio(mistakeMp3);

interface Complexity {
  targets: string;
  time: number;
  size: number;
}

interface State {
  lvl: number;
  complexity: Complexity;
  adWatching: boolean;
  lose: boolean;
  score: Score;
  itemsAmount: number;
  time: number;
  gameProps: GameProps;
  task: Task;
  targets: Target[];
}

interface clickTargetPayload {
  target: Target;
  id: number;
}

export const useGameStore = defineStore({
  id: "game",

  state: (): State => ({
    lvl: 1,
    complexity: {
      targets: "",
      time: 0,
      size: 0,
    },
    adWatching: false,
    lose: false,
    score: {
      current: 0,
      ending: 4,
    },
    itemsAmount: 0,
    time: 15,
    gameProps: {
      colors: ["#1a1a1a", "#ff3a3a", "#3aff3a", "#3a3aff", "#FFA53a"],
      speed: {
        s: 1,
        m: 2,
        l: 3,
      },
      size: {
        s: {
          min: 100,
          max: 150,
        },
        m: {
          min: 75,
          max: 100,
        },
        l: {
          min: 50,
          max: 75,
        },
      },
      time: {
        s: 25,
        m: 22,
        l: 20,
      },
      targets: {
        s: {
          min: 4,
          max: 5,
        },
        m: {
          min: 6,
          max: 7,
        },
        l: {
          min: 8,
          max: 9,
        },
      },
      figures: {
        0: "circle(50% at 50% 50%)",
        1: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
        2: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
        3: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
        4: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
      },
      blink: 0.2,
    },
    task: {
      title: {
        0: "Нажмите на",
        1: "",
        2: "",
        3: ", с",
        4: "",
        5: "обводкой",
      },
      figure: "",
      bgColor: "",
      borderColor: "",
      figureFakeColor: "",
      borderFakeColor: "",
    },
    targets: [],
  }),

  getters: {},

  actions: {
    setLvl(lvl: number) {
      this.lvl = lvl;
    },

    increaseLvl() {
      this.lvl++;
    },

    setComplexity(complexity: number) {
      this.gameProps.time = {
        s: complexity === 2 ? 25 : complexity === 3 ? 20 : 15,
        m: complexity === 2 ? 22 : complexity === 3 ? 17 : 12,
        l: complexity === 2 ? 20 : complexity === 3 ? 15 : 10,
      };
    },

    setLose(value: boolean) {
      this.lose = value;
    },

    createTask() {
      if (this.targets.length) {
        const randIndex = Math.floor(Math.random() * (this.targets.length - 1));

        this.task.figureFakeColor = this.gameProps.colors[randIndex % 5];
        this.task.borderFakeColor = this.gameProps.colors[randIndex % 5];
        this.task.bgColor = this.targets[randIndex].bgColorName;
        this.task.figure = this.targets[randIndex].figureName;
        this.task.title[1] = this.task.bgColor;
        this.task.title[2] = this.task.figure;
        if (
          (this.lvl >= 10 && this.lvl <= 18) ||
          (this.lvl >= 37 && this.lvl <= 54) ||
          (this.lvl >= 64 && this.lvl <= 72)
        ) {
          const borderColorName = this.targets[randIndex].borderColorName;

          if (borderColorName !== "transparent") {
            this.task.borderColor = borderColorName;
            this.task.title[4] = borderColorName;
          } else {
            this.task.borderColor = "transparent";
          }
        }
      }
    },

    pushTarget(target: Target) {
      this.targets.push(target);
    },

    removeTarget(id: number) {
      this.targets.splice(id, 1);
    },

    updateScoreLimit() {
      const complexity = this.complexity.targets;

      if (complexity === "s") {
        this.score.ending = this.gameProps.targets.s.min;
      } else if (complexity === "m") {
        this.score.ending = this.gameProps.targets.m.min;
      } else if (complexity === "l") {
        this.score.ending = this.gameProps.targets.l.min;
      }
    },

    increaseScore() {
      this.score.current++;
    },

    setItemsAmount(itemsAmount: number) {
      this.itemsAmount = itemsAmount;
    },

    updateTime() {
      this.time = this.complexity.time;
    },

    decreaseTime() {
      this.time--;
    },

    generateBorderColor(bgColor: string) {
      const lvl = this.lvl;
      const colors = this.gameProps.colors;
      let borderColor = "transparent";

      if (
        (lvl >= 10 && lvl <= 18) ||
        (lvl >= 37 && lvl <= 54) ||
        (lvl >= 64 && lvl <= 72)
      ) {
        borderColor = colors[Math.round(Math.random() * 4)];
      }

      while (bgColor === borderColor) {
        borderColor = colors[Math.round(Math.random() * 4)];
      }

      return borderColor;
    },

    generateBlinking() {
      this.targets.forEach((el) => (el.blink = false));
      const amount = Math.floor(
        Math.random() * this.targets.length * this.gameProps.blink
      );
      for (let i = 0; i < amount; i++) {
        if (
          (this.lvl >= 28 && this.lvl <= 36) ||
          (this.lvl >= 46 && this.lvl <= 72)
        ) {
          const idx = Math.floor(
            Math.random() * (this.targets.length - this.score.current)
          );

          if (!this.targets[idx]) continue;

          this.targets[idx].blink = true;
          this.targets[idx].blinkDelay = Math.floor(Math.random() * 4) + 1;
          setTimeout(() => {
            if (this.targets[idx]) {
              this.targets[idx].bgColor =
                this.gameProps.colors[Math.round(Math.random() * 4)];
              this.targets[idx].bgColorName = generateBgColorName(
                this.targets[idx].bgColor
              );
              this.targets[idx].figure = generateFigure(this.lvl);
              this.targets[idx].figureName = generateFigureName(
                this.targets[idx].figure
              );
              this.targets[idx].d =
                this.gameProps.figures[this.targets[idx].figure];

              this.targets[idx].borderColor = this.generateBorderColor(
                this.targets[idx].bgColor
              );
              this.targets[idx].borderColorName = generateBorderColorName(
                this.targets[idx].borderColor
              );
            }
          }, this.targets[idx].blinkDelay * 1000 + 4000);
        }
      }
    },

    getComplexitySize() {
      const lvl = this.lvl - 1;

      if (lvl % 9 < 2) {
        return this.gameProps.size.s.min;
      }
      if (lvl % 9 < 4) {
        return this.gameProps.size.m.min;
      }
      return this.gameProps.size.l.min;
    },

    getComplexityTime() {
      const lvl = this.lvl - 1;

      if (lvl % 9 < 3) {
        return this.gameProps.time.s;
      }
      if (lvl % 9 < 7) {
        return this.gameProps.time.m;
      }
      return this.gameProps.time.l;
    },

    getComplexityTargets() {
      const lvl = this.lvl - 1;

      if (lvl % 9 < 4) {
        return "s";
      }
      if (lvl % 9 < 8) {
        return "m";
      }
      return "l";
    },

    updateComplexity() {
      this.complexity = {
        targets: this.getComplexityTargets(),
        time: this.getComplexityTime(),
        size: this.getComplexitySize(),
      };
    },

    updateItemsAmount(screenWidth: number, screenHeight: number) {
      this.itemsAmount = Math.floor(
        ((screenWidth * screenHeight) /
          this.complexity.size /
          this.complexity.size) *
          0.45
      );
    },

    createTargets() {
      const app = document.querySelector("#app") as HTMLElement;
      const screenWidth = app.offsetWidth;
      const screenHeight = app.offsetHeight - 140;

      this.updateComplexity();
      this.updateItemsAmount(screenWidth, screenHeight);
      this.updateScoreLimit();
      this.updateTime();

      for (let i = 0; i < this.itemsAmount; i++) {
        const x = Math.floor(
          Math.random() * (screenWidth - this.complexity.size)
        );
        const y = Math.floor(
          Math.random() * (screenHeight - this.complexity.size)
        );
        const figure = generateFigure(this.lvl);
        const figureName = generateFigureName(figure);
        const bgColor = this.gameProps.colors[Math.floor(Math.random() * 4)];
        const bgColorName = generateBgColorName(bgColor);
        const borderColor = this.generateBorderColor(bgColor);
        const borderColorName = generateBorderColorName(borderColor);

        const border = Math.round(Math.random());

        const target: Target = {
          x,
          y,
          width: this.complexity.size,
          height: this.complexity.size,
          d: this.gameProps.figures[figure],
          figure,
          figureName,
          bgColor,
          bgColorName,
          border,
          borderExists: !!border,
          borderColor,
          borderColorName,
          blink: false,
          blinkDelay: 0,
        };

        for (let j = 0; j < this.targets.length; j++) {
          if (
            Math.abs(this.targets[j].x - target.x) < 30 ||
            Math.abs(this.targets[j].y - target.y) < 30
          ) {
            target.x = Math.floor(
              Math.random() * (screenWidth - this.complexity.size)
            );
            target.y = Math.floor(
              Math.random() * (screenHeight - this.complexity.size)
            );
            j--;
          }
        }
        this.pushTarget(target);
      }

      this.generateBlinking();
      this.createTask();
    },

    isLevelCompleted() {
      return (
        this.score.current === this.score.ending && !this.lose && this.time
      );
    },

    isTargetClicked(payload: clickTargetPayload) {
      const mainStore = useMainStore();

      if (
        payload.target.bgColorName === this.task.bgColor &&
        payload.target.figureName === this.task.figure
      ) {
        return true;
      } else {
        if (mainStore.isMusicPlayable) {
          playMistakeSound();
        }

        return false;
      }
    },

    handleTargetClick(payload: clickTargetPayload) {
      const mainStore = useMainStore();

      if (
        (payload.target.borderColor !== "transparent" &&
          payload.target.borderColorName === this.task.borderColor) ||
        payload.target.borderColor === "transparent"
      ) {
        this.targets.splice(payload.id, 1);
        this.score.current++;

        if (this.score.current !== this.score.ending) {
          this.createTask();
        }

        if (this.isLevelCompleted()) {
          this.lvl++;
          if (this.lvl === 73) return;

          this.reset();
          this.createTargets();
        }

        if (mainStore.isMusicPlayable) {
          playPopSound();
        }
      } else {
        this.lose = true;

        if (mainStore.isMusicPlayable) {
          playMistakeSound();
        }
      }
    },

    reset(): void {
      this.time = 15;
      this.score.current = 0;
      this.lose = false;
      this.targets = [];
      // this.timeKick = 10;
      this.task = {
        title: {
          0: "Нажмите на",
          1: "",
          2: "",
          3: ", с",
          4: "",
          5: "обводкой",
        },
        figure: "",
        bgColor: "",
        borderColor: "",
        figureFakeColor: "",
        borderFakeColor: "",
      };
    },
  },
});

function playPopSound() {
  popSound.play().then(() => {
    return;
  });
}

function playMistakeSound() {
  mistakeSound.play().then(() => {
    return;
  });
}

function generateFigure(lvl: number) {
  if (
    (lvl >= 19 && lvl <= 27) ||
    (lvl >= 37 && lvl <= 45) ||
    (lvl >= 55 && lvl <= 72)
  ) {
    return Math.round(Math.random() * 4);
  }

  return Math.round(Math.random());
}

function generateFigureName(figure: number) {
  switch (figure) {
    case 0:
      return "круг";
    case 1:
      return "квадрат";
    case 2:
      return "пятиугольник";
    case 3:
      return "восьмиугольник";
    case 4:
      return "шестиугольник";
    default:
      return "";
  }
}

function generateBorderColorName(borderColor: string) {
  switch (borderColor) {
    case "#1a1a1a":
      return "чёрной";
    case "#ff3a3a":
      return "красной";
    case "#3aff3a":
      return "зелёной";
    case "#3a3aff":
      return "синей";
    case "#FFA53a":
      return "оранжевой";
    default:
      return "transparent";
  }
}

function generateBgColorName(bgColor: string) {
  switch (bgColor) {
    case "#1a1a1a":
      return "чёрный";
    case "#ff3a3a":
      return "красный";
    case "#3aff3a":
      return "зелёный";
    case "#3a3aff":
      return "синий";
    case "#FFA53a":
      return "оранжевый";
    default:
      return "transparent";
  }
}
