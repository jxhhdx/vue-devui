<template>
  <div class="demo-spacing">
    <d-button variant="solid">
      {{ msg }}
    </d-button>
    <d-button>Outline Button</d-button>
    <d-button variant="text">
      Text Button
    </d-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const msg = ref('Solid Button111');
</script>

<style>
.devui-button {
  margin-right: 8px;
}
</style>
