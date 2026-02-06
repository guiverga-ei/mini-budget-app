import { useEffect, useState } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { fetchRates, type ExchangeResponse } from "../api/exchange";

export default function ExchangeRatesScreen() {
  const [data, setData] = useState<ExchangeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setError(null);
      setLoading(true);
      const res = await fetchRates("EUR");
      setData(res);
    } catch (e: any) {
      setError(e?.message ?? "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>Exchange Rates</Text>

      {loading && (
        <View style={{ gap: 8 }}>
          <ActivityIndicator />
          <Text>A carregar...</Text>
        </View>
      )}

      {!loading && error && (
        <View style={{ gap: 8 }}>
          <Text style={{ color: "red" }}>Erro: {error}</Text>
          <Pressable
            onPress={load}
            style={{ padding: 12, backgroundColor: "#111", borderRadius: 10 }}
          >
            <Text style={{ color: "#fff", textAlign: "center" }}>Tentar novamente</Text>
          </Pressable>
        </View>
      )}

      {!loading && !error && data && (
        <View style={{ gap: 8 }}>
          <Text>Base: {data.base}</Text>
          <Text>Data: {data.date}</Text>

          <View style={{ padding: 12, borderWidth: 1, borderRadius: 10 }}>
            <Text>USD: {data.rates["USD"]}</Text>
            <Text>GBP: {data.rates["GBP"]}</Text>
            <Text>BRL: {data.rates["BRL"]}</Text>
          </View>

          <Pressable
            onPress={load}
            style={{ padding: 12, backgroundColor: "#111", borderRadius: 10 }}
          >
            <Text style={{ color: "#fff", textAlign: "center" }}>Atualizar</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
