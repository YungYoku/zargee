<template>
  <div class="earn-video">
    <div id="yandex_video"></div>

    <div v-if="timer" class="earn-video__timer">{{ timer }}</div>

    <button v-else class="earn-video__close" type="button" @click="hideAd">
      <img alt="Закрыть" src="@/assets/img/close.svg" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";

const props = defineProps({
  blockId: {
    type: String,
    required: true,
    default: "",
  },
  timer: {
    type: Number,
    required: true,
    default: 5,
  },
});

const emit = defineEmits(["hideAd"]);

const hideAd = () => {
  emit("hideAd");
};

onMounted(() => {
  window.yaContextCb.push(() => {
    Ya.Context.AdvManager.render({
      renderTo: "yandex_video",
      blockId: props.blockId,
    });
  });
});
</script>

<style lang="scss" scoped>
.earn-video {
  position: fixed;
  top: 0;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;

  backdrop-filter: blur(20px);

  h3 {
    font-size: 20px;
  }

  &__timer,
  &__close {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 5;

    display: flex;
    justify-content: center;
    align-items: center;

    width: 50px;
    height: 50px;
    padding: 10px;

    font-size: 24px;
    color: #333333;

    background: #fff;
    border: 1px solid #333333;
    border-radius: 50%;
  }
}
</style>
