import { useMemo, useState } from "react";

// Returns the first day of the month for a given date
// Example: 2026-02-15 -> 2026-02-01
function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

// Adds or subtracts months from a date
// delta can be positive (+1 next month) or negative (-1 previous month)
function addMonths(d: Date, delta: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + delta, 1);
}

// Converts a date into a simple month key string
// Format: YYYY-MM (useful for filters or API calls)
function monthKeyFromDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

// Custom React hook to manage month navigation
// Useful for dashboards, finance apps, reports, etc.
export function useMonthCursor() {

  // Cursor state represents the current selected month
  // Default value = first day of current month
  const [cursor, setCursor] = useState<Date>(() => startOfMonth(new Date()));

  // Memoized month key string (avoids unnecessary recalculation)
  const key = useMemo(() => monthKeyFromDate(cursor), [cursor]);

  // Go to previous month
  function prev() {
    setCursor((d) => addMonths(d, -1));
  }

  // Go to next month
  function next() {
    setCursor((d) => addMonths(d, +1));
  }

  // Expose values and navigation functions
  return { cursor, key, prev, next };
}
