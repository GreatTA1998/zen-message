import assert from 'node:assert/strict';
import test from 'node:test';
import { messagePhoto, photoFromPickerAsset } from './delivery.js';

test('HEIC picker assets normalize to JPEG data URLs', () => {
  const asset = {
    type: 'image',
    mimeType: 'image/heic',
    base64: 'aGVsbG8=',
  };
  assert.equal(photoFromPickerAsset(asset), 'data:image/jpeg;base64,aGVsbG8=');
});

test('messagePhoto accepts HEIC labels and stores JPEG', () => {
  assert.equal(messagePhoto('data:image/heic;base64,abcd'), 'data:image/jpeg;base64,abcd');
});

test('picker assets without base64 are ignored', () => {
  assert.equal(photoFromPickerAsset({ type: 'image', mimeType: 'image/jpeg', uri: 'file:///x' }), null);
});
