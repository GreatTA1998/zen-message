import assert from 'node:assert/strict';
import test from 'node:test';
import { clampCrop, hasDrawnInk, inkBounds } from './stickerExport.js';

test('hasDrawnInk needs at least two points in a stroke', () => {
  assert.equal(hasDrawnInk([]), false);
  assert.equal(hasDrawnInk([[], [{ x: 0, y: 0 }]]), false);
  assert.equal(hasDrawnInk([[{ x: 0, y: 0 }, { x: 1, y: 1 }]]), true);
});

test('inkBounds pads stroke and clampCrop stays on canvas', () => {
  assert.equal(inkBounds([]), null);
  assert.deepEqual(inkBounds([[{ x: 10, y: 20 }, { x: 40, y: 50 }]], 4), { x: 6, y: 16, width: 38, height: 38 });
  assert.deepEqual(clampCrop({ x: 90, y: 70, width: 40, height: 30 }, 100, 80), { x: 60, y: 50, width: 40, height: 30 });
});
