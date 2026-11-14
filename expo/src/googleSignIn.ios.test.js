import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('./googleSignIn.ios.js', import.meta.url), 'utf8');

test('iPhone Google sign-in uses the native Google SDK and Firebase credentials', () => {
  assert.match(source, /@react-native-google-signin\/google-signin/);
  assert.match(source, /GoogleSignin\.signIn/);
  assert.match(source, /signInWithCredential/);
  assert.match(source, /GOOGLE_WEB_CLIENT_ID/);
  assert.match(source, /GOOGLE_IOS_CLIENT_ID/);
  assert.doesNotMatch(source, /signInWithPopup/);
  assert.doesNotMatch(source, /WebBrowser\.open/);
});
