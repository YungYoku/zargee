<template>
  <div class="analytics-view">
    <button-close class="back" />

    <div class="info">
      <div class="age">Возраст: {{ mainStore.user.age }}</div>
      <div class="gender">Пол: {{ mainStore.user.gender }}</div>

      <div class="figures">
        <div class="title">Статистика попадания по фигурам</div>

        <div
          v-for="stat in statisticsStore.statistics.figures"
          :key="stat.allValue * stat.userValue"
          class="stat"
        >
          Ваш КПД: {{ stat.userValue }}
          <br />
          Общий КПД: {{ stat.allValue }}
        </div>
      </div>

      <div class="figures">
        <div class="title">Статистика попадания по цветам</div>

        <div
          v-for="stat in statisticsStore.statistics.colors"
          :key="stat.allValue * stat.userValue"
          class="stat"
        >
          Ваш КПД: {{ stat.userValue }}
          <br />
          Общий КПД: {{ stat.allValue }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ButtonClose from "@/components/ButtonClose.vue";
import { useMainStore } from "@/stores/main";
import { useStatisticsStore } from "@/stores/statistics";

const mainStore = useMainStore();
const statisticsStore = useStatisticsStore();

statisticsStore.loadAllStatistics();
</script>

<style lang="scss" scoped>
.analytics-view {
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
  padding: 96px;

  .back {
    position: absolute;
    top: 24px;
    left: 24px;
  }

  .info {
    position: relative;
    z-index: 1;

    display: grid;
    justify-items: flex-start;

    align-items: center;

    grid-gap: 12px;
    grid-template: repeat(8, auto) / 1fr;

    width: calc(100% - 48px);
    min-width: 300px;
    max-width: 384px;
    padding: 12px;
    overflow: hidden;

    text-align: center;

    background-color: #ffffff;
    border-radius: 5px;
  }
}
</style>
