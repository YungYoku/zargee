<template>
  <div class="earn-video">
    <earn-video
      v-if="!isItMobile"
      :laptopBlockId="props.laptopBlockId"
      :pc-block-id="props.pcBlockId"
      :timer="props.timer"
      @hideAd="hideAd"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import EarnVideo from "@/components/earnVideo/EarnVideo.vue";

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

const isItMobile = ref(false);

const emit = defineEmits(["hideAd"]);

const hideAd = () => {
  emit("hideAd");
};

const mountAds = () => {
  if (window.innerWidth < 768) {
    isItMobile.value = true;

    const ads = [
      {
        type: "fullscreen",
        platform: "touch",
        blockId: props.mobileBlockId,
      },
    ];

    ads.forEach((ad) => {
      window.yaContextCb.push(() => {
        // eslint-disable-next-line no-undef
        Ya.Context.AdvManager.render(ad);
      });
    });

    hideAd();
  }
};

mountAds();
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
