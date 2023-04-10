<template>
  <div
    ref="targetRef"
    :style="{
      left: props.target.x + 'px',
      top: props.target.y + 'px',
      width: props.target.width + 'px',
      height: props.target.height + 'px',
      clipPath: props.target.clipPath,
      backgroundColor:
        props.target.borderColor && props.target.borderColor !== 'transparent'
          ? props.target.borderColor
          : props.target.bgColor,
    }"
    class="target"
  >
    <div
      :style="{
        width: props.target.width - 20 + 'px',
        height: props.target.height - 20 + 'px',
        clipPath: props.target.clipPath,
        backgroundColor: props.target.bgColor,
      }"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";
import { onMounted, ref, watch } from "vue";
import type { Target } from "@/interfaces/target";

const props = defineProps({
  target: {
    type: Object as PropType<Target>,
    required: true,
    default() {
      return {
        x: 0,
        y: 0,
        width: 80,
        height: 80,
        d: "",
        figure: 1,
        figureName: "квадрат",
        bgColor: "#000000",
        bgColorName: "",
        border: 1,
        borderExists: false,
        borderColor: "",
        borderColorName: "",
        blink: false,
        blinkDelay: 0,
      };
    },
  },
});

const targetRef = ref();

const startAnimation = () => {
  if (targetRef.value) {
    targetRef.value.classList.add("animate");
  }
};

const endAnimation = () => {
  if (targetRef.value) {
    targetRef.value.classList.remove("animate");
  }
};

const blink = () => {
  if (props.target.blink && targetRef.value) {
    setTimeout(() => {
      props.target.blink ? startAnimation() : endAnimation();
      setTimeout(() => endAnimation(), 8000);
    }, props.target.blinkDelay * 1000);
  }
};

onMounted(() => blink());
watch(props, () => blink());
</script>

<style lang="scss" scoped>
.target {
  display: flex;
  justify-content: center;
  align-items: center;
}

.animate {
  animation: blink 8s;

  @keyframes blink {
    0% {
      opacity: 0.8;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 0.8;
    }
  }
}
</style>
