<template>
  <div class="earn-video">
    <div id="yandex_video_pc"></div>
    <div id="yandex_video_laptop"></div>

    <div v-if="timer" class="earn-video__timer">{{ timer }}</div>

    <button v-else class="earn-video__close" type="button" @click="hideAd">
      <img alt="Закрыть" src="@/assets/img/close.svg" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";

const props = defineProps({
  pcBlockId: {
    type: String,
    required: true,
    default: "",
  },
  laptopBlockId: {
    type: String,
    required: true,
    default: "",
  },
  mobileBlockId: {
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
      renderTo: "yandex_video_pc",
      blockId: props.pcBlockId,
    });
  });

  window.yaContextCb.push(() => {
    Ya.Context.AdvManager.render({
      renderTo: "yandex_video_laptop",
      blockId: props.laptopBlockId,
    });
  });

  if (window.innerWidth < 768) {
    window.yaContextCb.push(() => {
      Ya.Context.AdvManager.render({
        type: "fullscreen",
        platform: "touch",
        blockId: props.mobileBlockId,
      });
    });
  }
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

  #yandex_video_pc {
    @media (max-width: 1024px) {
      display: none;
    }
  }

  #yandex_video_laptop {
    @media (min-width: 1024px) {
      display: none;
    }

    @media (max-width: 768px) {
      display: none;
    }
  }

  #yandex_video_mobile {
    @media (min-width: 768px) {
      display: none;
    }
  }

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

    @media (max-width: 768px) {
      display: none;
    }
  }
}
</style>
