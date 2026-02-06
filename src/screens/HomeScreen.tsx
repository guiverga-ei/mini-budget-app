import React, { useMemo, useState } from "react";
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
} from "react-native";

import type { Movement, MovementType } from "../types/movement";
import ExchangeRatesCard from "../components/ExchangeRatesCard";
import MovementsList from "../components/MovementsList";
import NewMovementCard from "../components/NewMovementCard";
import TotalsRow from "../components/TotalsRow";

import { useMovements } from "../hooks/useMovements";
import { useMonthCursor } from "../hooks/useMonthCursor"; 

// -------------------- Small helpers (UI / formatting) --------------------

// Returns today's date in YYYY-MM-DD format
function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

// Formats a number into EUR currency string
function formatEUR(value: number): string {
  return value.toLocaleString("en-IE", { style: "currency", currency: "EUR" });
}

// Parses user input into a valid positive number (supports "12.34" and "12,34")
function parseAmount(input: string): number | null {
  const normalized = input.trim().replace(",", ".");
  if (!normalized) return null;

  const n = Number(normalized);
  if (!Number.isFinite(n) || n <= 0) return null;

  // Keep at most 2 decimals
  return Math.round(n * 100) / 100;
}

// Extracts the month key from an ISO date string (YYYY-MM-DD -> YYYY-MM)
function monthKeyFromISO(dateISO: string): string {
  return dateISO.slice(0, 7);
}

// Human-readable month label for the header (e.g., "February 2026")
function monthLabel(d: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(d);
}

export default function HomeScreen() {
  // -------------------- Form state (new movement) --------------------

  // Controlled inputs for creating a new movement
  const [type, setType] = useState<MovementType>("EXPENSE");
  const [amountText, setAmountText] = useState("");
  const [note, setNote] = useState("");

  // -------------------- Edit modal state --------------------

  // Modal visibility and currently editing item
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Movement | null>(null);

  // Controlled inputs inside the edit modal
  const [editType, setEditType] = useState<MovementType>("EXPENSE");
  const [editAmountText, setEditAmountText] = useState("");
  const [editNote, setEditNote] = useState("");

  // -------------------- Month cursor (statement-like filter) --------------------
  const { cursor: monthCursor, key: activeMonthKey, prev, next } = useMonthCursor();

  // -------------------- Data hook (storage + CRUD) --------------------
  const { items, loading, add, update, remove } = useMovements();

  // Filter items for the active month
  const filteredItems = useMemo(() => {
    return items.filter((m) => monthKeyFromISO(m.date) === activeMonthKey);
  }, [items, activeMonthKey]);

  // Compute balance for the active month (income - expenses)
  const balance = useMemo(() => {
    let sum = 0;
    for (const m of filteredItems) {
      sum += m.type === "INCOME" ? m.amount : -m.amount;
    }
    return Math.round(sum * 100) / 100;
  }, [filteredItems]);

  // Compute totals (income, expenses, net) for the active month
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

  // -------------------- Actions (create / edit / delete) --------------------

  async function addMovement() {
    const amount = parseAmount(amountText);
    const cleanNote = note.trim();

    // Basic validation
    if (!amount) {
      Alert.alert("Invalid amount", "Enter a value greater than 0 (e.g. 12.50).");
      return;
    }
    if (!cleanNote) {
      Alert.alert("Note required", "Add a short description (e.g. Groceries).");
      return;
    }

    // Create new movement object
    const newItem: Movement = {
      id: String(Date.now()), // simple unique id (ok for demo apps)
      type,
      amount,
      note: cleanNote,
      date: todayISO(),
    };

    try {
      await add(newItem); // Persist via hook
      setAmountText("");
      setNote("");
    } catch {
      Alert.alert("Error", "Could not save data locally.");
    }
  }

  // Open edit modal and pre-fill fields
  function openEdit(item: Movement) {
    setEditing(item);
    setEditType(item.type);
    setEditAmountText(String(item.amount));
    setEditNote(item.note);
    setEditOpen(true);
  }

  // Reset edit state
  function closeEdit() {
    setEditOpen(false);
    setEditing(null);
    setEditAmountText("");
    setEditNote("");
    setEditType("EXPENSE");
  }

  // Save edited movement
  async function saveEdit() {
    if (!editing) return;

    const amount = parseAmount(editAmountText);
    const cleanNote = editNote.trim();

    if (!amount) {
      Alert.alert("Invalid amount", "Enter a value greater than 0 (e.g. 12.50).");
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

  // Remove movement (called after confirmation)
  async function removeMovement(id: string) {
    try {
      await remove(id);
    } catch {
      Alert.alert("Error", "Could not save data locally.");
    }
  }

  // Ask user to confirm deletion
  function confirmRemove(id: string) {
    Alert.alert("Delete movement", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => removeMovement(id) },
    ]);
  }

  // -------------------- Render --------------------

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.screen}>
          {loading ? (
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Mini Budget</Text>
              <Text style={styles.muted}>Loading…</Text>
            </View>
          ) : (
            <MovementsList
              items={filteredItems}
              onPressItem={openEdit}
              onLongPressItem={confirmRemove}
              formatAmount={formatEUR}
              emptyText={
                items.length === 0
                  ? "No movements yet. Add your first one above."
                  : "No movements in this month."
              }
              header={
                <View style={styles.headerContainer}>
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
                    onAdd={() => {
                      Keyboard.dismiss();
                      addMovement();
                    }}
                  />

                  {/* Month navigation header */}
                  <View style={styles.monthHeader}>
                    <Pressable onPress={prev} style={styles.monthBtn}>
                      <Text style={styles.monthBtnText}>Prev</Text>
                    </Pressable>

                    <View style={styles.monthCenter}>
                      <Text style={styles.monthTitle}>{monthLabel(monthCursor)}</Text>
                      <Text style={styles.monthSub}>
                        {filteredItems.length} movement
                        {filteredItems.length === 1 ? "" : "s"}
                      </Text>
                    </View>

                    <Pressable onPress={next} style={styles.monthBtn}>
                      <Text style={styles.monthBtnText}>Next</Text>
                    </Pressable>
                  </View>

                  <Text style={styles.hint}>
                    Tip: long-press a movement to delete it.
                  </Text>
                </View>
              }
            />
          )}

          {/* Edit modal (bottom sheet style) */}
          <Modal visible={editOpen} animationType="slide" transparent onRequestClose={closeEdit}>
            <TouchableWithoutFeedback onPress={closeEdit} accessible={false}>
              <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback accessible={false}>
                  <View style={styles.modalCard}>
                    <Text style={styles.modalTitle}>Edit movement</Text>

                    <View style={styles.row}>
                      <Pressable
                        onPress={() => setEditType("EXPENSE")}
                        style={[styles.chip, editType === "EXPENSE" && styles.chipActive]}
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
                        style={[styles.chip, editType === "INCOME" && styles.chipActive]}
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
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

// -------------------- Styles --------------------
// Those belong to MovementsList component, not HomeScreen.
const styles = StyleSheet.create({
  screen: { flex: 1 },

  headerContainer: { padding: 16, paddingTop: 48, gap: 12 },

  title: { fontSize: 26, fontWeight: "700" },
  muted: { color: "#6b7280" },

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

  hint: { color: "#6b7280", fontSize: 12, marginTop: 2 },

  // Modal styles
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

  // Reused controls inside modal
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
    flex: 1,
    backgroundColor: "#111827",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryBtnText: { color: "white", fontWeight: "700" },

  secondaryBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  secondaryBtnText: { fontWeight: "700" },

  // Month navigation
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
});
