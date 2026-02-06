import React from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import type { Movement } from "../types/movement";

type Props = {
  loading: boolean;
  items: Movement[];
  onPressItem: (item: Movement) => void;
  onLongPressItem: (id: string) => void;
  formatAmount: (amount: number) => string;
};

export default function MovementsList({
  loading,
  items,
  onPressItem,
  onLongPressItem,
  formatAmount,
}: Props) {
  if (loading) return <Text style={styles.muted}>Loading…</Text>;
  if (items.length === 0)
    return (
      <Text style={styles.muted}>No movements yet. Add your first one above.</Text>
    );

  return (
    <FlatList
      data={items}
      keyExtractor={(x) => x.id}
      contentContainerStyle={{ paddingBottom: 24 }}
      renderItem={({ item }) => {
        const isIncome = item.type === "INCOME";
        return (
          <Pressable
            onPress={() => onPressItem(item)}
            onLongPress={() => onLongPressItem(item.id)}
            style={[
              styles.item,
              isIncome ? styles.itemIncome : styles.itemExpense,
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.itemNote}>{item.note}</Text>
              <Text style={styles.itemMeta}>{item.date}</Text>
            </View>

            <Text style={styles.itemAmount}>
              {isIncome ? "+" : "-"} {formatAmount(item.amount)}
            </Text>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
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
  itemIncome: { backgroundColor: "#ecfdf5" }, // soft green
  itemExpense: { backgroundColor: "#fef2f2" }, // soft red

  itemNote: { fontSize: 15, fontWeight: "600" },
  itemMeta: { color: "#6b7280", marginTop: 2, fontSize: 12 },
  itemAmount: { fontWeight: "800" },
});
