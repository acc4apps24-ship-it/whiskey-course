import type {
  LeaderboardEntry,
  LearningRepository,
  RecordAnswerInput,
  SaveProgressInput,
  TastingNoteInput,
  UserSession,
} from "./learningRepository";

const sessions = new Map<string, UserSession>();

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
      for (const session of sessions.values()) {
        if (session.userId === input.userId && input.status === "completed") {
          session.completedChapterIds = Array.from(new Set([...session.completedChapterIds, input.chapterId]));
        }
      }
    },
    async recordAnswer(input: RecordAnswerInput) {
      for (const session of sessions.values()) {
        if (session.userId === input.userId) {
          session.totalXp += input.xpDelta;
        }
      }
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
