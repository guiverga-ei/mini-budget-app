import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import MovementsList from "../../components/MovementsList";

describe("MovementsList", () => {
  it("renders items and triggers callbacks", () => {
    const items = [
      { id: "1", type: "INCOME", amount: 10, note: "Salary", date: "2026-02-01" },
      { id: "2", type: "EXPENSE", amount: 5, note: "Coffee", date: "2026-02-02" },
    ] as any;

    const onPressItem = jest.fn();
    const onLongPressItem = jest.fn();

    const { getByText } = render(
      <MovementsList
        loading={false}
        items={items}
        onPressItem={onPressItem}
        onLongPressItem={onLongPressItem}
        formatAmount={(n) => `€${n}`}
      />
    );

    fireEvent.press(getByText("Salary"));
    expect(onPressItem).toHaveBeenCalledWith(items[0]);
  });
});
