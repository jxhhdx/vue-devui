import { blockPlugin } from '../plugins/block-plugin';

const options = { cssPreprocessor: 'scss' };
const markdown = {
  config: (md) => {
    md.use((curMd) => {
      curMd.use(blockPlugin, options);
    });
  }
}
export default markdown;
