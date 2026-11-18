/** Durable FIFO send queue (#81): disk before clear; serialized persist; memory∪disk; serial drain; fail→mark; ack removes. */

export function mergeOutbox(disk, memory) {
  const map = new Map();
  for (const item of disk || []) if (item?.id) map.set(item.id, item);
  for (const item of memory || []) if (item?.id) map.set(item.id, item);
  return [...map.values()];
}

export function createOutbox({ load, save, send, onChange = () => {} }) {
  let items = [];
  let gate = Promise.resolve();
  let busy = false;

  const setItems = (next) => {
    items = next;
    onChange(items);
  };

  const persist = (next) => {
    setItems(next);
    const write = gate.then(() => save(next));
    gate = write.catch(() => {});
    return write;
  };

  async function drain() {
    if (busy) return;
    busy = true;
    try {
      while (items[0] && !items[0].failed) {
        const item = items[0];
        try {
          await send(item);
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
      await persist(mergeOutbox(await load(), items));
      drain();
    },
    clear: () => persist([]),
  };
}
