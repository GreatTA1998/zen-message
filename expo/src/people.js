export function normalizeUsername(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '');
}

export function isUsername(value) {
  return /^[a-z][a-z0-9_]{2,19}$/.test(value);
}

export function searchPeople(people, query, { selfId, excludeIds = [] } = {}) {
  const needle = normalizeUsername(query);
  if (!needle) return [];
  const excluded = new Set(excludeIds);
  return people
    .filter(
      (person) =>
        person.id !== selfId &&
        !excluded.has(person.id) &&
        typeof person.username === 'string' &&
        person.username.includes(needle)
    )
    .slice(0, 8);
}
