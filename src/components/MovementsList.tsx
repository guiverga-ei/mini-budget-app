import React from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import type { Movement } from "../types/movement";

// Props definition for this list component
// Makes the component reusable and flexible
type Props = {
  items: Movement[]; // List of movements (income/expense)
  onPressItem: (item: Movement) => void; // Triggered when user taps an item
  onLongPressItem: (id: string) => void; // Triggered when user long presses an item
  formatAmount: (amount: number) => string; // Function to format currency values

  header?: React.ReactElement | null; // Optional header component
  emptyText?: string; // Text shown when list is empty
};

export default function MovementsList({
  items,
  onPressItem,
  onLongPressItem,
  formatAmount,
  header = null,
  emptyText = "No movements yet. Add your first one above.",
}: Props) {
  return (
    <FlatList
      // Data source for the list
      data={items}

      // Unique key for each item (important for performance)
      keyExtractor={(x) => x.id}

      // Optional header displayed above the list
      ListHeaderComponent={header}

      // Message displayed if there are no items
      ListEmptyComponent={<Text style={styles.muted}>{emptyText}</Text>}

      // Adds padding at the bottom of the list
      contentContainerStyle={{ paddingBottom: 24 }}

      // Controls keyboard behaviour when tapping items
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"

      // Function to render each list item
      renderItem={({ item }) => {
        // Check if movement is income or expense
        const isIncome = item.type === "INCOME";

        return (
          <Pressable
            // Normal tap action
            onPress={() => onPressItem(item)}

            // Long press action (usually delete/edit)
            onLongPress={() => onLongPressItem(item.id)}

            // Apply base style + conditional style
            style={[
              styles.item,
              isIncome ? styles.itemIncome : styles.itemExpense,
              { marginHorizontal: 16 },
            ]}
          >
            {/* Left side: note and date */}
            <View style={{ flex: 1 }}>
              <Text style={styles.itemNote}>{item.note}</Text>
              <Text style={styles.itemMeta}>{item.date}</Text>
            </View>

            {/* Right side: formatted amount */}
            <Text style={styles.itemAmount}>
              {isIncome ? "+" : "-"} {formatAmount(item.amount)}
            </Text>
          </Pressable>
        );
      }}
    />
  );
}

// Styles for the component
const styles = StyleSheet.create({

  // Secondary text style (used for empty state)
  muted: {
    color: "#6b7280",
    paddingVertical: 8,
  },

  // Base style for each movement item
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

  // Background color for income items
  itemIncome: {
    backgroundColor: "#ecfdf5",
  },

  // Background color for expense items
  itemExpense: {
    backgroundColor: "#fef2f2",
  },

  // Movement description text
  itemNote: {
    fontSize: 15,
    fontWeight: "600",
  },

  // Date or secondary info
  itemMeta: {
    color: "#6b7280",
    marginTop: 2,
    fontSize: 12,
  },

  // Amount text (strong emphasis)
  itemAmount: {
    fontWeight: "800",
  },
});
