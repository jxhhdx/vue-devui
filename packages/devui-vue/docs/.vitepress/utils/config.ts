export const getDefaultImportConfig = (options: Record<string, unknown>) => {
  const { version } = options;
  const defaultVueRuntimeURL = `https://unpkg.com/@vue/runtime-dom@${version}/dist/runtime-dom.esm-browser.js`;
  const defaultVueServerRendererURL = `https://unpkg.com/@vue/server-renderer@${version}/dist/server-renderer.esm-browser.js`;

  const config = { 
    imports: {
      vue: defaultVueRuntimeURL,
      'vue/server-renderer': defaultVueServerRendererURL,
    } 
  };
  return config;
}