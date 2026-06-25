import type { UserSession } from "@/repositories/learningRepository";

export type AppScreen = "loading" | "age-gate" | "name-gate" | "course";

export type AppState = {
  screen: AppScreen;
  ageAccepted: boolean;
  session: UserSession | null;
  error: string | null;
};
