import { defineStore } from "pinia";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/main";
import { useMainStore } from "@/stores/main";

interface Color {
  color: string;
  allValue: number;
  userValue: number;
}

interface Figure {
  figure: string;
  allValue: number;
  userValue: number;
}

interface ColorStat {
  [key: string]: {
    color: string;
    failure: number;
    success: number;
  };
}

interface FigureStat {
  [key: string]: {
    figure: string;
    failure: number;
    success: number;
  };
}

interface State {
  allStatistics: {
    colors: ColorStat;
    figures: FigureStat;
  };
  userStatistics: {
    colors: ColorStat;
    figures: FigureStat;
  };
}

export const useStatisticsStore = defineStore({
  id: "statistics",

  state: (): State => ({
    allStatistics: {
      colors: {},
      figures: {},
    },
    userStatistics: {
      colors: {},
      figures: {},
    },
  }),

  getters: {
    statistics(state) {
      const statistics = {
        colors: [] as Array<Color>,
        figures: [] as Array<Figure>,
      };

      const colorKeys = Object.keys(state.allStatistics.colors);
      colorKeys.forEach((key) => {
        statistics.colors.push(state.calculateColor(key));
      });

      const figuresKeys = Object.keys(state.allStatistics.figures);
      figuresKeys.forEach((key) => {
        statistics.figures.push(state.calculateFigure(key));
      });
      console.log(statistics);
      return statistics;
    },
  },

  actions: {
    calculateColor(key: string) {
      let allValue = 0;
      const allValueFailure = this.allStatistics.colors[key].failure;
      if (allValueFailure) {
        const allValueSuccess = this.allStatistics.colors[key].success;
        allValue = allValueSuccess / allValueFailure;
      }

      let userValue = 0;
      const userValueFailure = this.userStatistics.colors[key].failure;
      if (userValueFailure) {
        const userValueSuccess = this.userStatistics.colors[key].success;
        userValue = userValueSuccess / userValueFailure;
      }

      return {
        color: key,
        allValue,
        userValue,
      };
    },

    calculateFigure(key: string) {
      let allValue = 0;
      const allValueFailure = this.allStatistics.figures[key].failure;
      if (allValueFailure) {
        const allValueSuccess = this.allStatistics.figures[key].success;
        allValue = allValueSuccess / allValueFailure;
      }

      let userValue = 0;
      const userValueFailure = this.userStatistics.figures[key].failure;
      if (userValueFailure) {
        const userValueSuccess = this.userStatistics.figures[key].success;
        userValue = userValueSuccess / userValueFailure;
      }

      return {
        figure: key,
        allValue,
        userValue,
      };
    },

    async loadGlobalSStatistics() {
      const ref = doc(db, "statistics", "statistics");
      const snap = await getDoc(ref);

      if (snap.exists()) {
        this.allStatistics = snap.data();
      } else {
        console.log("No such document!");
      }
    },

    updateUserSStatistics() {
      const main = useMainStore();
      this.userStatistics = {
        figures: main.user.figures,
        colors: main.user.colors,
      };
    },

    async loadAllStatistics() {
      this.updateUserSStatistics();
      await this.loadGlobalSStatistics();
    },
  },
});
