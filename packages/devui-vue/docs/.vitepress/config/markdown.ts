import { blockPlugin } from '../plugins/block-plugin';
import { codePlugin } from '../plugins/code-plugin';
import { renderPlugin } from '../plugins/render-plugin';

const options = { cssPreprocessor: 'scss' };
const markdown = {
  config: (md) => {
    md.use((curMd) => {
      curMd.use(blockPlugin, options);
      curMd.use(codePlugin, options);
      curMd.use(renderPlugin, options);
    });
  }
}
export default markdown;
