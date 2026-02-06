import { fetchRates } from "../../api/exchange";

describe("fetchRates", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it("returns exchange rates when API succeeds", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        amount: 1,
        base: "EUR",
        date: "2026-01-01",
        rates: { USD: 1.1, GBP: 0.85, BRL: 5.4 },
      }),
    });

    const data = await fetchRates("EUR");

    expect(data.base).toBe("EUR");
    expect(data.rates.USD).toBe(1.1);
  });

  it("throws error when API fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(fetchRates()).rejects.toThrow();
  });
});
