<template>
  <div class="wrap">
    <input v-if="nameChanging" v-model.trim="changeableName" type="text" />

    <h2 v-else class="name">{{ mainStore.user.name }}</h2>

    <button v-if="nameChanging" type="button" @click="changeName">
      <img alt="Сохранить" src="@/assets/img/approve.svg" />
    </button>

    <button v-else type="button" @click="showChangeNameInput">
      <img alt="Изменить" src="@/assets/img/edit.svg" />
    </button>

    <div class="lvl">{{ mainStore.user.lvl }}</div>
  </div>
</template>

<script lang="ts" setup>
import { useMainStore } from "@/stores/main";
import { ref, watch } from "vue";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/main";
import { useTipStore } from "@/stores/tip";

const mainStore = useMainStore();
const tipStore = useTipStore();

const changeableName = ref("");
const nameChanging = ref(false);

watch(changeableName, () => {
  changeableName.value = changeableName.value.slice(0, 8);
});

const getNextChangeNameTime = () => {
  return (
    getCurrentChangeNameTime() + 604800 // Неделя
  );
};

const getCurrentChangeNameTime = () => {
  return (
    mainStore.getCurrentDayInYear() * 86_400 +
    new Date().getHours() * 3600 +
    new Date().getMinutes() * 60 +
    new Date().getSeconds()
  );
};

const isNameChangeable = () => {
  if (getCurrentChangeNameTime() > mainStore.user.changeNameDate) {
    return true;
  }

  return false;
};

const showChangeNameInput = () => {
  if (isNameChangeable()) {
    nameChanging.value = true;

    changeableName.value = mainStore.user.name;

    tipStore.update("Изменение имени доступно раз в 7 дней");
  } else {
    const remainingSeconds =
      getCurrentChangeNameTime() - mainStore.user.changeNameDate;
    const remainingDays = Math.abs(Math.floor(remainingSeconds / 60 / 60 / 24));

    tipStore.update(
      `Изменение имени доступно раз в 7 дней, осталось ${remainingDays} дней`
    );
  }
};

const isChangeableNameSame = () => {
  if (changeableName.value === mainStore.user.name) {
    return true;
  }

  return false;
};

const isNameValid = () => {
  if (changeableName.value.length) {
    return true;
  }

  return false;
};

const changeName = async () => {
  if (isChangeableNameSame()) {
    nameChanging.value = false;
  } else if (isNameValid()) {
    const userRef = doc(db, "users", mainStore.uid);
    await updateDoc(userRef, {
      name: changeableName.value,
      changeNameDate: getNextChangeNameTime(),
    }).then(() => {
      nameChanging.value = false;
    });
  }
};
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  gap: 10px;

  height: 60px;

  input {
    padding: 0 0 0 5px;

    border: 1px solid #333;
    border-radius: 5px;
  }

  input,
  .name {
    max-width: 200px;

    font-size: 40px;
    font-weight: 700;
    text-align: left;

    @media (max-width: 480px) {
      max-width: 130px;

      font-size: 26px;
    }
  }

  button {
    width: 18px;
    height: 18px;
    margin-top: 8px;

    cursor: pointer;

    @media (max-width: 480px) {
      margin-top: 2px;
    }

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
