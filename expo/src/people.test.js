import assert from 'node:assert/strict';
import test from 'node:test';
import { CODE_LENGTH, accountCode, firstName, hasConfusingCharacter, isCode, normalizeCode } from './people.js';

test('ids are 3 characters, digits and letters, either case', () => {
  assert.equal(CODE_LENGTH, 3);
  assert.equal(normalizeCode('  k7m '), 'K7M');
  assert.equal(isCode('k7m'), true);
  assert.equal(isCode('K7M'), true);
  assert.equal(normalizeCode('abi'), 'ABI');
  assert.equal(isCode('abi'), false);
  assert.equal(isCode('k7l'), false);
  assert.equal(isCode('K71'), false);
  assert.equal(hasConfusingCharacter('k7i'), true);
  assert.equal(hasConfusingCharacter('k7l'), true);
  assert.equal(hasConfusingCharacter('K71'), true);
  assert.equal(hasConfusingCharacter('k7m'), false);
  assert.equal(isCode('K7'), false);
  assert.equal(isCode('K7MM'), false);
  assert.equal(isCode('K7-'), false);
});

test('an account keeps the same 3-character ID', () => {
  const first = accountCode('google', 'google-user-laptop');
  const again = accountCode('google', 'google-user-laptop');
  const other = accountCode('apple', 'apple-user-phone');
  assert.equal(again, first);
  assert.notEqual(other, first);
  assert.equal(isCode(first), true);
  assert.equal(firstName('Ada Lovelace'), 'Ada');
  assert.equal(firstName('  '), '');
});
