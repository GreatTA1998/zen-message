import assert from 'node:assert/strict';
import test from 'node:test';
import { isFirebaseAuthPath, proxyFirebaseAuth, rewriteAuthHandlerScript } from './firebaseAuthProxy.js';

test('only the auth helper path is proxied', () => {
  assert.equal(isFirebaseAuthPath('/__/auth/handler'), true);
  assert.equal(isFirebaseAuthPath('/__/auth/handler.js'), true);
  assert.equal(isFirebaseAuthPath('/app'), false);
  assert.equal(isFirebaseAuthPath('/'), false);
});

test('auth handler is served from this site without sending the browser to Firebase', async () => {
  const response = await proxyFirebaseAuth(new Request('https://zen-messenger.vercel.app/__/auth/handler'));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('location'), null);
  const body = await response.text();
  assert.match(body, /handler\.js/);
  assert.doesNotMatch(body, /project-z-e00fd\.firebaseapp\.com/);
});

test('auth handler script is proxied as javascript', async () => {
  const response = await proxyFirebaseAuth(new Request('https://zen-messenger.vercel.app/__/auth/handler.js'));
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type') ?? '', /javascript/);
  const body = await response.text();
  assert.match(body, /missing initial state/);
  assert.match(body, /oauthHelperState",P:"local"/);
  assert.doesNotMatch(body, /oauthHelperState",P:"session"/);
  assert.doesNotMatch(body, /project-z-e00fd\.firebaseapp\.com/);
});

test('handler state is stored where a new browser context can read it', () => {
  const source = 'before Jm={name:"oauthHelperState",P:"session"} after';
  assert.equal(
    rewriteAuthHandlerScript(source),
    'before Jm={name:"oauthHelperState",P:"local"} after',
  );
});
