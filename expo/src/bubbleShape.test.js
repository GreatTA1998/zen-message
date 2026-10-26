import assert from 'node:assert/strict';
import { inflateSync } from 'node:zlib';
import test from 'node:test';
import { bubbleDataUri, outlinePath, rasterBubble } from './bubbleShape.js';

test('each bubble is one closed outline with the tail on its corner', () => {
  const own = outlinePath(180, 72, false);
  const incoming = outlinePath(180, 72, true);
  assert.equal(Array.isArray(own), true);
  assert.equal(own.length > 12, true);
  const ownTip = own.reduce((tip, point) => (point.y > tip.y ? point : tip));
  const incomingTip = incoming.reduce((tip, point) => (point.y < tip.y ? point : tip));
  assert.equal(ownTip.x > 140, true);
  assert.equal(ownTip.y > 60, true);
  assert.equal(incomingTip.x < 40, true);
  assert.equal(incomingTip.y < 12, true);
});

test('the outline is a single stroke with no second edge', () => {
  const own = rasterBubble(180, 72, false, 1);
  const middle = inkRuns(own, 30);
  assert.equal(middle.length, 2);
  middle.forEach((run) => assert.equal(run.width <= 6, true));
  assert.equal(filledAt(own, 90, 30), true);
  const tip = inkRuns(own, 70);
  assert.equal(tip.length, 1);
  assert.equal(tip[0].start > 150, true);

  const incoming = rasterBubble(180, 72, true, 1);
  const incomingTip = inkRuns(incoming, 1);
  assert.equal(incomingTip.length, 1);
  assert.equal(incomingTip[0].start < 30, true);
  assert.equal(filledAt(incoming, 90, 40), true);
  assert.equal(filledShare(own) > 0.45, true);
});

function inkRuns(image, y) {
  const runs = [];
  let start = -1;
  for (let x = 0; x <= image.width; x += 1) {
    const on = x < image.width && inkAlpha(image, x, y) > 80;
    if (on && start < 0) start = x;
    if (!on && start >= 0) {
      runs.push({ start, width: x - start });
      start = -1;
    }
  }
  return runs;
}

function inkAlpha(image, x, y) {
  const offset = (y * image.width + x) * 4;
  const alpha = image.rgba[offset + 3];
  return alpha > 80 && image.rgba[offset] < 80 ? alpha : 0;
}

function filledAt(image, x, y) {
  const offset = (y * image.width + x) * 4;
  return image.rgba[offset + 3] > 240 && image.rgba[offset] > 200 && image.rgba[offset] < 245;
}

function filledShare(image) {
  let filled = 0;
  const pixels = image.width * image.height;
  for (let i = 0; i < pixels; i += 1) {
    if (image.rgba[i * 4 + 3] > 240 && image.rgba[i * 4] > 200) filled += 1;
  }
  return filled / pixels;
}

test('the png round-trips through zlib', () => {
  const uri = bubbleDataUri(48, 36, false, 1);
  const png = Buffer.from(uri.slice(uri.indexOf(',') + 1), 'base64');
  assert.equal(png[0], 137);
  let offset = 8;
  let inflated = null;
  while (offset + 8 <= png.length) {
    const length = png.readUInt32BE(offset);
    const type = png.subarray(offset + 4, offset + 8).toString('ascii');
    const data = png.subarray(offset + 8, offset + 8 + length);
    if (type === 'IDAT') inflated = inflateSync(data);
    offset += 12 + length;
  }
  assert.equal(inflated.length, (48 * 4 + 1) * 36);
});
