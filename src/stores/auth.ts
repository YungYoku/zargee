import { defineStore } from "pinia";
import { arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/main";
import { useTipStore } from "@/stores/tip";

export const useAuthStore = defineStore({
  id: "auth",

  state: () => ({}),

  getters: {},

  actions: {
    generateRefCode() {
      let refCode = 0;
      for (let i = 0; i < 8; i++) {
        refCode += Math.floor(Math.random() * 9) * i ** 10;
      }

      return refCode;
    },

    async isUsedRefCodeReal(name: string, refCode: string) {
      try {
        await this.sendBonusToGivingRefUser(name, refCode);
        return true;
      } catch (e) {
        const tipStore = useTipStore();

        tipStore.update("Такой код не существует");
        return false;
      }
    },

    async sendBonusToGivingRefUser(name: string, refCode: string) {
      await updateDoc(doc(db, "refs", refCode), {
        refs: arrayUnion(name),
      });
    },

    async addEmptyUserToDb(uid: string, name: string, bonus: boolean) {
      const refCode = this.generateRefCode();

      await Promise.all([
        await setDoc(doc(db, "users", uid), {
          adWatchTime: 0,
          codes: [],
          gold: bonus ? 1 : 0,
          hearts: bonus ? 10 : 1,
          lvl: 0,
          name: name,
          changeNameDate: 0,
          ref: refCode,
          refUsers: 0,
          resetDay: 0,
          rewardDay: 1,
          rewardParts: {
            first: false,
            second: false,
          },
        }),
        await setDoc(doc(db, "refs", refCode.toString()), {
          name: name,
          refs: [],
        }),
      ]);
    },
  },
});
