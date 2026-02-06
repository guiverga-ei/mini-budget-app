import { useEffect, useState } from "react";
import type { Movement } from "../types/movement";
import { loadMovements, saveMovements } from "../lib/storage";

// Custom hook to manage movements (income/expenses)
// Handles loading, saving, adding, updating and removing items
export function useMovements() {

  // State for movements list
  const [items, setItems] = useState<Movement[]>([]);

  // Loading state (true while data is being loaded)
  const [loading, setLoading] = useState(true);

  // Runs once when component mounts
  // Loads stored movements from local storage or database
  useEffect(() => {
    (async () => {

      // Load saved movements
      const loaded = await loadMovements();

      // Sort movements by date (newest first)
      loaded.sort((a, b) => b.date.localeCompare(a.date));

      // Save data into state
      setItems(loaded);

      // Stop loading indicator
      setLoading(false);
    })();
  }, []);

  // Helper function to update state and persist data
  async function persist(next: Movement[]) {
    setItems(next);          // Update UI immediately
    await saveMovements(next); // Save data to storage
  }

  // Add a new movement at the beginning of the list
  async function add(m: Movement) {
    const next = [m, ...items];
    await persist(next);
  }

  // Update an existing movement by id
  async function update(m: Movement) {
    const next = items.map((x) => (x.id === m.id ? m : x));
    await persist(next);
  }

  // Remove movement by id
  async function remove(id: string) {
    const next = items.filter((x) => x.id !== id);
    await persist(next);
  }

  // Expose data and CRUD functions
  return { items, loading, add, update, remove };
}
