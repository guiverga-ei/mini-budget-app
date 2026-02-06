import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Movement } from "../types/movement";

// Storage key used to save movements locally
// Version suffix (_v1) helps future migrations if structure changes
const KEY = "mini_budget_movements_v1";

// Load movements from local device storage
export async function loadMovements(): Promise<Movement[]> {

  // Read raw string data from AsyncStorage
  const raw = await AsyncStorage.getItem(KEY);

  // If nothing saved yet, return empty list
  if (!raw) return [];

  try {
    // Convert JSON string back into JavaScript object
    const parsed = JSON.parse(raw) as Movement[];

    // Ensure the result is an array
    return Array.isArray(parsed) ? parsed : [];

  } catch {
    // If JSON parsing fails (corrupted data),
    // return empty array to avoid crashes
    return [];
  }
}

// Save movements to local device storage
export async function saveMovements(movements: Movement[]): Promise<void> {

  // Convert object to JSON string before saving
  await AsyncStorage.setItem(KEY, JSON.stringify(movements));
}
