// Types génériques côté planning

export type ApiDay =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export type ApiLabel =
  | 'INBOUND'
  | 'OUTBOUND'
  | 'EMAILING'
  | 'CHAT'
  | 'BREAK'
  | 'LUNCH';

export interface MonthEvent {
  date: string;         // "YYYY-MM-DD" (UTC)
  startMinutes: number; // minutes depuis 00:00
  endMinutes: number;   // minutes depuis 00:00
  label: ApiLabel;
  slotId: number;
  weekId: number;
}

export interface MonthPlanningResult {
  accountId: number;
  month: string; // "YYYY-MM"
  events: MonthEvent[];
}
