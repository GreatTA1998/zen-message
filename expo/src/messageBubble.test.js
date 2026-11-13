import assert from 'node:assert/strict';
import test from 'node:test';
import { messageBubbleParts } from './messageBubble.js';

test('a photo-only message is its own bubble part', () => {
  assert.deepEqual(messageBubbleParts({ body: '', photo: 'data:image/png;base64,aa' }), ['photo']);
});

test('text and photo become separate bubble parts', () => {
  assert.deepEqual(messageBubbleParts({ body: 'Caption', photo: 'data:image/png;base64,aa' }), ['photo', 'text']);
});

test('whitespace body does not add a text bubble when a photo is present', () => {
  assert.deepEqual(messageBubbleParts({ body: '   ', photo: 'data:image/png;base64,aa' }), ['photo']);
});

test('text-only messages stay text', () => {
  assert.deepEqual(messageBubbleParts({ body: 'Hello', photo: null }), ['text']);
});

test('a sticker-only message is its own bubble part', () => {
  assert.deepEqual(messageBubbleParts({ body: '', sticker: 'data:image/png;base64,aa' }), ['sticker']);
});

test('sticker beats photo when both are present', () => {
  assert.deepEqual(
    messageBubbleParts({ body: '', sticker: 'data:image/png;base64,aa', photo: 'data:image/png;base64,bb' }),
    ['sticker'],
  );
});
