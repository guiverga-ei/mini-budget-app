import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";

import type { Movement, MovementType } from "../types/movement";
import { loadMovements, saveMovements } from "../lib/storage";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatEUR(value: number): string {
  return value.toLocaleString("en-IE", { style: "currency", currency: "EUR" });
}

function parseAmount(input: string): number | null {
  // Accepts "12.34" or "12,34"
  const normalized = input.trim().replace(",", ".");
  if (!normalized) return null;

  const n = Number(normalized);
  if (!Number.isFinite(n) || n <= 0) return null;

  return Math.round(n * 100) / 100;
}

export default function HomeScreen() {
  const [items, setItems] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);

  // form state
  const [type, setType] = useState<MovementType>("EXPENSE");
  const [amountText, setAmountText] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    (async () => {
      const loaded = await loadMovements();
      loaded.sort((a, b) => b.date.localeCompare(a.date));
      setItems(loaded);
      setLoading(false);
    })();
  }, []);

  const balance = useMemo(() => {
    let sum = 0;
    for (const m of items) {
      sum += m.type === "INCOME" ? m.amount : -m.amount;
    }
    return Math.round(sum * 100) / 100;
  }, [items]);

  async function addMovement() {
    const amount = parseAmount(amountText);
    const cleanNote = note.trim();

    if (!amount) {
      Alert.alert("Invalid amount", "Enter a value greater than 0 (e.g. 12.50).");
      return;
    }
    if (!cleanNote) {
      Alert.alert("Note required", "Add a short description (e.g. Groceries).");
      return;
    }

    const newItem: Movement = {
      id: String(Date.now()),
      type,
      amount,
      note: cleanNote,
      date: todayISO(),
    };

    const next = [newItem, ...items];
    setItems(next);
    setAmountText("");
    setNote("");

    try {
      await saveMovements(next);
    } catch {
      Alert.alert("Error", "Could not save data locally.");
    }
  }

  async function removeMovement(id: string) {
    const next = items.filter((x) => x.id !== id);
    setItems(next);
    try {
      await saveMovements(next);
    } catch {
      Alert.alert("Error", "Could not save data locally.");
    }
  }

  function confirmRemove(id: string) {
    Alert.alert("Delete movement", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => removeMovement(id) },
    ]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mini Budget</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Balance</Text>
        <Text style={styles.balance}>{formatEUR(balance)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>New movement</Text>

        <View style={styles.row}>
          <Pressable
            onPress={() => setType("EXPENSE")}
            style={[styles.chip, type === "EXPENSE" && styles.chipActive]}
          >
            <Text style={[styles.chipText, type === "EXPENSE" && styles.chipTextActive]}>
              Expense
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setType("INCOME")}
            style={[styles.chip, type === "INCOME" && styles.chipActive]}
          >
            <Text style={[styles.chipText, type === "INCOME" && styles.chipTextActive]}>
              Income
            </Text>
          </Pressable>
        </View>

        <TextInput
          value={amountText}
          onChangeText={setAmountText}
          placeholder="Amount (e.g. 12.50)"
          keyboardType="decimal-pad"
          style={styles.input}
        />

        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Note (e.g. Groceries)"
          style={styles.input}
        />

        <Pressable onPress={addMovement} style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>Add</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Movements</Text>

      {loading ? (
        <Text style={styles.muted}>Loading…</Text>
      ) : items.length === 0 ? (
        <Text style={styles.muted}>No movements yet. Add your first one above.</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(x) => x.id}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => {
            const isIncome = item.type === "INCOME";
            return (
              <Pressable
                onLongPress={() => confirmRemove(item.id)}
                style={[styles.item, isIncome ? styles.itemIncome : styles.itemExpense]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemNote}>{item.note}</Text>
                  <Text style={styles.itemMeta}>{item.date}</Text>
                </View>

                <Text style={styles.itemAmount}>
                  {isIncome ? "+" : "-"} {formatEUR(item.amount)}
                </Text>
              </Pressable>
            );
          }}
        />
      )}

      <Text style={styles.hint}>Tip: long-press a movement to delete it.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 48, gap: 12 },
  title: { fontSize: 26, fontWeight: "700" },

  card: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    gap: 10,
  },

  label: { color: "#6b7280" },
  balance: { fontSize: 22, fontWeight: "700" },

  sectionTitle: { fontSize: 16, fontWeight: "600", marginTop: 4 },

  row: { flexDirection: "row", gap: 10 },

  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  chipActive: { backgroundColor: "#111827", borderColor: "#111827" },
  chipText: { color: "#111827", fontWeight: "600" },
  chipTextActive: { color: "#ffffff" },

  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
  },

  primaryBtn: {
    backgroundColor: "#111827",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryBtnText: { color: "white", fontWeight: "700" },

  muted: { color: "#6b7280" },

  item: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  itemIncome: { backgroundColor: "#ecfdf5" },  // soft green
  itemExpense: { backgroundColor: "#fef2f2" }, // soft red

  itemNote: { fontSize: 15, fontWeight: "600" },
  itemMeta: { color: "#6b7280", marginTop: 2, fontSize: 12 },
  itemAmount: { fontWeight: "800" },

  hint: { color: "#6b7280", fontSize: 12, marginTop: 2 },
});
