import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizePhoneInput } from './phoneNumber.js';

test('normalizePhoneInput accepts US and E.164 numbers', () => {
  assert.equal(normalizePhoneInput('503-250-3868'), '+15032503868');
  assert.equal(normalizePhoneInput('+44 7911 123456'), '+447911123456');
  assert.equal(normalizePhoneInput(''), '');
  assert.equal(normalizePhoneInput('12'), '');
});