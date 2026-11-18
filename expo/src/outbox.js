/** FIFO outbox (#81). Queue JSON never stores data-URLs — media is side-stored by id. */

export function mergeOutbox(disk, memory) {
  const map = new Map();
  for (const item of disk || []) if (item?.id) map.set(item.id, item);
  for (const item of memory || []) if (item?.id) map.set(item.id, item);
  return [...map.values()];
}

export function slimOutboxItem({ photo, sticker, hasPhoto, hasSticker, ...rest }) {
  return { ...rest, photo: null, sticker: null };
}

const isData = (v) => typeof v === 'string' && v.startsWith('data:image/');

export function createOutbox({ load, save, send, media, onChange = () => {} }) {
  let items = [];
  let gate = Promise.resolve();
  let busy = false;

  const setItems = (next) => {
    items = next;
    onChange(items);
  };

  const persist = (next) => {
    const prev = items;
    setItems(next);
    const write = gate.then(async () => {
      const keep = new Set(next.map((row) => row.id));
      for (const row of prev) if (!keep.has(row.id)) await media.remove(row.id);
      for (const row of next) {
        if (row.photo || row.sticker) await media.put(row.id, { photo: row.photo || null, sticker: row.sticker || null });
        else await media.remove(row.id);
      }
      await save(next.map(slimOutboxItem));
    });
    gate = write.catch(() => {});
    return write;
  };

  async function restore(row) {
    if (isData(row.photo) || isData(row.sticker)) {
      await media.put(row.id, { photo: row.photo || null, sticker: row.sticker || null });
      return { ...row, photo: row.photo || null, sticker: row.sticker || null };
    }
    const blob = (await media.get(row.id)) || {};
    return { ...row, photo: blob.photo || null, sticker: blob.sticker || null };
  }

  async function drain() {
    if (busy) return;
    busy = true;
    try {
      while (items[0] && !items[0].failed) {
        const item = items[0];
        try {
          await send(item);
          await media.remove(item.id);
          await persist(items.slice(1));
        } catch {
          setItems([{ ...item, failed: true }, ...items.slice(1)]);
          break;
        }
      }
    } finally {
      busy = false;
    }
  }

  async function enqueue(item) {
    const prev = items;
    try {
      await persist([...prev, item]);
    } catch (error) {
      setItems(prev);
      throw error;
    }
    drain();
    return item;
  }

  return {
    snapshot: () => items,
    persist,
    enqueue,
    drain,
    retry(id) {
      persist(items.map((row) => (row.id === id ? { ...row, failed: false } : row))).catch(() => {});
      drain();
    },
    resume() {
      setItems(items.map((row) => (row.failed ? { ...row, failed: false } : row)));
      drain();
    },
    async hydrate() {
      const disk = [];
      for (const row of (await load()) || []) disk.push(await restore(row));
      await persist(mergeOutbox(disk, items));
      drain();
    },
  };
}
