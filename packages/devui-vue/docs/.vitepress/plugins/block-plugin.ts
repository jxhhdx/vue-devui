import path from 'path';
import fs from 'fs';
import { pathExistsSync } from 'path-exists';
import MarkdownIt from 'markdown-it';
import mdContainer from 'markdown-it-container';
import highlight from '../utils/highlight';

const localMd = MarkdownIt();
/**
 * Format Path
 * example： button/size => button/demo/size
 */
const formatPath = (sourceFile: string) => {
  const middleArr = sourceFile.split('/');
  middleArr.splice(1, 0, 'demo');
  return middleArr.join('/');
}

export const blockPlugin = (md: MarkdownIt) => {
  md.use(mdContainer, 'demo', {
    validate(params) {
      return params.trim().match(/^demo\s*(.*)$/)
    },

    render(tokens, idx) {
      const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/)
      if (tokens[idx].nesting === 1) {
        const description = m && m.length > 1 ? m[1] : ''
        let content = tokens[idx + 1].type === 'fence' ? tokens[idx + 1].content : '';
        const sourceFileToken = tokens[idx + 2]
        const sourceObject = sourceFileToken.children?.[0] || {};
        const { content: sourceFile } = sourceObject;
        let targetFilePath = '';
        // 自定义 demo，从外部引入
        if (!content && sourceFile && sourceFileToken.type === 'inline') {
          const curSourceFile = formatPath(sourceFile);
          targetFilePath = path.resolve(__dirname, '../../../devui', `${curSourceFile}.vue`);
          if (pathExistsSync(targetFilePath)) {
            content = fs.readFileSync(targetFilePath, 'utf-8');
          }
        }
        return `
          <demo 
            sourceCode="${md.utils.escapeHtml(content)}"
            lightCode="${encodeURIComponent(highlight(content, 'vue'))}"
            desc="${encodeURIComponent(localMd.render(description))}"
            targetFilePath="${targetFilePath}"
          >
          ${content ? `<!--vue-demo:${content}:vue-demo-->` : ''}
        `;
      }
      return '</demo>';
    },
  })
}