import React from "react";
import { render } from "@testing-library/react-native";
import TotalsRow from "../../components/TotalsRow";

describe("TotalsRow", () => {
  it("renders income/expenses/net", () => {
    const { getByText } = render(
      <TotalsRow income="€100" expenses="€40" net="€60" />
    );

    expect(getByText("Income")).toBeTruthy();
    expect(getByText("€100")).toBeTruthy();
    expect(getByText("Expenses")).toBeTruthy();
    expect(getByText("€40")).toBeTruthy();
    expect(getByText("Net")).toBeTruthy();
    expect(getByText("€60")).toBeTruthy();
  });
});
