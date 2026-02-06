import React from "react";
import { render } from "@testing-library/react-native";

jest.mock("../../lib/storage", () => ({
  loadMovements: jest.fn().mockResolvedValue([]),
  saveMovements: jest.fn().mockResolvedValue(undefined),
}));

import HomeScreen from "../../screens/HomeScreen";

describe("HomeScreen (smoke)", () => {
  it("renders without crashing", async () => {
    const { findByText } = render(<HomeScreen />);

    expect(await findByText("Mini Budget")).toBeTruthy();
    expect(
      await findByText("No movements yet. Add your first one above.")
    ).toBeTruthy();
  });
});
