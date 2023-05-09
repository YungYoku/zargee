import { defineStore } from "pinia";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/main";

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

interface Stat {
  [key: string]: {
    failure: number;
    success: number;
  };
}

interface State {
  allStatistics: {
    colors: Stat;
    figures: Stat;
  };
  userStatistics: {
    colors: Stat;
    figures: Stat;
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
      const keys = Object.keys(state.allStatistics.colors);
      keys.forEach((key) => {
        statistics.colors.push({
          color: key,
          allValue:
            state.allStatistics.colors[key].success /
            state.allStatistics.colors[key].failure,
          userValue:
            state.userStatistics.colors[key].success /
            state.userStatistics.colors[key].failure,
        });
      });
      keys.forEach((key) => {
        statistics.figures.push({
          figure: key,
          allValue:
            state.allStatistics.figures[key].success /
            state.allStatistics.figures[key].failure,
          userValue:
            state.userStatistics.figures[key].success /
            state.userStatistics.figures[key].failure,
        });
      });

      return statistics;
    },
  },

  actions: {
    async loadAllStatistics() {
      const docRef = doc(db, "statistics", "statistics");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.allStatistics = docSnap.data();
        console.log(this.allStatistics);
      } else {
        console.log("No such document!");
      }
    },
  },
});
