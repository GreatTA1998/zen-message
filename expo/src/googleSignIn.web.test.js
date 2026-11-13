import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('./googleSignIn.web.js', import.meta.url), 'utf8');

test('web Google sign-in uses a popup on the Firebase auth handler', () => {
  const shared = readFileSync(new URL('./firebaseAuth.js', import.meta.url), 'utf8');
  assert.match(source, /signInWithPopup/);
  assert.match(source, /firebaseAuth/);
  assert.match(shared, /authDomain: AUTH_DOMAIN/);
  assert.match(shared, /project-z-e00fd\.firebaseapp\.com/);
  assert.match(shared, /GOOGLE_REDIRECT_URI/);
  assert.match(shared, /AUTH_DOMAIN/);
  assert.match(shared, /__\/auth\/handler/);
  assert.doesNotMatch(source, /signInWithRedirect/);
  assert.doesNotMatch(source, /window\.open/);
  assert.doesNotMatch(source, /zen-messenger\.vercel\.app/);
});
