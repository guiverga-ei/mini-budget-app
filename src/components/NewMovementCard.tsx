import React from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import type { MovementType } from "../types/movement";

// Props definition for the new movement form
// All state is controlled outside (parent component)
type Props = {
  type: MovementType; // Current selected type (EXPENSE or INCOME)
  amountText: string; // Amount input as text
  note: string; // Note/description text

  // Callback functions to update state in parent
  onChangeType: (t: MovementType) => void;
  onChangeAmountText: (v: string) => void;
  onChangeNote: (v: string) => void;
  onAdd: () => void; // Called when user presses Add button
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
      {/* Section title */}
      <Text style={styles.sectionTitle}>New movement</Text>

      {/* Movement type selector (Expense / Income) */}
      <View style={styles.row}>

        {/* Expense button */}
        <Pressable
          onPress={() => onChangeType("EXPENSE")}
          style={[styles.chip, type === "EXPENSE" && styles.chipActive]}
        >
          <Text style={[styles.chipText, type === "EXPENSE" && styles.chipTextActive]}>
            Expense
          </Text>
        </Pressable>

        {/* Income button */}
        <Pressable
          onPress={() => onChangeType("INCOME")}
          style={[styles.chip, type === "INCOME" && styles.chipActive]}
        >
          <Text style={[styles.chipText, type === "INCOME" && styles.chipTextActive]}>
            Income
          </Text>
        </Pressable>

      </View>

      {/* Amount input field */}
      <TextInput
        value={amountText}
        onChangeText={onChangeAmountText}
        placeholder="Amount (e.g. 12.50)"
        keyboardType="decimal-pad" // Numeric keyboard on mobile
        style={styles.input}
      />

      {/* Note/description input field */}
      <TextInput
        value={note}
        onChangeText={onChangeNote}
        placeholder="Note (e.g. Groceries)"
        style={styles.input}
      />

      {/* Submit button */}
      <Pressable onPress={onAdd} style={styles.primaryBtn}>
        <Text style={styles.primaryBtnText}>Add</Text>
      </Pressable>
    </View>
  );
}

// Local styles for the component
const styles = StyleSheet.create({

  // Card container style
  card: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    gap: 10,
  },

  // Section title style
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
  },

  // Horizontal row layout
  row: {
    flexDirection: "row",
    gap: 10,
  },

  // Base chip button style
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999, // Pill shape
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  // Active chip style
  chipActive: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },

  // Chip text default style
  chipText: {
    color: "#111827",
    fontWeight: "600",
  },

  // Chip text active style
  chipTextActive: {
    color: "#ffffff",
  },

  // Input field style
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
  },

  // Main button style
  primaryBtn: {
    backgroundColor: "#111827",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  primaryBtnText: {
    color: "white",
    fontWeight: "700",
  },
});
