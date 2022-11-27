<template>
  <div class="analytics">
    <label for="requestType">
      <span> Тип запроса: </span>
      <select id="requestType" v-model="selectedType">
        <option :value="request" v-for="request in requestTypes" :key="request">
          {{ generateOptionText(request) }}
        </option>
      </select>
    </label>

    <ul v-if="selectedAnalytics.length">
      <li v-for="request in selectedAnalytics" :key="request.date">
        IP запроса: {{ request.ip }}
        <br />
        Дата запроса: {{ new Date(request.date.seconds) }}
      </li>
    </ul>

    <span v-else-if="!selectedType.length">Выберите тип запроса</span>

    <span v-else>Запросы такого типа отсутствуют</span>
  </div>
</template>

<script lang="ts" setup>
import { getAnalytics } from "@/api/api";
import { computed, ref } from "vue";
import type { Analytics } from "@/api/analytics";
import { requestTypes } from "@/api/analytics";

const analytics = ref<Analytics[]>([]);
const selectedType = ref("");
const selectedAnalytics = computed(() => {
  if (selectedType.value) {
    return analytics.value.filter(
      (item: Analytics) => item.type === selectedType.value
    );
  }
  return [];
});

const load = async () => {
  analytics.value = await getAnalytics();
};
load();

const findRequestsAmount = (type: typeof requestTypes[number]) => {
  const requestAnalytics = analytics.value.filter(
    (item: Analytics) => item.type === type
  );
  return requestAnalytics.length;
};

const generateOptionText = (request: typeof requestTypes[number]) => {
  let requestText;
  const requestsAmount = findRequestsAmount(request);
  if (
    requestsAmount % 10 === 0 ||
    (requestsAmount % 10 >= 5 && requestsAmount % 10 <= 9)
  ) {
    requestText = "запросов";
  } else if (requestsAmount % 10 === 1) {
    requestText = "запрос";
  } else {
    requestText = "запроса";
  }
  return `${request} (${requestsAmount} ${requestText})`;
};
</script>

<style lang="scss" scoped>
.analytics {
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100vh;
  gap: 10px;

  padding: 20px;

  label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;

    span {
      width: 104px;
    }

    select {
      width: 100%;
      height: 40px;
      padding: 5px;

      border: 1px solid #000000;
      border-radius: 5px;

      option {
        width: 100%;
        height: 100%;

        font-size: 14px;
        color: #000000;
      }
    }
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 10px;

    padding: 20px 0;
    overflow: auto;

    li {
      padding: 20px;

      list-style: none;

      border: 1px solid #000000;
      border-radius: 5px;
    }
  }
}
</style>
