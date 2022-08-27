<template>
  <div class="wrap">
    <input v-if="nameChanging" type="text" v-model.trim="changeableName" />

    <h2 v-else class="name">{{ mainStore.user.name }}</h2>

    <button v-if="nameChanging" @click="changeName" type="button">
      <img src="@/assets/img/approve.svg" alt="Сохранить" />
    </button>

    <button v-else @click="showChangeNameInput" type="button">
      <img src="@/assets/img/edit.svg" alt="Изменить" />
    </button>

    <div class="lvl">{{ mainStore.user.lvl }}</div>
  </div>
</template>

<script setup lang="ts">
import { useMainStore } from "@/stores/main";
import { ref } from "vue";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/main";

const mainStore = useMainStore();

const changeableName = ref("");
const nameChanging = ref(false);

const showChangeNameInput = () => {
  nameChanging.value = true;

  changeableName.value = mainStore.user.name;
};

const changeName = async () => {
  const userRef = doc(db, "users", mainStore.uid);
  await updateDoc(userRef, {
    name: changeableName.value
  }).then(() => {
    nameChanging.value = false;
  });
};
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  gap: 10px;

  height: 60px;

  input,
  .name {
    max-width: 200px;

    font-size: 40px;
    font-weight: 700;
    text-align: left;
  }

  button {
    width: 18px;
    height: 18px;
    margin-top: 8px;

    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .lvl {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 40px;
    height: 40px;

    color: #333333;

    border: 1px solid #333333;
    border-radius: 50%;
  }
}
</style>