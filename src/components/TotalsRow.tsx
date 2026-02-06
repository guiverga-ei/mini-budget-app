import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  income: string;
  expenses: string;
  net: string;
};

export default function TotalsRow({ income, expenses, net }: Props) {
  return (
    <View style={styles.totalsRow}>
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Income</Text>
        <Text style={styles.totalValue}>{income}</Text>
      </View>

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Expenses</Text>
        <Text style={styles.totalValue}>{expenses}</Text>
      </View>

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Net</Text>
        <Text style={styles.totalValue}>{net}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  totalsRow: {
    flexDirection: "row",
    gap: 10,
  },
  totalCard: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    gap: 6,
  },
  totalLabel: {
    color: "#6b7280",
    fontSize: 12,
    fontWeight: "600",
  },
  totalValue: {
    fontSize: 14,
    fontWeight: "800",
  },
});
