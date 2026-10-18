import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('./googleSignIn.web.js', import.meta.url), 'utf8');

test('web Google sign-in stays on the first-party auth handler', () => {
  assert.match(source, /zen-messenger\.vercel\.app/);
  assert.match(source, /https:\/\/zen-messenger\.vercel\.app\/__\/auth\/handler/);
  assert.doesNotMatch(source, /project-z-e00fd\.firebaseapp\.com/);
  assert.doesNotMatch(source, /window\.open/);
});
