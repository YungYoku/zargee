<template>
  <div class="auth-errors">
    <span v-for="error in errors" :key="error" class="auth-errors__item">
      {{ error }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";

defineProps({
  errors: {
    type: Array as PropType<Array<string>>,
    required: true,
    default: () => [],
  },
});
</script>

<style lang="scss" scoped>
.auth-errors {
  &__item {
    color: #ff3a3a;
  }
}
</style>
