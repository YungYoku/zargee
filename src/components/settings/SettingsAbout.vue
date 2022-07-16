<template>
  <div class="about">
    <button class="about__leave-btn" @click="$emit('close')">
      <img alt="Back" src="../../assets/icons/back.svg" />
    </button>

    <div class="about__content">
      Добро пожаловать Zargee - Popping shapes!
      <br />
      Развивайте внимательность, эрудицию и реакцию!
      <br />
      Каждый раз вы начинаете с первого уровня и идёте к последнему 72 уровню!
      <br />
      Каждый новый уровень повышается сложность! Количество фигур и скорость их
      передвижения возрастает, а размер уменьшается!
      <br />
      Всего в игре есть 4 уровня сложности!
      <br /><br />

      <div v-for="(item, i) in complexity" :key="item" class="complexity__fire">
        <img
          v-for="img in 4"
          :key="img"
          :src="i + 1 >= img ? fireOn : fireOff"
          alt="Fire"
        />
        {{ i + 1 }} уровень - {{ item }}
      </div>

      <br />
      Если вдруг вы проиграли, то можете продолжить игру с места вашей смерти,
      использовав определенное количество имеющихся у вас на балансе жизней или
      посмотрев рекламу. Получайте жизни, чтобы в любой момент вернуться в игру!
      <br />
      В течение недели вы можете увеличивать количество полученных жизней, если
      будете заходить в игру каждый день. Вы можете каждый час получать по одной
      жизни при просмотре рекламы. Поделитесь ссылкой в социальных сетях и
      получите 2 жизни! Задание доступно каждые 24 часа!
      <br />
      Получите золотую жизнь! Если ваш друг использует ваш реферальный код при
      регистрации, то вы получите особенную жизнь, благодаря которой сможете
      продолжить игру в любой момент, не тратя при этом обычные жизни!
    </div>
  </div>
</template>

<script lang="ts" setup>
import fireOn from "@/assets/icons/fireOn.svg";
import fireOff from "@/assets/icons/fireOff.svg";

const complexity = ["без времени", "легкий", "средний", "сложный"];
</script>

<style lang="scss" scoped>
.about {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;

  display: grid;

  width: 100%;
  height: 100%;
  padding: 50px 10px 10px 10px;

  text-align: left;

  background-color: #f5eee9;

  > div {
    overflow-y: scroll;
    scrollbar-width: thin;
    scrollbar-color: #333333 #ffffff;
  }

  > div::-webkit-scrollbar {
    width: 12px;
  }

  > div::-webkit-scrollbar-track {
    background: #ffffff;
  }

  > div::-webkit-scrollbar-thumb {
    background-color: #333333;
  }

  &__leave-btn {
    position: absolute;
    top: 10px;
    left: 10px;

    width: 36px;
    height: 36px;
    padding: 7px;

    background-color: transparent;
    border: 2px solid #333333;
    border-radius: 50%;

    cursor: pointer;
  }

  &__content {
    .complexity__fire {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      width: 100%;

      img {
        width: 24px;
        height: 24px;
        overflow: hidden;

        transition: all 0.2s;
      }
    }
  }
}
</style>
