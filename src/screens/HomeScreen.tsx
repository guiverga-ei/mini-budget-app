import { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Modal,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import type { Movement, MovementType } from "../types/movement";
import ExchangeRatesCard from "../components/ExchangeRatesCard";
import MovementsList from "../components/MovementsList";
import NewMovementCard from "../components/NewMovementCard";
import TotalsRow from "../components/TotalsRow";
import { useMovements } from "../hooks/useMovements";

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

function monthKeyFromISO(dateISO: string): string {
  // dateISO is "YYYY-MM-DD" -> monthKey "YYYY-MM"
  return dateISO.slice(0, 7);
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function addMonths(d: Date, delta: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + delta, 1);
}

function monthKeyFromDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function monthLabel(d: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(d);
}

export default function HomeScreen() {
  // form state
  const [type, setType] = useState<MovementType>("EXPENSE");
  const [amountText, setAmountText] = useState("");
  const [note, setNote] = useState("");

  // edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Movement | null>(null);

  // edit form fields
  const [editType, setEditType] = useState<MovementType>("EXPENSE");
  const [editAmountText, setEditAmountText] = useState("");
  const [editNote, setEditNote] = useState("");

  // month filter (statement-like)
  const [monthCursor, setMonthCursor] = useState<Date>(() =>
    startOfMonth(new Date()),
  );

  const activeMonthKey = useMemo(
    () => monthKeyFromDate(monthCursor),
    [monthCursor],
  );

  const { items, loading, add, update, remove } = useMovements();

  const filteredItems = useMemo(() => {
    return items.filter((m) => monthKeyFromISO(m.date) === activeMonthKey);
  }, [items, activeMonthKey]);

  const balance = useMemo(() => {
    let sum = 0;
    for (const m of filteredItems) {
      sum += m.type === "INCOME" ? m.amount : -m.amount;
    }
    return Math.round(sum * 100) / 100;
  }, [filteredItems]);

  const monthTotals = useMemo(() => {
    let income = 0;
    let expenses = 0;

    for (const m of filteredItems) {
      if (m.type === "INCOME") income += m.amount;
      else expenses += m.amount;
    }

    income = Math.round(income * 100) / 100;
    expenses = Math.round(expenses * 100) / 100;

    return {
      income,
      expenses,
      net: Math.round((income - expenses) * 100) / 100,
    };
  }, [filteredItems]);

  async function addMovement() {
    const amount = parseAmount(amountText);
    const cleanNote = note.trim();

    if (!amount) {
      Alert.alert(
        "Invalid amount",
        "Enter a value greater than 0 (e.g. 12.50).",
      );
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

    try {
      await add(newItem); // ✅ usa o hook
      setAmountText("");
      setNote("");
    } catch {
      Alert.alert("Error", "Could not save data locally.");
    }
  }

  function openEdit(item: Movement) {
    setEditing(item);
    setEditType(item.type);
    setEditAmountText(String(item.amount));
    setEditNote(item.note);
    setEditOpen(true);
  }

  function closeEdit() {
    setEditOpen(false);
    setEditing(null);
    setEditAmountText("");
    setEditNote("");
    setEditType("EXPENSE");
  }

  async function saveEdit() {
    if (!editing) return;

    const amount = parseAmount(editAmountText);
    const cleanNote = editNote.trim();

    if (!amount) {
      Alert.alert(
        "Invalid amount",
        "Enter a value greater than 0 (e.g. 12.50).",
      );
      return;
    }
    if (!cleanNote) {
      Alert.alert("Note required", "Add a short description (e.g. Groceries).");
      return;
    }

    const updated: Movement = {
      ...editing,
      type: editType,
      amount,
      note: cleanNote,
    };

    try {
      await update(updated);
      closeEdit();
    } catch {
      Alert.alert("Error", "Could not save data locally.");
    }
  }

  async function removeMovement(id: string) {
    try {
      await remove(id); // ✅ usa o hook
    } catch {
      Alert.alert("Error", "Could not save data locally.");
    }
  }

  function confirmRemove(id: string) {
    Alert.alert("Delete movement", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => removeMovement(id),
      },
    ]);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Mini Budget</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Balance</Text>
            <Text style={styles.balance}>{formatEUR(balance)}</Text>
          </View>

          <TotalsRow
            income={formatEUR(monthTotals.income)}
            expenses={formatEUR(monthTotals.expenses)}
            net={formatEUR(monthTotals.net)}
          />

          <ExchangeRatesCard />

          <NewMovementCard
            type={type}
            amountText={amountText}
            note={note}
            onChangeType={setType}
            onChangeAmountText={setAmountText}
            onChangeNote={setNote}
            onAdd={addMovement}
          />

          <View style={styles.monthHeader}>
            <Pressable
              onPress={() => setMonthCursor((d) => addMonths(d, -1))}
              style={styles.monthBtn}
            >
              <Text style={styles.monthBtnText}>Prev</Text>
            </Pressable>

            <View style={styles.monthCenter}>
              <Text style={styles.monthTitle}>{monthLabel(monthCursor)}</Text>
              <Text style={styles.monthSub}>
                {filteredItems.length} movement
                {filteredItems.length === 1 ? "" : "s"}
              </Text>
            </View>

            <Pressable
              onPress={() => setMonthCursor((d) => addMonths(d, +1))}
              style={styles.monthBtn}
            >
              <Text style={styles.monthBtnText}>Next</Text>
            </Pressable>
          </View>

          {loading ? (
            <Text style={styles.muted}>Loading…</Text>
          ) : items.length === 0 ? (
            <Text style={styles.muted}>
              No movements yet. Add your first one above.
            </Text>
          ) : filteredItems.length === 0 ? (
            <Text style={styles.muted}>No movements in this month.</Text>
          ) : (
            <MovementsList
              loading={false}
              items={filteredItems}
              onPressItem={openEdit}
              onLongPressItem={(id) => confirmRemove(id)}
              formatAmount={formatEUR}
            />
          )}

          <Text style={styles.hint}>
            Tip: long-press a movement to delete it.
          </Text>

          <Modal visible={editOpen} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
              <View style={styles.modalCard}>
                <Text style={styles.modalTitle}>Edit movement</Text>

                <View style={styles.row}>
                  <Pressable
                    onPress={() => setEditType("EXPENSE")}
                    style={[
                      styles.chip,
                      editType === "EXPENSE" && styles.chipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        editType === "EXPENSE" && styles.chipTextActive,
                      ]}
                    >
                      Expense
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setEditType("INCOME")}
                    style={[
                      styles.chip,
                      editType === "INCOME" && styles.chipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        editType === "INCOME" && styles.chipTextActive,
                      ]}
                    >
                      Income
                    </Text>
                  </Pressable>
                </View>

                <TextInput
                  value={editAmountText}
                  onChangeText={setEditAmountText}
                  placeholder="Amount (e.g. 12.50)"
                  keyboardType="decimal-pad"
                  style={styles.input}
                />

                <TextInput
                  value={editNote}
                  onChangeText={setEditNote}
                  placeholder="Note (e.g. Groceries)"
                  style={styles.input}
                />

                <View style={styles.modalButtons}>
                  <Pressable onPress={closeEdit} style={styles.secondaryBtn}>
                    <Text style={styles.secondaryBtnText}>Cancel</Text>
                  </Pressable>

                  <Pressable onPress={saveEdit} style={styles.primaryBtn}>
                    <Text style={styles.primaryBtnText}>Save</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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

  chipActive: { backgroundColor: "#111827", borderColor: "#111827" },
  chipText: { color: "#111827", fontWeight: "600" },
  chipTextActive: { color: "#ffffff" },

  primaryBtnText: { color: "white", fontWeight: "700" },

  muted: { color: "#6b7280" },

  itemIncome: { backgroundColor: "#ecfdf5" }, // soft green
  itemExpense: { backgroundColor: "#fef2f2" }, // soft red

  itemNote: { fontSize: 15, fontWeight: "600" },
  itemMeta: { color: "#6b7280", marginTop: 2, fontSize: 12 },
  itemAmount: { fontWeight: "800" },

  hint: { color: "#6b7280", fontSize: 12, marginTop: 2 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    gap: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: "700" },
  modalButtons: { flexDirection: "row", gap: 12, marginTop: 6 },
  secondaryBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  secondaryBtnText: { fontWeight: "700" },

  monthHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 4,
  },
  monthBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  monthBtnText: { fontWeight: "700" },
  monthCenter: { flex: 1, alignItems: "center" },
  monthTitle: { fontSize: 16, fontWeight: "700" },
  monthSub: { color: "#6b7280", marginTop: 2, fontSize: 12 },

  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

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
});
