<template>
  <div class="codeWrap">
    <label for="code">
      <input
        id="code"
        v-model.trim="code"
        placeholder="Ввести код"
        type="text"
        @keypress.enter="sendCode()"
      />
    </label>

    <div class="approveWrap" @click="sendCode()">
      <img alt="Approve" src="../../assets/icons/approve.svg" />
    </div>
  </div>
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

async function sendCode() {
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
        if (docSnap.data().hearts && !docSnap.data().gold) {
          tipStore.update(`Получено ${docSnap.data().hearts} сердец`);
        }
        if (!docSnap.data().hearts && docSnap.data().gold) {
          tipStore.update(`Получено ${docSnap.data().gold} золотых сердец`);
        }
        if (docSnap.data().hearts && docSnap.data().gold) {
          tipStore.update(`Получено ${docSnap.data().hearts} сердец`);
          setTimeout(() => {
            tipStore.update(`Получено ${docSnap.data().gold} золотых сердец`);
          }, 2100);
        }

        await updateDoc(doc(db, "users", mainStore.uid), {
          gold: mainStore.user.gold + docSnap.data().gold,
          hearts: mainStore.user.hearts + docSnap.data().hearts,
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
}
</script>

<style lang="scss" scoped>
.codeWrap {
  display: grid;
  align-items: center;

  grid-gap: 5px;
  grid-template: 100% / 1fr 50px;
}

label {
  width: 100%;
  height: 100%;
}

input {
  width: 100%;
  height: 100%;
  padding: 10px;

  font-size: 16px;
  font-weight: 600;
  color: #333333;

  background-color: transparent;
  border: 2px solid #333333;
  border-radius: 5px;

  cursor: text;

  user-select: text;
}

img {
  width: 19px;
  height: 19px;
}

.approveWrap {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 50px;
  height: 50px;
  padding: 10px;

  font-size: 16px;
  font-weight: 600;
  color: #333333;

  background-color: transparent;
  border: 2px solid #333333;
  border-radius: 5px;

  cursor: pointer;
}
</style>
