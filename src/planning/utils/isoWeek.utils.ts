// Helpers ISO-week (UTC)

export function isoWeekStartUTC(isoWeek: string): Date {
  // isoWeek ex: "2025-W36"
  const [yStr, wStr] = isoWeek.split('-W');
  const y = Number(yStr);
  const w = Number(wStr);

  // Jeudi de la semaine ISO
  const simple = new Date(Date.UTC(y, 0, 1 + (w - 1) * 7));
  const dow = simple.getUTCDay() || 7; // 1..7 (lundi=1)
  const isoMonday = new Date(simple);
  isoMonday.setUTCDate(simple.getUTCDate() - (dow <= 4 ? dow - 1 : dow - 8));
  return isoMonday; // Lundi 00:00 UTC
}

export function toIsoWeekUTC(d: Date): string {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = date.getUTCDay() || 7; // 1..7 (Mon=1)
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((+date - +yearStart) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

/** Liste des ISO weeks uniques rencontrées dans un mois "YYYY-MM" */
export function isoWeeksOfMonth(month: string): string[] {
  const [yStr, mStr] = month.split('-');
  const y = Number(yStr);
  const m0 = Number(mStr) - 1; // 0..11
  const start = new Date(Date.UTC(y, m0, 1));
  const endExclusive = new Date(Date.UTC(y, m0 + 1, 1));

  const set = new Set<string>();
  for (let d = new Date(start); d < endExclusive; d.setUTCDate(d.getUTCDate() + 1)) {
    set.add(toIsoWeekUTC(d));
  }
  return Array.from(set);
}
