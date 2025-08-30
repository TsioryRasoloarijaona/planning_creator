// Helpers de bornes et tests pour un mois (UTC)

/** Début du mois (UTC) et fin exclusive du mois suivant (UTC) */
export function monthBoundsUTC(month: string): { start: Date; endExclusive: Date } {
  const [yStr, mStr] = month.split('-');
  const y = Number(yStr);
  const m0 = Number(mStr) - 1;
  const start = new Date(Date.UTC(y, m0, 1));
  const endExclusive = new Date(Date.UTC(y, m0 + 1, 1));
  return { start, endExclusive };
}

/** true si d ∈ [start, endExclusive[ (UTC) */
export function isInRangeUTC(d: Date, start: Date, endExclusive: Date): boolean {
  return d >= start && d < endExclusive;
}
