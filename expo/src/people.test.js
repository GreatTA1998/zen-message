import assert from 'node:assert/strict';
import test from 'node:test';
import { CODE_LENGTH, isCode, normalizeCode } from './people.js';

test('ids are 3 characters, digits and letters, either case', () => {
  assert.equal(CODE_LENGTH, 3);
  assert.equal(normalizeCode('  k7m '), 'K7M');
  assert.equal(isCode('k7m'), true);
  assert.equal(isCode('K7M'), true);
  assert.equal(isCode('K7'), false);
  assert.equal(isCode('K7MM'), false);
  assert.equal(isCode('K7-'), false);
});
