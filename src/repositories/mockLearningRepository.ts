import type {
  LeaderboardEntry,
  LearningRepository,
  RecordAnswerInput,
  RecordFinalResultInput,
  SaveProgressInput,
  TastingNoteInput,
  UserSession,
} from "./learningRepository";
import { getUnlockedAchievementIds } from "@/domain/achievements";
import { calculateChapterCompletionXp } from "@/domain/xp";

const sessions = new Map<string, UserSession>();
const xpEventKeys = new Set<string>();
const finalCompletedUserIds = new Set<string>();

export function createMockLearningRepository(): LearningRepository {
  return {
    async getSession(sessionId) {
      return sessions.get(sessionId) ?? null;
    },
    async createSession(displayName) {
      const sessionId = `mock_${crypto.randomUUID()}`;
      const session: UserSession = {
        userId: crypto.randomUUID(),
        sessionId,
        displayName,
        totalXp: 0,
        completedChapterIds: [],
        achievements: [],
      };

      sessions.set(sessionId, session);

      return session;
    },
    async saveProgress(input: SaveProgressInput) {
      let xpAwarded = 0;
      for (const session of sessions.values()) {
        if (session.userId === input.userId && input.status === "completed") {
          const alreadyCompleted = session.completedChapterIds.includes(input.chapterId);
          session.completedChapterIds = Array.from(new Set([...session.completedChapterIds, input.chapterId]));
          if (!alreadyCompleted) {
            xpAwarded = calculateChapterCompletionXp({
              completed: true,
              perfect: false,
            });
            session.totalXp += xpAwarded;
          }
          session.achievements = getUnlockedAchievementIds(
            session.completedChapterIds,
            finalCompletedUserIds.has(session.userId),
          );
        }
      }
      return { xpAwarded };
    },
    async recordAnswer(input: RecordAnswerInput) {
      const eventKey = `${input.userId}:answer:${input.activityId}`;
      if (xpEventKeys.has(eventKey)) return { xpAwarded: 0 };

      xpEventKeys.add(eventKey);
      for (const session of sessions.values()) {
        if (session.userId === input.userId) {
          session.totalXp += input.xpDelta;
        }
      }
      return { xpAwarded: input.xpDelta };
    },
    async recordFinalResult(input: RecordFinalResultInput) {
      const eventKey = `${input.userId}:final:final-challenge`;
      if (xpEventKeys.has(eventKey)) return { xpAwarded: 0 };

      xpEventKeys.add(eventKey);
      finalCompletedUserIds.add(input.userId);
      for (const session of sessions.values()) {
        if (session.userId === input.userId) {
          session.totalXp += input.xpDelta;
          session.achievements = getUnlockedAchievementIds(session.completedChapterIds, true);
        }
      }
      return { xpAwarded: input.xpDelta };
    },
    async saveTastingNote(_input: TastingNoteInput) {
      return;
    },
    async getLeaderboard(currentUserId): Promise<LeaderboardEntry[]> {
      return Array.from(sessions.values())
        .sort((a, b) => b.totalXp - a.totalXp)
        .map((session, index) => ({
          rank: index + 1,
          userId: session.userId,
          displayName: session.displayName,
          totalXp: session.totalXp,
          completedChapters: session.completedChapterIds.length,
          achievements: session.achievements,
          isCurrentUser: session.userId === currentUserId,
        }));
    },
  };
}
