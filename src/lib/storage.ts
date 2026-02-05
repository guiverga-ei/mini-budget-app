import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Movement } from "../types/movement";

const KEY = "mini_budget_movements_v1";

export async function loadMovements(): Promise<Movement[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Movement[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveMovements(movements: Movement[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(movements));
}
