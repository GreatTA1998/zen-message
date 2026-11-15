import assert from 'node:assert/strict';
import test from 'node:test';
import { applyCropDrag, clampCrop, hasDrawnInk, inkBounds } from './stickerExport.js';

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

test('applyCropDrag moves and resizes within the canvas', () => {
  const start = { x: 20, y: 20, width: 60, height: 60 };
  assert.deepEqual(applyCropDrag(start, 'move', 10, -5, 200, 200), { x: 30, y: 15, width: 60, height: 60 });
  assert.deepEqual(applyCropDrag(start, 'se', 10, 10, 200, 200), { x: 20, y: 20, width: 70, height: 70 });
  assert.equal(applyCropDrag(start, 'nw', 50, 50, 200, 200).width >= 48, true);
  // East/south against the canvas edge must not slide the opposite edge.
  assert.deepEqual(applyCropDrag({ x: 150, y: 150, width: 40, height: 40 }, 'e', 100, 0, 200, 200), {
    x: 150,
    y: 150,
    width: 50,
    height: 40,
  });
  assert.deepEqual(applyCropDrag({ x: 150, y: 150, width: 40, height: 40 }, 's', 0, 100, 200, 200), {
    x: 150,
    y: 150,
    width: 40,
    height: 50,
  });
});
