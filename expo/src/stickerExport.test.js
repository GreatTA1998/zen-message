import assert from 'node:assert/strict';
import test from 'node:test';
import { hasDrawnInk } from './stickerExport.js';

test('hasDrawnInk needs at least two points in a stroke', () => {
  assert.equal(hasDrawnInk([]), false);
  assert.equal(hasDrawnInk([[], [{ x: 0, y: 0 }]]), false);
  assert.equal(hasDrawnInk([[{ x: 0, y: 0 }, { x: 1, y: 1 }]]), true);
});
