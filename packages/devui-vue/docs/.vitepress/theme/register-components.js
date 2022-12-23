import Demo from '../demo/Demo.vue';
import DemoBlock from '../demo/DemoBlock.vue';
import CodeBox from '../demo/CodeBox.vue';

export function registerComponents(app) {
  app.component('Demo', Demo);
  app.component('DemoBlock', DemoBlock);
  app.component('CodeBox', CodeBox);
}
