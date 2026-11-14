import test from 'node:test';
import assert from 'node:assert/strict';
import { appleSubjectFromUser } from './firebaseAuth.js';

test('Apple session subject uses the linked Apple user id, not the Firebase uid', () => {
  const subject = appleSubjectFromUser({
    uid: 'firebase-uid-should-not-be-used',
    displayName: 'Elton Lin',
    providerData: [{ providerId: 'apple.com', uid: '000123.abc456def', displayName: 'Elton Lin' }],
  });
  assert.equal(subject?.subject, '000123.abc456def');
  assert.equal(subject?.provider, 'apple');
});

test('Apple session is rejected when the Apple provider uid is missing', () => {
  assert.equal(
    appleSubjectFromUser({
      uid: 'firebase-only-uid',
      providerData: [],
    }),
    null
  );
});