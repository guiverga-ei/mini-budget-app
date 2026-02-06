import React, { useState } from "react";
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { fetchRates, type ExchangeResponse } from "../api/exchange";

type Props = {
  // reutiliza os estilos da app (para manter consistência visual)
  cardStyle?: any;
  primaryBtnStyle?: any;
  primaryBtnTextStyle?: any;
  mutedTextStyle?: any;
};

export default function ExchangeRatesCard({
  cardStyle,
  primaryBtnStyle,
  primaryBtnTextStyle,
  mutedTextStyle,
}: Props) {
  const [rates, setRates] = useState<ExchangeResponse | null>(null);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [ratesError, setRatesError] = useState<string | null>(null);

  async function loadRates() {
    try {
      setRatesError(null);
      setRatesLoading(true);

      const data = await fetchRates("EUR");
      setRates(data);
    } catch (e: any) {
      setRatesError(e?.message ?? "Unknown error");
    } finally {
      setRatesLoading(false);
    }
  }

  return (
    <View style={[styles.card, cardStyle]}>
      <Text style={styles.sectionTitle}>Exchange rates (Public API)</Text>
      <Text style={[styles.muted, mutedTextStyle]}>
        Demo: fetch EUR rates from a public endpoint.
      </Text>

      {!rates && !ratesLoading && (
        <Pressable testID="rates-load-btn" onPress={loadRates} style={[styles.primaryBtn, primaryBtnStyle]}>
          <Text style={[styles.primaryBtnText, primaryBtnTextStyle]}>Load rates</Text>
        </Pressable>
      )}

      {ratesLoading && (
        <View style={styles.inlineRow}>
          <ActivityIndicator />
          <Text testID="rates-loading" style={[styles.muted, mutedTextStyle]}>
            Loading…
          </Text>
        </View>
      )}

      {!ratesLoading && ratesError && (
        <View style={{ gap: 10 }}>
          <Text testID="rates-error" style={styles.errorText}>
            Error: {ratesError}
          </Text>

          <Pressable onPress={loadRates} style={[styles.primaryBtn, primaryBtnStyle]}>
            <Text style={[styles.primaryBtnText, primaryBtnTextStyle]}>Try again</Text>
          </Pressable>
        </View>
      )}

      {!ratesLoading && !ratesError && rates && (
        <View style={{ gap: 10 }}>
          <View testID="rates-box" style={styles.rateBox}>
            <Text style={styles.rateMeta}>
              Base: {rates.base} · Date: {rates.date}
            </Text>
            <Text style={styles.rateLine}>USD: {rates.rates["USD"]}</Text>
            <Text style={styles.rateLine}>GBP: {rates.rates["GBP"]}</Text>
            <Text style={styles.rateLine}>BRL: {rates.rates["BRL"]}</Text>
          </View>

          <Pressable testID="rates-refresh-btn" onPress={loadRates} style={[styles.primaryBtn, primaryBtnStyle]}>
            <Text style={[styles.primaryBtnText, primaryBtnTextStyle]}>Refresh</Text>
          </Pressable>
        </View>
      )}
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
  muted: { color: "#6b7280" },
  errorText: { color: "#b91c1c", fontWeight: "700" },
  inlineRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  primaryBtn: {
    backgroundColor: "#111827",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryBtnText: { color: "white", fontWeight: "700" },
  rateBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    gap: 6,
  },
  rateMeta: { color: "#6b7280", fontSize: 12, fontWeight: "600" },
  rateLine: { fontSize: 14, fontWeight: "800" },
});
