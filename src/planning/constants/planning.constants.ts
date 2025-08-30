import type { ApiDay } from "../types/types";

// index du jour basé sur LUNDI = 0 (cohérent ISO)
export const DAY_INDEX: Record<ApiDay, number> = {
  MONDAY: 0,
  TUESDAY: 1,
  WEDNESDAY: 2,
  THURSDAY: 3,
  FRIDAY: 4,
  SATURDAY: 5,
  SUNDAY: 6,
};
