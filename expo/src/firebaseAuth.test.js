import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('./firebaseAuth.js', import.meta.url), 'utf8');

test('Apple session subject uses the linked Apple user id, not the Firebase uid', () => {
  assert.match(source, /providerId === 'apple\.com'/);
  assert.match(source, /linked\?\.uid/);
  assert.doesNotMatch(source, /linked\?\.uid \|\| user\.uid/);
});

test('session subject prefers Apple when Google is also linked', () => {
  assert.match(source, /appleSubjectFromUser\(user\) \|\| googleSubjectFromUser\(user\)/);
});

test('hosted web origins use the site authDomain so /__/auth stays first-party', () => {
  assert.match(source, /zen-messenger\.vercel\.app/);
  assert.match(source, /project-z-e00fd\.firebaseapp\.com/);
  assert.match(source, /function resolveAuthDomain/);
  assert.match(source, /function restoreAuthSubject/);
});
