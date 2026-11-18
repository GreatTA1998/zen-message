import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('./LoginView.js', import.meta.url), 'utf8');

test('login shows Google and Apple only', () => {
  assert.match(source, /signInWithGoogle/);
  assert.match(source, /signInWithApple/);
  assert.match(source, /google-login/);
  assert.match(source, /apple-login/);
  assert.doesNotMatch(source, /phone-login/);
  assert.doesNotMatch(source, /phoneSignIn/);
  assert.doesNotMatch(source, /Platform\.OS === 'web' \? <GoogleButton/);
});
