import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
const require = createRequire(import.meta.url);
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const cache = new Map();
function load(relative) {
  const url = new URL(relative, import.meta.url);
  if (cache.has(url.href)) return cache.get(url.href);
  const source = ts.transpileModule(fs.readFileSync(url, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  const context = { exports: {}, require: (name) => {
    if (name === 'framer-motion') return { useReducedMotion: () => false, motion: new Proxy({}, { get: (_, tag) => tag }) };
    if (name === './ScrollMotionContext' || name === '@/components/ScrollMotionContext') return load('../components/ScrollMotionContext.tsx');
    if (name === './ItemMotion') return load('../components/ItemMotion.tsx');
    if (name === '@/lib/motion') return load('../lib/motion.ts');
    return require(name);
  } };
  vm.runInNewContext(source, context, { filename: fileURLToPath(url) });
  cache.set(url.href, context.exports);
  return context.exports;
}
const { ScrollMotionContext } = load('../components/ScrollMotionContext.tsx');
function render(Component, props) {
  return renderToStaticMarkup(React.createElement(ScrollMotionContext.Provider, {value:true}, React.createElement(Component, props, React.createElement('button', {type:'button'}, 'Buka'))));
}
test('shared sections preserve anchor, classes and style while scroll owns their reveal', () => {
  const { SectionMotion } = load('../components/SectionMotion.tsx');
  const html = render(SectionMotion, {id:'gallery',className:'theme-frame',style:{color:'maroon'}});
  assert.match(html, /<section id="gallery" class="theme-frame" style="color:maroon">/);
  assert.doesNotMatch(html,/opacity:0|translate/);
  assert.match(html, /<button type="button">Buka<\/button>/);
});
test('photo items keep their static tilt and existing contents', () => {
  const { ItemMotion } = load('../components/ItemMotion.tsx');
  const html = render(ItemMotion, {rotate:-4,className:'polaroid',style:{borderRadius:4},float:true});
  assert.match(html, /data-scroll-reveal=""/);
  assert.match(html, /rotate:-4deg/);
  assert.match(html, /border-radius:4px/);
  assert.doesNotMatch(html, /opacity:0/);
});
test('stagger container does not hide child controls during scroll motion', () => {
  const { StaggerContainer } = load('../components/ItemMotion.tsx');
  const html=render(StaggerContainer,{className:'controls'});
  assert.equal(html,'<div class="controls"><button type="button">Buka</button></div>');
});
test('Royal reveal follows shared scroll ownership instead of a second entrance animation', () => {
  const { RoyalMotionReveal }=load('./royal-heritage/RoyalMotionReveal.tsx');
  const html=render(RoyalMotionReveal,{className:'royal-card'});
  assert.match(html, /data-scroll-reveal="" class="royal-card"/);
  assert.doesNotMatch(html, /opacity:0/);
});
