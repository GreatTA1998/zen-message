import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('./LoginView.js', import.meta.url), 'utf8');

test('login shows Google and Apple on web and iPhone', () => {
  assert.match(source, /signInWithGoogle/);
  assert.match(source, /signInWithApple/);
  assert.match(source, /dualLogin/);
  assert.match(source, /google-login/);
  assert.match(source, /apple-login/);
  assert.match(source, /phone-login/);
  assert.match(source, /mode === 'phone'/);
  assert.doesNotMatch(source, /Platform\.OS === 'web' \? <GoogleButton/);
});
