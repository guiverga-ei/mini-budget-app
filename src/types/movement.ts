// Defines possible movement types
// A movement can only be INCOME or EXPENSE
export type MovementType = "INCOME" | "EXPENSE";

// Main data structure for a financial movement
export type Movement = {
  id: string;        // Unique identifier (usually UUID or timestamp)

  type: MovementType; // Movement category (income or expense)

  amount: number;     // Amount in euros (stored as number for calculations)

  note: string;       // Short description (e.g. salary, groceries, rent)

  date: string;       // Date in ISO format YYYY-MM-DD
                      // Using string makes storage and sorting easier
};
