import { normalizeCode } from './people.js';

export function isOutboxItem(item) {
  return (
    item &&
    typeof item.id === 'string' &&
    typeof item.contactId === 'string' &&
    typeof item.createdAt === 'number' &&
    (typeof item.body === 'string' || item.photo || item.sticker)
  );
}

export function parseOutbox(raw) {
  try {
    const parsed = JSON.parse(raw || '[]');
    return Array.isArray(parsed) ? parsed.filter(isOutboxItem) : [];
  } catch {
    return [];
  }
}

export function outboxThreadRows(items, contactId) {
  const id = normalizeCode(contactId);
  if (!id) return [];
  return (items || []).filter(isOutboxItem).flatMap((item) => {
    if (normalizeCode(item.contactId) !== id) return [];
    return [
      {
        id: item.id,
        contactId: item.contactId,
        contactName: item.contactName,
        body: item.body || '',
        photo: item.photo || null,
        sticker: item.sticker || null,
        intent: item.intent,
        createdAt: item.createdAt,
        visible: true,
        releaseAt: null,
        direction: 'out',
      },
    ];
  });
}
