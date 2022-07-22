<template>
  <div class="wrap">
    <router-link :to="link" class="link">
      <span class="text">
        {{ text }}
      </span>
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";

defineProps({
  link: {
    type: String,
    required: true,
    default: "/",
  },

  text: {
    type: String,
    required: true,
    default: "Ссылка",
  },
});
</script>

<style lang="scss" scoped>
.wrap {
  z-index: 2;

  display: flex;
  justify-content: center;

  .link {
    padding: 5px 10px;

    background-color: #ffffff;
    border-radius: 5px;

    .text {
      position: relative;

      font-size: 14px;
      font-weight: 400;
      color: gray;

      cursor: pointer;

      &::after {
        content: "";
        position: absolute;
        bottom: -2px;
        left: 0;

        width: 0;
        height: 1px;

        background-color: #333333;

        transition: all 0.4s;
      }
    }

    &:hover {
      .text {
        &::after {
          width: 100%;

          transition: all 0.4s;
        }
      }
    }
  }
}
</style>
