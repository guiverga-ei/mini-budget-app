export type MovementType = "INCOME" | "EXPENSE";

export type Movement = {
  id: string;
  type: MovementType;
  amount: number; // in euros
  note: string;
  date: string; // YYYY-MM-DD
};
