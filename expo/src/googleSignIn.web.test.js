import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('./googleSignIn.web.js', import.meta.url), 'utf8');
const shared = readFileSync(new URL('./firebaseAuth.js', import.meta.url), 'utf8');

test('web Google sign-in uses a popup on the hosted auth handler', () => {
  assert.match(source, /signInWithPopup/);
  assert.match(source, /firebaseAuth/);
  assert.match(source, /sessionSubjectFromUser/);
  assert.doesNotMatch(source, /select_account/);
  assert.doesNotMatch(source, /signInWithRedirect/);
  assert.doesNotMatch(source, /window\.open/);
  assert.match(shared, /resolveAuthDomain/);
  assert.match(shared, /zen-messenger\.vercel\.app/);
  assert.match(shared, /project-z-e00fd\.firebaseapp\.com/);
  assert.match(shared, /__\/auth\/handler/);
  assert.match(shared, /restoreAuthSubject/);
});
