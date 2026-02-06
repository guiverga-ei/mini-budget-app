import React from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import type { MovementType } from "../types/movement";

type Props = {
  type: MovementType;
  amountText: string;
  note: string;
  onChangeType: (t: MovementType) => void;
  onChangeAmountText: (v: string) => void;
  onChangeNote: (v: string) => void;
  onAdd: () => void;
};

export default function NewMovementCard({
  type,
  amountText,
  note,
  onChangeType,
  onChangeAmountText,
  onChangeNote,
  onAdd,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>New movement</Text>

      <View style={styles.row}>
        <Pressable
          onPress={() => onChangeType("EXPENSE")}
          style={[styles.chip, type === "EXPENSE" && styles.chipActive]}
        >
          <Text style={[styles.chipText, type === "EXPENSE" && styles.chipTextActive]}>
            Expense
          </Text>
        </Pressable>

        <Pressable
          onPress={() => onChangeType("INCOME")}
          style={[styles.chip, type === "INCOME" && styles.chipActive]}
        >
          <Text style={[styles.chipText, type === "INCOME" && styles.chipTextActive]}>
            Income
          </Text>
        </Pressable>
      </View>

      <TextInput
        value={amountText}
        onChangeText={onChangeAmountText}
        placeholder="Amount (e.g. 12.50)"
        keyboardType="decimal-pad"
        style={styles.input}
      />

      <TextInput
        value={note}
        onChangeText={onChangeNote}
        placeholder="Note (e.g. Groceries)"
        style={styles.input}
      />

      <Pressable onPress={onAdd} style={styles.primaryBtn}>
        <Text style={styles.primaryBtnText}>Add</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    gap: 10,
  },
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
});
