<template>
  <div class="win">
    <div class="win__content">
      <h2>Конец игры</h2>

      <router-link draggable="false" to="/" @click="clearIntervals">
        Меню
        <img alt="Menu" src="@/assets/img/menu.svg" />
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
.win {
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

  &__content {
    position: relative;

    display: grid;

    grid-gap: 10px;
    grid-template: repeat(3, auto) / 1fr;

    width: 30%;
    min-width: 300px;
    padding: 10px;
    overflow: hidden;

    background-color: #f5eee9;
    border-radius: 5px;

    h2 {
      display: flex;
      justify-content: center;
      align-items: center;

      font-size: 52px;
    }

    > a,
    > button {
      display: flex;
      justify-content: center;
      align-items: center;

      width: 100%;
      height: 100%;
      padding: 20px;

      font-size: 28px;
      font-weight: 400;
      text-align: center;
      color: #333333;

      background-color: transparent;
      border: 6px solid #333333;
      border-radius: 5px;

      cursor: pointer;

      > img {
        width: 32px;
        height: 32px;
        margin-left: 20px;
      }
    }
  }
}
</style>
