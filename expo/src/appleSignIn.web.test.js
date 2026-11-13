import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('./appleSignIn.web.js', import.meta.url), 'utf8');

test('web Apple sign-in uses a Firebase popup and keeps the Apple subject', () => {
  assert.match(source, /signInWithPopup/);
  assert.match(source, /OAuthProvider/);
  assert.match(source, /apple\.com/);
  assert.match(source, /appleSubjectFromUser/);
  assert.doesNotMatch(source, /signInWithRedirect/);
});
