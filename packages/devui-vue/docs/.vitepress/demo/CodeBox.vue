<template>
  <div class="code-box my-0">
    <div class="code-box__wrapper">
      <div class="code-box__left" >
        <Preview :value="code" />
      </div>
      <div class="code-box__right">
        <CodeMirror :value="code" @change="onChange" />
      </div>
    </div>
  </div>
</template>

<script setup>
import CodeMirror from '../component/CodeMirror/index.vue';
import Preview from '../component/Preview/index.vue';
// import { Store, ReplStore, SFCOptions } from '../utils/store';
import { debounce } from '../utils/utils';
import { useAttrs, ref } from 'vue';
const attrs = useAttrs();
const code = ref(decodeURIComponent(attrs.sourceCode));
// const store = new ReplStore();
// store.options = props.sfcOptions;
// store.init();

// provide('store', store);

const onChange = debounce((val) => {
  code.value = val;
}, 250);

</script>

<script>
export default {
  inheritAttrs: false,
}
</script>

<style scoped>
.code-box {
  height: 350px;
}

.code-box__wrapper {
  height: 100%;
  display: flex;
  border-radius: 3px;
  border: 1px solid rgb(28 31 35 / 8%);
  margin: 24px 0;
  background: #ffffff;
}

.code-box__left {
  width: 50%;
  padding: 20px;
}
.code-box__right {
  width: 50%;
  background-color: #f9f9f9;
}

.my-0 {
  margin-top: 16px;
  margin-bottom: 16px;
}
</style>