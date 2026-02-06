// Type definition for the API response structure
// This helps TypeScript understand what data we expect
export type ExchangeResponse = {
  amount: number; // Original amount used in conversion (usually 1)
  base: string;   // Base currency (e.g., EUR, USD)
  date: string;   // Date of the exchange rates
  rates: Record<string, number>; // Object with currency codes and their rates
};

// Function to fetch exchange rates from the Frankfurter API
// "from" is the base currency (default is EUR)
export async function fetchRates(from = "EUR") {

  // Build the API URL safely using encodeURIComponent
  // This avoids problems with special characters
  const url = `https://api.frankfurter.app/latest?from=${encodeURIComponent(from)}`;

  // Call the API
  const res = await fetch(url);

  // If the HTTP response is not OK (e.g., 404, 500),
  // throw an error so it can be handled elsewhere
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  // Convert response body to JSON and cast to ExchangeResponse type
  const data = (await res.json()) as ExchangeResponse;

  // Return the parsed data
  return data;
}
