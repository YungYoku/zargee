<template>
  <form class="codeWrap" @submit.prevent="sendCode">
    <label for="code">
      <input
        id="code"
        v-model.trim="code"
        placeholder="Бонусный код"
        required
        type="text"
      />
    </label>

    <button class="approveWrap" type="submit">
      <img alt="Approve" src="@/assets/img/approve.svg" />
    </button>
  </form>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/main";
import { useMainStore } from "@/stores/main";
import { useTipStore } from "@/stores/tip";

const mainStore = useMainStore();
const tipStore = useTipStore();

const code = ref("");

const sendCode = async () => {
  if (code.value) {
    if (mainStore.user.codes.includes(code.value)) {
      tipStore.update("Этот код уже был использован");
    } else {
      let _codes = [] as string[];
      if (mainStore.user.codes[0]) {
        _codes = mainStore.user.codes;
      }
      _codes.push(code.value);

      const docRef = doc(db, "codes", code.value);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const hearts = data["hearts"];
        const gold = data["gold"];

        if (hearts && !gold) {
          tipStore.update(`Получено ${hearts} сердец`);
        } else if (!hearts && gold) {
          tipStore.update(`Получено ${gold} золотых сердец`);
        } else if (hearts && gold) {
          tipStore.update(`Получено ${hearts} сердец`);
          setTimeout(() => {
            tipStore.update(`Получено ${gold} золотых сердец`);
          }, 2100);
        }

        await updateDoc(doc(db, "users", mainStore.uid), {
          gold: mainStore.user.gold + gold,
          hearts: mainStore.user.hearts + hearts,
          codes: _codes,
        });
      } else {
        tipStore.update("Этот код не существует");
      }
    }
    code.value = "";
  } else {
    tipStore.update("Введите код");
  }
};
</script>

<style lang="scss" scoped>
.codeWrap {
  display: grid;
  align-items: center;

  grid-gap: 5px;
  grid-template: 100% / 1fr 46px;

  label {
    width: 100%;

    input {
      width: 100%;
      height: 100%;
      padding: 10px;

      font-size: 16px;
      font-weight: 400;
      text-align: left;
      color: #333333;

      background-color: transparent;

      cursor: text;

      user-select: text;
    }
  }

  label,
  .approveWrap {
    border: 1px solid #333333;
    border-radius: 5px;
  }

  .approveWrap {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 46px;
    height: 46px;
    padding: 10px;

    background-color: transparent;

    cursor: pointer;

    img {
      width: 19px;
      height: 19px;
    }
  }
}
</style>
