import assert from 'node:assert/strict';
import test from 'node:test';
import { isUsername, normalizeUsername, searchPeople } from './people.js';

test('usernames are short and start with a letter', () => {
  assert.equal(normalizeUsername('  Ada_Bird '), 'ada_bird');
  assert.equal(isUsername('ada'), true);
  assert.equal(isUsername('a'), false);
  assert.equal(isUsername('1ada'), false);
});

test('search matches usernames and skips people already added', () => {
  const people = [
    { id: 'me', username: 'ada' },
    { id: '1', username: 'pip' },
    { id: '2', username: 'piper' },
    { id: '3', username: 'moss' },
  ];
  assert.deepEqual(
    searchPeople(people, 'pip', { selfId: 'me', excludeIds: ['1'] }).map((person) => person.username),
    ['piper']
  );
  assert.deepEqual(searchPeople(people, '   ', { selfId: 'me' }), []);
});
