import type { SupabaseClient } from "@supabase/supabase-js";

import { getUnlockedAchievementIds } from "@/domain/achievements";
import type {
  LeaderboardEntry,
  LearningRepository,
  RecordAnswerInput,
  RecordFinalResultInput,
  SaveProgressInput,
  TastingNoteInput,
  UserSession,
} from "./learningRepository";

type UserRow = {
  id: string;
  session_id: string;
  display_name: string;
};

type LeaderboardRow = {
  user_id: string;
  display_name: string;
  total_xp: number;
  completed_chapters: number;
};

type ProgressRow = {
  user_id: string;
  chapter_id: string;
};

type FinalEventRow = {
  user_id: string;
};

export function createSupabaseLearningRepository(client: SupabaseClient): LearningRepository {
  async function buildSession(row: UserRow): Promise<UserSession> {
    const { data: leaderboard, error: leaderboardError } = await client
      .from("wj_leaderboard")
      .select("total_xp")
      .eq("user_id", row.id)
      .maybeSingle<Pick<LeaderboardRow, "total_xp">>();

    if (leaderboardError) throw leaderboardError;

    const { data: progress, error: progressError } = await client
      .from("wj_progress")
      .select("chapter_id")
      .eq("user_id", row.id)
      .eq("status", "completed");

    if (progressError) throw progressError;

    const { data: finalEvent, error: finalEventError } = await client
      .from("wj_xp_events")
      .select("id")
      .eq("user_id", row.id)
      .eq("event_type", "final")
      .eq("source_id", "final-challenge")
      .maybeSingle<{ id: string }>();

    if (finalEventError) throw finalEventError;

    const completedChapterIds = (progress ?? []).map((item) => item.chapter_id as string);
    const finalCompleted = Boolean(finalEvent);

    return {
      userId: row.id,
      sessionId: row.session_id,
      displayName: row.display_name,
      totalXp: leaderboard?.total_xp ?? 0,
      completedChapterIds,
      achievements: getUnlockedAchievementIds(completedChapterIds, finalCompleted),
    };
  }

  return {
    async getSession(sessionId) {
      const { data, error } = await client
        .from("wj_users")
        .select("id, session_id, display_name")
        .eq("session_id", sessionId)
        .maybeSingle<UserRow>();

      if (error) throw error;

      return data ? buildSession(data) : null;
    },
    async createSession(displayName) {
      const sessionId = crypto.randomUUID();
      const { data, error } = await client
        .from("wj_users")
        .insert({ session_id: sessionId, display_name: displayName, age_confirmed_at: new Date().toISOString() })
        .select("id, session_id, display_name")
        .single<UserRow>();

      if (error) throw error;

      return buildSession(data);
    },
    async saveProgress(input: SaveProgressInput) {
      const { error } = await client.from("wj_progress").upsert(
        {
          user_id: input.userId,
          chapter_id: input.chapterId,
          status: input.status,
          current_card_id: input.currentCardId,
          completed_at: input.status === "completed" ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,chapter_id" },
      );

      if (error) throw error;
    },
    async recordAnswer(input: RecordAnswerInput) {
      const { error: attemptError } = await client.from("wj_quiz_attempts").insert({
        user_id: input.userId,
        chapter_id: input.chapterId,
        activity_id: input.activityId,
        answer: input.answer,
        is_correct: input.isCorrect,
      });

      if (attemptError) throw attemptError;

      const { error: xpError } = await client.from("wj_xp_events").upsert(
        {
          user_id: input.userId,
          event_type: "answer",
          source_id: input.activityId,
          xp_delta: input.xpDelta,
          reason: input.isCorrect ? "Correct answer" : "Answer without XP",
        },
        { onConflict: "user_id,event_type,source_id", ignoreDuplicates: true },
      );

      if (xpError) throw xpError;
    },
    async recordFinalResult(input: RecordFinalResultInput) {
      const { error } = await client.from("wj_xp_events").upsert(
        {
          user_id: input.userId,
          event_type: "final",
          source_id: "final-challenge",
          xp_delta: input.xpDelta,
          reason: `Final challenge: ${input.correctAnswers} correct answers`,
        },
        { onConflict: "user_id,event_type,source_id", ignoreDuplicates: true },
      );

      if (error) throw error;
    },
    async saveTastingNote(input: TastingNoteInput) {
      const { error } = await client.from("wj_tasting_notes").insert({
        user_id: input.userId,
        chapter_id: input.chapterId,
        appearance: input.appearance,
        nose: input.nose,
        palate: input.palate,
        finish: input.finish,
        association: input.association,
      });

      if (error) throw error;
    },
    async getLeaderboard(currentUserId) {
      const { data, error } = await client.from("wj_leaderboard").select("*").limit(25);

      if (error) throw error;

      const rows = (data ?? []) as LeaderboardRow[];
      const userIds = rows.map((row) => row.user_id);
      const completedByUser = new Map<string, string[]>();
      const finalCompletedUserIds = new Set<string>();

      if (userIds.length > 0) {
        const { data: progress, error: progressError } = await client
          .from("wj_progress")
          .select("user_id, chapter_id")
          .in("user_id", userIds)
          .eq("status", "completed");

        if (progressError) throw progressError;

        for (const item of (progress ?? []) as ProgressRow[]) {
          completedByUser.set(item.user_id, [
            ...(completedByUser.get(item.user_id) ?? []),
            item.chapter_id,
          ]);
        }

        const { data: finalEvents, error: finalEventsError } = await client
          .from("wj_xp_events")
          .select("user_id")
          .in("user_id", userIds)
          .eq("event_type", "final")
          .eq("source_id", "final-challenge");

        if (finalEventsError) throw finalEventsError;

        for (const item of (finalEvents ?? []) as FinalEventRow[]) {
          finalCompletedUserIds.add(item.user_id);
        }
      }

      return rows.map((row, index): LeaderboardEntry => ({
        rank: index + 1,
        userId: row.user_id,
        displayName: row.display_name,
        totalXp: row.total_xp,
        completedChapters: row.completed_chapters,
        achievements: getUnlockedAchievementIds(
          completedByUser.get(row.user_id) ?? [],
          finalCompletedUserIds.has(row.user_id),
        ),
        isCurrentUser: row.user_id === currentUserId,
      }));
    },
  };
}
