<template>
  <div class="winWrap">
    <div class="win">
      <h2>Конец игры</h2>

      <router-link to="/" @click="clearIntervals">
        Меню
        <img alt="Menu" src="@/assets/icons/menu.svg" />
      </router-link>

      <the-share />
    </div>
  </div>
</template>

<script lang="ts" setup>
import TheShare from "@/components/game/GameShare.vue";

const emit = defineEmits(["clearIntervals"]);

const clearIntervals = () => {
  emit("clearIntervals");
};
</script>

<style lang="scss" scoped>
.winWrap {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100vh;

  background-color: rgba(0, 0, 0, 0.5);
}

.win {
  position: relative;

  display: grid;

  grid-gap: 10px;
  grid-template: repeat(3, 1fr) / 1fr;

  width: 30%;
  min-width: 300px;
  padding: 10px;
  overflow: hidden;

  background-color: #f5eee9;
  border-radius: 5px;
}

.win > a,
.win > button {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
  padding: 20px;

  font-size: 28px;
  font-weight: 500;
  text-align: center;
  color: #333333;

  background-color: transparent;
  border: 6px solid #333333;
  border-radius: 5px;

  cursor: pointer;
}

.win > a > img,
.win > button > img {
  width: 32px;
  height: 32px;
  margin-left: 20px;
}

.win h2 {
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 52px;
}
</style>
