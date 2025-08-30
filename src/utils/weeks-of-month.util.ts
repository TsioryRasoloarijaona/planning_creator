/**
 * Retourne les semaines ISO qui intersectent le mois donné.
 * @param month "YYYY-MM" (ex: "2025-09")
 * @returns string[] au format "YYYY-wWW" (ex: ["2025-w36","2025-w37",...])
 */
export function isoWeeksOfMonth(month: string): string[] {
  const [yStr, mStr] = month.split("-");
  const y = Number(yStr);
  const m0 = Number(mStr) - 1; // 0..11

  const start = new Date(Date.UTC(y, m0, 1));
  const endExclusive = new Date(Date.UTC(y, m0 + 1, 1));

  const seen = new Set<string>();
  for (let d = new Date(start); d < endExclusive; d.setUTCDate(d.getUTCDate() + 1)) {
    seen.add(isoWeekKeyUTC(d));
  }

  // Tri sécurisé (année + numéro de semaine)
  return Array.from(seen).sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
}

/** Clé ISO-week pour une date UTC -> "YYYY-wWW" */
function isoWeekKeyUTC(date: Date): string {
  // on clone en UTC, sans heure locale
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

  // "Jeudi" ISO pour récupérer la bonne année ISO
  const dayNum = d.getUTCDay() || 7; // 1..7 (lundi=1)
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);

  const isoYear = d.getUTCFullYear();
  const yearStart = new Date(Date.UTC(isoYear, 0, 1));

  const week = Math.ceil(((+d - +yearStart) / 86400000 + 1) / 7);
  return `${isoYear}-w${String(week).padStart(2, "0")}`;
}
