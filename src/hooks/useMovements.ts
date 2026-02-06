import { useEffect, useState } from "react";
import type { Movement } from "../types/movement";
import { loadMovements, saveMovements } from "../lib/storage";

export function useMovements() {
  const [items, setItems] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const loaded = await loadMovements();
      loaded.sort((a, b) => b.date.localeCompare(a.date));
      setItems(loaded);
      setLoading(false);
    })();
  }, []);

  async function persist(next: Movement[]) {
    setItems(next);
    await saveMovements(next);
  }

  async function add(m: Movement) {
    const next = [m, ...items];
    await persist(next);
  }

  async function update(m: Movement) {
    const next = items.map((x) => (x.id === m.id ? m : x));
    await persist(next);
  }

  async function remove(id: string) {
    const next = items.filter((x) => x.id !== id);
    await persist(next);
  }

  return { items, loading, add, update, remove };
}
