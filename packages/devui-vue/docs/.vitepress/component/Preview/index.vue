<script setup lang="ts">
import { watch, defineComponent, ref } from 'vue';
import type { Component } from 'vue'
import sfcToComponent from '../../utils/sfcToComponent';
const props = defineProps<{ value: string }>();
const comp = ref<Component | null>(null);

watch(
  () => props.value,
  (val) => {
    comp.value = defineComponent(sfcToComponent(val));
  },
  { immediate: true }
)
</script>

<template>
  <div class="iframe-container">
    <component :is="comp" />
  </div>
  <!-- <Message :err="runtimeError" />
  <Message v-if="!runtimeError" :warn="runtimeWarning" /> -->
</template>

<style scoped>
.iframe-container,
.iframe-container :deep(iframe) {
  width: 100%;
  height: 100%;
  border: none;
  background-color: #fff;
}
</style>
