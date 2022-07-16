import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/main";
import type { User } from "@/interfaces/user";
import { defineStore } from "pinia";
import { useLoadingStore } from "@/stores/loading";

export interface State {
  demo: boolean;
  uid: string;
  user: User;
  sound: boolean;
  soundChange: boolean;
  firstPage: string;
  error: string;
  subscribedToNewRefs: boolean;
}

const monthDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export const useMainStore = defineStore({
  id: "main",

  state: (): State => ({
    demo: false,
    uid: localStorage.uid ? localStorage.uid : "",
    user: {
      ref: "",
    } as User,
    sound: localStorage.sound === "true",
    soundChange: localStorage.soundChange === "true",
    firstPage: "",
    error: "",
    subscribedToNewRefs: false,
  }),

  getters: {},

  actions: {
    login(uid: string) {
      this.demo = false;
      this.uid = uid;
      localStorage.uid = uid;
    },

    async loginDemo() {
      this.demo = true;
      localStorage.uid = "JyLHqEGLjAeEyVUUMjEK6U3PC4b2";
      this.uid = "JyLHqEGLjAeEyVUUMjEK6U3PC4b2";
      await this.loadInfo();
    },

    setInfo(user: User) {
      this.user = user;
    },

    swapSound() {
      this.sound = !this.sound;
      this.soundChange = this.sound;
      localStorage.sound = "" + this.sound;
      localStorage.soundChange = "" + this.soundChange;
    },

    offSound() {
      if (this.soundChange) this.sound = false;
    },

    onSound() {
      if (this.soundChange) this.sound = true;
    },

    setFirstPage(page: string) {
      this.firstPage = page;
    },

    serError(error: string) {
      this.error = error;
    },

    getCurrentDayInYear(day = 0) {
      let days = new Date().getDate();
      for (let i = 0; i < new Date().getMonth(); i++) {
        days += monthDays[i];
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
      await onSnapshot(doc(db, "refs", this.user.ref), async (response) => {
        if (response.exists()) {
          const refUsers = response.data();

          if (this.user.refUsers < refUsers.refs.length) {
            await updateDoc(doc(db, "users", localStorage.uid), {
              gold: this.user.gold + refUsers.refs.length - this.user.refUsers,
              hearts:
                this.user.hearts +
                10 * (refUsers.refs.length - this.user.refUsers),
              refUsers: refUsers.refs.length,
            });
          }
        }
      });
    },

    async loadInfo() {
      if (this.uid) {
        const loadingStore = useLoadingStore();
        loadingStore.show();

        await onSnapshot(doc(db, "users", this.uid), async (response) => {
          if (response.exists()) {
            const _user: User = response.data() as User;

            this.setInfo(_user);
            await this.updateResetDay(_user);

            if (!this.subscribedToNewRefs) {
              await this.subscribeToNewRefs();
              this.subscribedToNewRefs = true;
            }

            loadingStore.hide();
          }
        });
      }
    },

    logout() {
      localStorage.clear();
      this.$reset();
    },
  },
});
