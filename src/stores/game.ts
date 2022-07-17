import { defineStore } from "pinia";
import type { Task } from "@/interfaces/task";
import type { GameProps } from "@/interfaces/gameProps";
import type { Target } from "@/interfaces/target";
import type { Score } from "@/interfaces/score";
import popMp3 from "@/assets/sounds/pop.mp3";
import mistakeMp3 from "@/assets/sounds/mistake.mp3";

const popSound = new Audio(popMp3);
const mistakeSound = new Audio(mistakeMp3);

interface State {
  lvl: number;
  complexity: number;
  adWatching: boolean;
  lose: boolean;
  score: Score;
  itemsAmount: number;
  sound: boolean;
  timer: number;
  timerInterval: number;
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
    complexity: 1,
    adWatching: false,
    lose: false,
    score: {
      current: 0,
      ending: 4,
    },
    itemsAmount: 0,
    sound: localStorage.sound === "true",
    timer: 3,
    timerInterval: 0,
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
    setLvl(lvl: number): void {
      this.lvl = lvl;
    },

    increaseLvl(): void {
      this.lvl++;
    },

    setComplexity(complexity: number): void {
      this.gameProps.time = {
        s: complexity === 2 ? 25 : complexity === 3 ? 20 : 15,
        m: complexity === 2 ? 22 : complexity === 3 ? 17 : 12,
        l: complexity === 2 ? 20 : complexity === 3 ? 15 : 10,
      };
    },

    setLose(value: boolean): void {
      this.lose = value;
    },

    createTask(): void {
      if (this.targets.length) {
        const randIndex = Math.floor(Math.random() * this.targets.length) - 1;

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

    pushTarget(target: Target): void {
      this.targets.push(target);
    },

    removeTarget(id: number): void {
      this.targets.splice(id, 1);
    },

    setScoreEnding(ending: number): void {
      this.score.ending = ending;
    },

    increaseScore(): void {
      this.score.current++;
    },

    setItemsAmount(itemsAmount: number): void {
      this.itemsAmount = itemsAmount;
    },

    decreaseTimer(): void {
      this.timer--;
    },

    setTime(time: number): void {
      this.time = time;
    },

    decreaseTime(): void {
      this.time--;
    },

    generateBlinking(): void {
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

              this.targets[idx].borderColor = generateBorderColor(
                this.lvl,
                this.gameProps.colors,
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

    createTargets(): void {
      const app = document.querySelector("#app") as HTMLElement;

      const screenWidth = app.offsetWidth;
      const screenHeight = app.offsetHeight - 140;

      const complexity = {
        targets: "s",
        time: 15,
        size: 100,
      };

      if ((this.lvl - 1) % 9 < 2) complexity.size = this.gameProps.size.s.min;
      else if ((this.lvl - 1) % 9 < 4)
        complexity.size = this.gameProps.size.m.min;
      else complexity.size = this.gameProps.size.l.min;

      this.itemsAmount =
        ((screenWidth * screenHeight) / complexity.size / complexity.size) *
        0.45;

      if ((this.lvl - 1) % 9 < 3) complexity.time = this.gameProps.time.s;
      else if ((this.lvl - 1) % 9 < 7) complexity.time = this.gameProps.time.m;
      else complexity.time = this.gameProps.time.l;

      if ((this.lvl - 1) % 9 < 4) {
        complexity.targets = "s";
        this.setScoreEnding(this.gameProps.targets.s.min);
      } else if ((this.lvl - 1) % 9 < 8) {
        complexity.targets = "m";
        this.setScoreEnding(this.gameProps.targets.m.min);
      } else {
        complexity.targets = "l";
        this.setScoreEnding(this.gameProps.targets.l.min);
      }

      this.setTime(complexity.time);

      for (let i = 0; i < this.itemsAmount; i++) {
        const x = Math.floor(Math.random() * (screenWidth - complexity.size));
        const y = Math.floor(Math.random() * (screenHeight - complexity.size));
        const figure = generateFigure(this.lvl);
        const figureName = generateFigureName(figure);
        const bgColor = this.gameProps.colors[Math.floor(Math.random() * 4)];
        const bgColorName = generateBgColorName(bgColor);
        const borderColor = generateBorderColor(
          this.lvl,
          this.gameProps.colors,
          bgColor
        );
        const borderColorName = generateBorderColorName(borderColor);

        const border = Math.round(Math.random());

        const target: Target = {
          x,
          y,
          width: complexity.size,
          height: complexity.size,
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
              Math.random() * (screenWidth - complexity.size)
            );
            target.y = Math.floor(
              Math.random() * (screenHeight - complexity.size)
            );
            j--;
          }
        }
        this.pushTarget(target);
      }

      this.generateBlinking();
      this.createTask();
    },

    clickTarget(payload: clickTargetPayload): void {
      // console.log("задание", this.task);
      // console.log("нажато", payload.target);
      if (
        payload.target.bgColorName === this.task.bgColor &&
        payload.target.figureName === this.task.figure
      ) {
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

          if (
            this.score.current === this.score.ending &&
            !this.lose &&
            this.time
          ) {
            this.lvl++;
            if (this.lvl === 73) return;

            this.reset();
            this.createTargets();

            this.timerInterval = setInterval(() => {
              if (this.timer > 0) {
                this.timer--;
              } else {
                clearInterval(this.timerInterval);
              }
            }, 1000);
          }

          if (this.sound) {
            playPopSound();
          }
        } else {
          this.lose = true;
          if (this.sound) {
            playMistakeSound();
          }
        }
      } else {
        this.lose = true;
        if (this.sound) {
          playMistakeSound();
        }
      }
    },

    setTimerInterval(): void {
      // context.state.timerInterval = setInterval(() => {
      //   if (context.state.timer > 0) context.state.timer--;
      //   else {
      //     context.commit("makeTargets");
      //     clearInterval(context.state.timerInterval);
      //   }
      // }, 1000);
    },

    reset(): void {
      this.timer = 3;
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
  let figure;
  if (
    (lvl >= 19 && lvl <= 27) ||
    (lvl >= 37 && lvl <= 45) ||
    (lvl >= 55 && lvl <= 72)
  ) {
    figure = Math.round(Math.random() * 4);
  } else {
    figure = Math.round(Math.random());
  }

  return figure;
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

function generateBorderColor(lvl: number, colors: string[], bgColor: string) {
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
