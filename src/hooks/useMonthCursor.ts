import { useMemo, useState } from "react";

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function addMonths(d: Date, delta: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + delta, 1);
}
function monthKeyFromDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function useMonthCursor() {
  const [cursor, setCursor] = useState<Date>(() => startOfMonth(new Date()));
  const key = useMemo(() => monthKeyFromDate(cursor), [cursor]);

  function prev() {
    setCursor((d) => addMonths(d, -1));
  }
  function next() {
    setCursor((d) => addMonths(d, +1));
  }

  return { cursor, key, prev, next };
}
