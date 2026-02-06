export type ExchangeResponse = {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
};

export async function fetchRates(from = "EUR") {
  const url = `https://api.frankfurter.app/latest?from=${encodeURIComponent(from)}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data = (await res.json()) as ExchangeResponse;
  return data;
}
