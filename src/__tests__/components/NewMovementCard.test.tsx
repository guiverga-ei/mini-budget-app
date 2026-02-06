import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import NewMovementCard from "../../components/NewMovementCard";

describe("NewMovementCard", () => {
  it("calls callbacks and add", () => {
    const onChangeType = jest.fn();
    const onChangeAmountText = jest.fn();
    const onChangeNote = jest.fn();
    const onAdd = jest.fn();

    const { getByPlaceholderText, getByText } = render(
      <NewMovementCard
        type="EXPENSE"
        amountText=""
        note=""
        onChangeType={onChangeType}
        onChangeAmountText={onChangeAmountText}
        onChangeNote={onChangeNote}
        onAdd={onAdd}
      />
    );

    fireEvent.changeText(getByPlaceholderText("Amount (e.g. 12.50)"), "12.50");
    expect(onChangeAmountText).toHaveBeenCalledWith("12.50");

    fireEvent.changeText(getByPlaceholderText("Note (e.g. Groceries)"), "Groceries");
    expect(onChangeNote).toHaveBeenCalledWith("Groceries");

    fireEvent.press(getByText("Add"));
    expect(onAdd).toHaveBeenCalled();
  });
});
