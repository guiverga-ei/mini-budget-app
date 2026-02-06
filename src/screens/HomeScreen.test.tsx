import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import HomeScreen from "./HomeScreen";

// Vamos mockar o módulo da API
jest.mock("../api/exchange", () => ({
  fetchRates: jest.fn(),
}));

import { fetchRates } from "../api/exchange";

describe("HomeScreen - Exchange rates card", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads and shows rates when user taps 'Load rates'", async () => {
    (fetchRates as jest.Mock).mockResolvedValue({
      amount: 1,
      base: "EUR",
      date: "2026-01-01",
      rates: { USD: 1.1, GBP: 0.85, BRL: 5.4 },
    });

    const { getByTestId, queryByTestId, getByText } = render(<HomeScreen />);

    // clica no botão
    fireEvent.press(getByTestId("rates-load-btn"));

    // deve mostrar loading
    expect(getByTestId("rates-loading")).toBeTruthy();

    // quando resolve, deve mostrar a caixa com os valores
    await waitFor(() => {
      expect(queryByTestId("rates-loading")).toBeNull();
      expect(getByTestId("rates-box")).toBeTruthy();
      expect(getByText(/USD:/)).toBeTruthy();
      expect(getByText(/GBP:/)).toBeTruthy();
      expect(getByText(/BRL:/)).toBeTruthy();
    });

    // e deve ter chamado a API com EUR
    expect(fetchRates).toHaveBeenCalledWith("EUR");
  });

  it("shows error when API fails", async () => {
    (fetchRates as jest.Mock).mockRejectedValue(new Error("Network down"));

    const { getByTestId, queryByTestId } = render(<HomeScreen />);

    fireEvent.press(getByTestId("rates-load-btn"));

    // loading aparece
    expect(getByTestId("rates-loading")).toBeTruthy();

    // depois deve aparecer erro
    await waitFor(() => {
      expect(queryByTestId("rates-loading")).toBeNull();
      expect(getByTestId("rates-error")).toBeTruthy();
    });
  });
});
