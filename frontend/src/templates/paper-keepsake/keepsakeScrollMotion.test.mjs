import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const filename = new URL('./keepsakeScrollMotion.ts', import.meta.url);
function fixture(clipped = false) {
  const values = new Map(), events = new Map();
  const classes = () => ({ add() {}, remove() {} });
  let position = 1000, queued;
  const clip = { parentElement: null, clientTop: 0, clientHeight: 500, getBoundingClientRect: () => ({ top: 100 }) };
  const element = { parentElement: clipped ? clip : null, matches: () => true, querySelector: () => null, classList: classes(), style: { setProperty: (k,v) => values.set(k,v), removeProperty: k => values.delete(k) }, getBoundingClientRect: () => ({ top: position + parseFloat(values.get('--pk-scroll-y') || '0') }) };
  if (clipped) clip.closest = () => null;
  const root = { querySelectorAll: () => [element], classList: classes() };
  const context = { exports: {}, getComputedStyle: () => ({ overflowY: 'auto' }), window: { innerHeight: 1000, addEventListener: (k,f) => events.set(k,f), removeEventListener: k => events.delete(k) }, requestAnimationFrame: f => { queued = f; return 1; }, cancelAnimationFrame: () => { queued = null; } };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(filename,'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText, context);
  const stop = context.exports.bindKeepsakeScrollMotion(root);
  return { values, events, stop, scroll(top) { position=top; events.get('scroll')(); const run=queued; queued=null; run(); } };
}
test('scroll down reveals, scrolling up reverses to the same intermediate position', () => {
  const f=fixture(); f.scroll(800); const midpoint=f.values.get('--pk-scroll-opacity');
  assert.ok(Number(midpoint)>0.12 && Number(midpoint)<1);
  f.scroll(600); assert.equal(Number(f.values.get('--pk-scroll-opacity')),1);
  f.scroll(800); assert.equal(f.values.get('--pk-scroll-opacity'),midpoint);
  f.scroll(1000); assert.equal(Number(f.values.get('--pk-scroll-opacity')),0.12);
  f.stop();
});
test('stationary scroll does not feed its own translation back into reveal progress', () => {
  const f=fixture(); f.scroll(800); const before=[...f.values];
  for(let i=0;i<20;i++) f.scroll(800);
  assert.deepEqual([...f.values],before); f.stop();
});
test('admin scrollport bounds control reveal instead of the whole window', () => {
  const f=fixture(true); f.scroll(580); assert.equal(Number(f.values.get('--pk-scroll-opacity')),0.12);
  f.scroll(400); assert.equal(Number(f.values.get('--pk-scroll-opacity')),1);
  f.scroll(580); assert.equal(Number(f.values.get('--pk-scroll-opacity')),0.12); f.stop();
});
test('cleanup removes listeners and inline reveal styles', () => {
  const f=fixture(); f.scroll(800); f.stop(); assert.equal(f.events.size,0); assert.equal(f.values.size,0);
});
