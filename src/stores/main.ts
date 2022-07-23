import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/main";
import type { User } from "@/interfaces/user";
import { defineStore } from "pinia";
import { useLoadingStore } from "@/stores/loading";

export interface State {
  demo: boolean;
  uid: string;
  user: User;
  isMusicPlayable: boolean;
  isMusicChangeable: boolean;
  firstPage: string;
  error: string;
  subscribedToNewRefs: boolean;
}

const monthDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export const useMainStore = defineStore({
  id: "main",

  state: (): State => ({
    demo: false,
    uid: "",
    user: {} as User,
    isMusicPlayable: false,
    isMusicChangeable: false,
    firstPage: "",
    error: "",
    subscribedToNewRefs: false,
  }),

  getters: {},

  actions: {
    updateIsMusicPlayable() {
      const LocalStorageIsMusicPlayable = localStorage.isMusicPlayable;

      if (LocalStorageIsMusicPlayable) {
        if (LocalStorageIsMusicPlayable === "true") {
          this.isMusicPlayable = true;
        } else if (LocalStorageIsMusicPlayable === "false") {
          this.isMusicPlayable = false;
        }
      } else {
        localStorage.isMusicPlayable = false;
        this.isMusicPlayable = false;
      }
    },

    updateIsMusicChangeable() {
      const LocalStorageIsMusicChangeable = localStorage.isMusicChangeable;

      if (LocalStorageIsMusicChangeable) {
        if (LocalStorageIsMusicChangeable === "true") {
          this.isMusicChangeable = true;
        } else if (LocalStorageIsMusicChangeable === "false") {
          this.isMusicChangeable = false;
        }
      } else {
        localStorage.isMusicChangeable = false;
        this.isMusicChangeable = false;
      }
    },

    updateSoundSettings() {
      this.updateIsMusicPlayable();
      this.updateIsMusicChangeable();
    },

    loadUIDFromLocalStorage() {
      const LocalStorageUID = localStorage.uid;

      if (LocalStorageUID) {
        this.uid = LocalStorageUID;
      } else {
        localStorage.uid = "";
        this.uid = "";
      }
    },

    updateComplexitySettings() {
      const LocalStorageComplexity = localStorage.complexity;

      if (LocalStorageComplexity) {
        //this.complexity = LocalStorageComplexity;
      } else {
        localStorage.complexity = "1";
        //this.complexity = "1";
      }
    },

    updateSettings() {
      this.loadUIDFromLocalStorage();

      this.updateSoundSettings();

      this.updateComplexitySettings();
    },

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
      this.isMusicPlayable = !this.isMusicPlayable;
      this.isMusicChangeable = this.isMusicPlayable;

      localStorage.isMusicPlayable = this.isMusicPlayable;
      localStorage.isMusicChangeable = this.isMusicChangeable;
    },

    offSound() {
      if (this.isMusicChangeable) {
        this.isMusicPlayable = false;
      }
    },

    onSound() {
      if (this.isMusicChangeable) {
        this.isMusicPlayable = true;
      }
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
      await onSnapshot(
        doc(db, "refs", this.user.ref.toString()),
        async (response) => {
          if (response.exists()) {
            const refUsers = response.data();

            if (this.user.refUsers < refUsers.refs.length) {
              await updateDoc(doc(db, "users", localStorage.uid), {
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
