import { parse as sfc_parse, compileScript, compileTemplate, rewriteDefault } from 'vue/compiler-sfc';
import { parse, print, types } from 'recast';
import * as Vue from 'vue';
const ID = 'id';
const FILE_NAME = 'example.vue';

const importToConst = (code: string) => {
  const ast = parse(code);
  if (ast?.program?.body) {
    const b = types.builders;
    ast.program.body = ast.program.body.map((item) => {
      if (item.type === 'ImportDeclaration') {
        const { specifiers, source } = item;
        if (source.value === 'vue') {
          source.value = 'Vue';
        }
        return b.variableDeclaration('const', [
          b.variableDeclarator(
            b.objectPattern(specifiers.map((item1) => {
              const { imported, local } = item1;
              return b.property('init', b.identifier(imported.name), b.identifier(local.name));
            })),
            b.identifier(source.value)
          ),
        ])
      }
      return item;
    })
  }
  return print(ast).code;
}

const removeFunExportDefault = (code: string) => {
  const ast = parse(code);
  if (ast?.program?.body) {
    ast.program.body = ast.program.body.map((item) => {
      if (item.type === 'ExportNamedDeclaration') {
        const { declaration } = item;
        return declaration;
      }
      return item;
    })
  }
  return print(ast).code;
}

export default function sfcToComponent(code: string) {
  const { descriptor } = sfc_parse(code, {});
  const component: { [key: string]: any } = {};
  if (descriptor.script || descriptor.scriptSetup) {
    const scriptBlock = compileScript(descriptor, { id: ID });
    let scriptCode = rewriteDefault(scriptBlock.content, 'Component');
    scriptCode = importToConst(scriptCode);
    scriptCode = `
      ${scriptCode};
      return Component;
    `;
    const fun = new Function('Vue', scriptCode);
    Object.assign(component, fun(Vue));
  }

  if (descriptor.template !== null) {
    let result = compileTemplate({
      filename: FILE_NAME,
      id: ID,
      source: descriptor.template.content
    }).code;
    result = importToConst(result);
    result = removeFunExportDefault(result);
    result = `
      ${result}
      return { render };
    `;
    const fun = new Function('Vue', result);
    Object.assign(component, fun(Vue));
  }

  for (const descStyle of descriptor.styles) {
    // console.log(descStyle, descriptor, 'descStyle');
  }

  return component;
}