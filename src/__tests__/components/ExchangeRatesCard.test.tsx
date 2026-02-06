import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";

jest.mock("../../api/exchange", () => ({
  fetchRates: jest.fn(),
}));

import { fetchRates } from "../../api/exchange";
import ExchangeRatesCard from "../../components/ExchangeRatesCard";

const fetchRatesMock = fetchRates as jest.MockedFunction<typeof fetchRates>;

describe("ExchangeRatesCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads and shows rates when user taps 'Load rates'", async () => {
    fetchRatesMock.mockResolvedValue({
      amount: 1,
      base: "EUR",
      date: "2026-01-01",
      rates: { USD: 1.1, GBP: 0.85, BRL: 5.4 },
    } as any);

    const { getByTestId, queryByTestId, getByText } = render(<ExchangeRatesCard />);

    fireEvent.press(getByTestId("rates-load-btn"));

    expect(getByTestId("rates-loading")).toBeTruthy();

    await waitFor(() => {
      expect(queryByTestId("rates-loading")).toBeNull();
      expect(getByTestId("rates-box")).toBeTruthy();
      expect(getByText(/USD:/)).toBeTruthy();
      expect(getByText(/GBP:/)).toBeTruthy();
      expect(getByText(/BRL:/)).toBeTruthy();
    });

    expect(fetchRatesMock).toHaveBeenCalledWith("EUR");
  });

  it("shows error when API fails", async () => {
    fetchRatesMock.mockRejectedValue(new Error("Network down"));

    const { getByTestId, queryByTestId } = render(<ExchangeRatesCard />);

    fireEvent.press(getByTestId("rates-load-btn"));

    expect(getByTestId("rates-loading")).toBeTruthy();

    await waitFor(() => {
      expect(queryByTestId("rates-loading")).toBeNull();
      expect(getByTestId("rates-error")).toBeTruthy();
    });
  });
});
