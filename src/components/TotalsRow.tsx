import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Props definition for totals display
// Values are already formatted as strings (currency formatting done outside)
type Props = {
  income: string;   // Total income amount
  expenses: string; // Total expenses amount
  net: string;      // Net balance (income - expenses)
};

// Component that shows a summary row with totals
export default function TotalsRow({ income, expenses, net }: Props) {
  return (
    <View style={styles.totalsRow}>

      {/* Income total card */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Income</Text>
        <Text style={styles.totalValue}>{income}</Text>
      </View>

      {/* Expenses total card */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Expenses</Text>
        <Text style={styles.totalValue}>{expenses}</Text>
      </View>

      {/* Net total card */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Net</Text>
        <Text style={styles.totalValue}>{net}</Text>
      </View>

    </View>
  );
}

// Local styles for layout and visual consistency
const styles = StyleSheet.create({

  // Horizontal row containing the three cards
  totalsRow: {
    flexDirection: "row",
    gap: 10,
  },

  // Individual card style
  totalCard: {
    flex: 1, // Each card takes equal width
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    gap: 6,
  },

  // Label text (secondary information)
  totalLabel: {
    color: "#6b7280",
    fontSize: 12,
    fontWeight: "600",
  },

  // Value text (main highlighted number)
  totalValue: {
    fontSize: 14,
    fontWeight: "800",
  },
});
