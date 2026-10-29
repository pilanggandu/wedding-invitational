import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
function fixture(nested = false, overflowing = true) {
  const calls = [];
  const body = { parentElement: null };
  const scrollport = { parentElement: body, clientHeight: 600, scrollHeight: overflowing ? 3000 : 600, scrollTo: (options) => calls.push(['preview', options]) };
  const root = { parentElement: nested ? scrollport : body, scrollTo: (options) => calls.push(['root', options]) };
  const context = { exports: {}, document: {body, documentElement:{}}, window: {scrollTo: (options) => calls.push(['window', options])}, getComputedStyle: () => ({overflowY:'auto'}) };
  const source=fs.readFileSync(new URL('./resetAmbientOpeningScroll.ts', import.meta.url),'utf8');
  vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,context);
  context.exports.resetAmbientOpeningScroll(root);
  return JSON.parse(JSON.stringify(calls));
}
test('public opening resets the invitation and document immediately to the top',()=>{
  assert.deepEqual(fixture(),[['root',{top:0,behavior:'instant'}],['window',{top:0,behavior:'instant'}]]);
});
test('admin preview resets its own scrollport while preserving the underlying page',()=>{
  assert.deepEqual(fixture(true),[['root',{top:0,behavior:'instant'}],['preview',{top:0,behavior:'instant'}]]);
});
test('preview never scrolls the underlying page even if its content currently fits',()=>{
  assert.deepEqual(fixture(true,false),[['root',{top:0,behavior:'instant'}],['preview',{top:0,behavior:'instant'}]]);
});
