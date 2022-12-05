import chalk from 'chalk';
import prism from 'prismjs';
import loadLanguages from 'prismjs/components/index';
import escapeHtml from 'escape-html';
loadLanguages(['markup', 'css', 'javascript']);
function wrap(code, lang) {
  if (lang === 'text') {
    code = escapeHtml(code);
  }
  return `<pre v-pre><code>${code}</code></pre>`;
}
const highlight = (str, lang) => {
  if (!lang) {
    return wrap(str, 'text');
  }
  lang = lang.toLowerCase();
  const rawLang = lang;
  if (lang === 'vue' || lang === 'html') {
    lang = 'markup';
  }
  if (lang === 'md') {
    lang = 'markdown';
  }
  if (lang === 'ts') {
    lang = 'typescript';
  }
  if (lang === 'py') {
    lang = 'python';
  }
  if (!prism.languages[lang]) {
    try {
      loadLanguages([lang]);
    }
    catch (e) {
      console.warn(chalk.yellow(`[vitepress] Syntax highlight for language "${lang}" is not supported.`));
    }
  }
  if (prism.languages[lang]) {
    const code = prism.highlight(str, prism.languages[lang], lang);
    return wrap(code, rawLang);
  }
  return wrap(str, 'text');
};

export const codePlugin = (md, options) => {
  const lang = options?.lang || 'vue'
  const defaultRender = md.renderer.rules.fence
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    // 判断该 fence 是否在 :::demo 内
    const prevToken = tokens[idx - 1]
    const isInDemoContainer =
      prevToken && prevToken.nesting === 1 && prevToken.info.trim().match(/^demo\s*(.*)$/)
    if (token.info.trim() === lang && isInDemoContainer) {
      const m = prevToken.info.trim().match(/^demo\s*(.*)$/)
      const description = m && m.length > 1 ? m[1] : ''
      return `
          ${description
          ? `<template #description>
            <div>${md.renderInline(description)}</div>
          </template>`
          : ''
        }
          <template #highlight>
            <div class="language-${lang}">${highlight(token.content, lang)}</div>
          </template>`
    }
    return defaultRender(tokens, idx, options, env, self)
  }
}