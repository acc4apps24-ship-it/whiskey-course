import { env } from "../lib/env";
import { createSupabaseClient } from "../lib/supabaseClient";
import { createMockLearningRepository } from "./mockLearningRepository";
import { createSupabaseLearningRepository } from "./supabaseLearningRepository";

export type UserSession = {
  userId: string;
  sessionId: string;
  displayName: string;
  totalXp: number;
  completedChapterIds: string[];
  achievements: string[];
};

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  displayName: string;
  totalXp: number;
  completedChapters: number;
  achievements: string[];
  isCurrentUser: boolean;
};

export type SaveProgressInput = {
  userId: string;
  chapterId: string;
  status: "not_started" | "in_progress" | "completed";
  currentCardId?: string;
};

export type RecordAnswerInput = {
  userId: string;
  chapterId: string;
  activityId: string;
  answer: string;
  isCorrect: boolean;
  xpDelta: number;
};

export type RecordFinalResultInput = {
  userId: string;
  correctAnswers: number;
  xpDelta: number;
};

export type TastingNoteInput = {
  userId: string;
  chapterId: string;
  appearance?: string;
  nose?: string;
  palate?: string;
  finish?: string;
  association?: string;
};

export interface LearningRepository {
  getSession(sessionId: string): Promise<UserSession | null>;
  createSession(displayName: string): Promise<UserSession>;
  saveProgress(input: SaveProgressInput): Promise<void>;
  recordAnswer(input: RecordAnswerInput): Promise<void>;
  recordFinalResult(input: RecordFinalResultInput): Promise<void>;
  saveTastingNote(input: TastingNoteInput): Promise<void>;
  getLeaderboard(currentUserId: string): Promise<LeaderboardEntry[]>;
}

export function createLearningRepository(): LearningRepository {
  if (env.dataMode === "mock") {
    return createMockLearningRepository();
  }

  return createSupabaseLearningRepository(createSupabaseClient());
}
