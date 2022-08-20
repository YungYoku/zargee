<template>
  <div class="auth-options">
    <button
      v-for="authOption in authOptions"
      :key="authOption.type"
      type="button"
      @click="auth(authOption.type)"
    >
      <img :alt="authOption.alt" :src="authOption.icon" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import emailIcon from "@/assets/img/email.svg";
import googleIcon from "@/assets/img/google.svg";

const enum authOption {
  email = "email",
  google = "google",
}

const emit = defineEmits(["email", "google"]);

const authOptions = ref([
  {
    type: authOption.email,
    alt: "Почта",
    icon: emailIcon,
  },

  {
    type: authOption.google,
    alt: "Google",
    icon: googleIcon,
  },
]);

const auth = (type: authOption) => {
  emit(type);
};
</script>

<style lang="scss" scoped>
.auth-options {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;

  gap: 15px;

  button {
    cursor: pointer;

    img {
      width: 32px;
      height: 32px;
    }
  }
}
</style>
