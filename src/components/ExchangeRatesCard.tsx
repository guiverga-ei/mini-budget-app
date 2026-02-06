import React, { useState } from "react";
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { fetchRates, type ExchangeResponse } from "../api/exchange";

// Props definition
// Allows passing external styles so the component keeps
// the same visual identity as the rest of the app
type Props = {
  cardStyle?: any;
  primaryBtnStyle?: any;
  primaryBtnTextStyle?: any;
  mutedTextStyle?: any;
};

// Main component that displays exchange rates
export default function ExchangeRatesCard({
  cardStyle,
  primaryBtnStyle,
  primaryBtnTextStyle,
  mutedTextStyle,
}: Props) {

  // State to store API response data
  const [rates, setRates] = useState<ExchangeResponse | null>(null);

  // Loading state (used to show spinner while fetching)
  const [ratesLoading, setRatesLoading] = useState(false);

  // Error state (stores error message if API fails)
  const [ratesError, setRatesError] = useState<string | null>(null);

  // Function to call the API and load exchange rates
  async function loadRates() {
    try {
      // Reset previous error
      setRatesError(null);

      // Activate loading indicator
      setRatesLoading(true);

      // Call API using EUR as base currency
      const data = await fetchRates("EUR");

      // Save received data into state
      setRates(data);

    } catch (e: any) {
      // Save error message if request fails
      setRatesError(e?.message ?? "Unknown error");

    } finally {
      // Stop loading indicator (runs always)
      setRatesLoading(false);
    }
  }

  return (
    <View style={[styles.card, cardStyle]}>
      {/* Section title */}
      <Text style={styles.sectionTitle}>Exchange rates (Public API)</Text>

      {/* Small description text */}
      <Text style={[styles.muted, mutedTextStyle]}>
        Demo: fetch EUR rates from a public endpoint.
      </Text>

      {/* Show load button only if no data and not loading */}
      {!rates && !ratesLoading && (
        <Pressable
          testID="rates-load-btn"
          onPress={loadRates}
          style={[styles.primaryBtn, primaryBtnStyle]}
        >
          <Text style={[styles.primaryBtnText, primaryBtnTextStyle]}>
            Load rates
          </Text>
        </Pressable>
      )}

      {/* Loading state with spinner */}
      {ratesLoading && (
        <View style={styles.inlineRow}>
          <ActivityIndicator />
          <Text testID="rates-loading" style={[styles.muted, mutedTextStyle]}>
            Loading…
          </Text>
        </View>
      )}

      {/* Error state with retry button */}
      {!ratesLoading && ratesError && (
        <View style={{ gap: 10 }}>
          <Text testID="rates-error" style={styles.errorText}>
            Error: {ratesError}
          </Text>

          <Pressable onPress={loadRates} style={[styles.primaryBtn, primaryBtnStyle]}>
            <Text style={[styles.primaryBtnText, primaryBtnTextStyle]}>
              Try again
            </Text>
          </Pressable>
        </View>
      )}

      {/* Success state: display rates */}
      {!ratesLoading && !ratesError && rates && (
        <View style={{ gap: 10 }}>
          <View testID="rates-box" style={styles.rateBox}>

            {/* Metadata: base currency and date */}
            <Text style={styles.rateMeta}>
              Base: {rates.base} · Date: {rates.date}
            </Text>

            {/* Example currencies */}
            <Text style={styles.rateLine}>USD: {rates.rates["USD"]}</Text>
            <Text style={styles.rateLine}>GBP: {rates.rates["GBP"]}</Text>
            <Text style={styles.rateLine}>BRL: {rates.rates["BRL"]}</Text>
          </View>

          {/* Refresh button */}
          <Pressable
            testID="rates-refresh-btn"
            onPress={loadRates}
            style={[styles.primaryBtn, primaryBtnStyle]}
          >
            <Text style={[styles.primaryBtnText, primaryBtnTextStyle]}>
              Refresh
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

// Local styles using React Native StyleSheet
// Keeps styles organized and reusable
const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    gap: 10,
  },

  // Title style
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
  },

  // Secondary/muted text
  muted: {
    color: "#6b7280",
  },

  // Error text style
  errorText: {
    color: "#b91c1c",
    fontWeight: "700",
  },

  // Inline row layout
  inlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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

  // Box displaying rates
  rateBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    gap: 6,
  },

  // Metadata text
  rateMeta: {
    color: "#6b7280",
    fontSize: 12,
    fontWeight: "600",
  },

  // Individual rate line
  rateLine: {
    fontSize: 14,
    fontWeight: "800",
  },
});
