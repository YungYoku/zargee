import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/main";
import type { User } from "@/interfaces/user";
import { defineStore } from "pinia";
import { useLoadingStore } from "@/stores/loading";
import { useSettingsStore } from "@/stores/settings";
import { useStatisticsStore } from "@/stores/statistics";

export interface State {
  demo: boolean;
  uid: string;
  user: User;
  subscribedToNewRefs: boolean;
}

interface DBRef {
  name: string;
  refs: string[];
}

const monthDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export const useMainStore = defineStore({
  id: "main",

  state: (): State => ({
    demo: false,
    uid: "",
    user: {} as User,
    subscribedToNewRefs: false,
  }),

  getters: {},

  actions: {
    loadUIDFromLocalStorage() {
      const LocalStorageUID = localStorage["uid"];

      if (LocalStorageUID) {
        this.uid = LocalStorageUID;
      } else {
        localStorage["uid"] = "";
        this.uid = "";
      }
    },

    login(uid: string) {
      this.demo = false;
      this.uid = uid;
      localStorage["uid"] = uid;
    },

    loginDemo() {
      this.demo = true;
    },

    setInfo(user: User) {
      this.user = user;
    },

    getCurrentDayInYear(day = 0) {
      let days = new Date().getDate();
      for (let i = 0; i < new Date().getMonth(); i++) {
        days += monthDays[i] || 0;
      }

      return days + day;
    },

    async updateResetDay(user: User) {
      if (user.resetDay <= this.getCurrentDayInYear()) {
        const nextDay =
          user.rewardParts.first || user.rewardParts.second || false;
        const rewardDay = user.rewardDay < 7 ? user.rewardDay : 0;

        await updateDoc(doc(db, "users", this.uid), {
          resetDay: this.getCurrentDayInYear() + 1,
          rewardDay: nextDay ? rewardDay + 1 : 1,
          rewardParts: {
            first: false,
            second: false,
          },
        });
      }
    },

    async subscribeToNewRefs() {
      if (this.subscribedToNewRefs) return;
      this.subscribedToNewRefs = true;

      await onSnapshot(
        doc(db, "refs", this.user.ref.toString()),
        async (response) => {
          if (response.exists()) {
            const refUsers = response.data() as DBRef;

            if (this.user.refUsers < refUsers.refs.length) {
              await updateDoc(doc(db, "users", localStorage["uid"]), {
                gold:
                  this.user.gold + refUsers.refs.length - this.user.refUsers,
                hearts:
                  this.user.hearts +
                  10 * (refUsers.refs.length - this.user.refUsers),
                refUsers: refUsers.refs.length,
              });
            }
          }
        }
      );
    },

    async loadInfo() {
      if (this.uid) {
        const loadingStore = useLoadingStore();
        const statistics = useStatisticsStore();
        loadingStore.show();

        await onSnapshot(
          doc(db, "users", this.uid),
          async (response) => {
            if (response.exists()) {
              const _user: User = response.data() as User;

              this.setInfo(_user);
              await this.updateResetDay(_user);

              await this.subscribeToNewRefs();

              await statistics.loadAllStatistics();

              loadingStore.hide();
            }
          },
          (error) => {
            console.error(error);

            this.logout();
          }
        );
      }
    },

    logout() {
      const settingsStore = useSettingsStore();

      localStorage.clear();
      settingsStore.$reset();
      this.$reset();
    },
  },
});
