import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('./googleSignIn.web.js', import.meta.url), 'utf8');

test('web Google sign-in uses a popup on the Firebase auth handler', () => {
  assert.match(source, /signInWithPopup/);
  assert.match(source, /authDomain: AUTH_DOMAIN/);
  assert.match(source, /project-z-e00fd\.firebaseapp\.com/);
  assert.match(source, /https:\/\/project-z-e00fd\.firebaseapp\.com\/__\/auth\/handler/);
  assert.doesNotMatch(source, /signInWithRedirect/);
  assert.doesNotMatch(source, /window\.open/);
  assert.doesNotMatch(source, /zen-messenger\.vercel\.app/);
});
