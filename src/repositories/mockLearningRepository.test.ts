import { describe, expect, it } from "vitest";
import { createMockLearningRepository } from "./mockLearningRepository";

describe("createMockLearningRepository", () => {
  it("deduplicates answer XP by user and activity like Supabase", async () => {
    const repository = createMockLearningRepository();
    const session = await repository.createSession("Ada");

    const answer = {
      userId: session.userId,
      chapterId: "chapter-1-first-dram",
      activityId: "CH1-Q01",
      answer: "false",
      isCorrect: true,
      xpDelta: 10,
    };

    await repository.recordAnswer(answer);
    await repository.recordAnswer(answer);

    const leaderboard = await repository.getLeaderboard(session.userId);
    expect(leaderboard[0]).toMatchObject({
      userId: session.userId,
      totalXp: 10,
    });
  });

  it("records final result XP once and unlocks the final achievement", async () => {
    const repository = createMockLearningRepository();
    const session = await repository.createSession("Ada");

    await repository.recordFinalResult({
      userId: session.userId,
      correctAnswers: 18,
      xpDelta: 180,
    });
    await repository.recordFinalResult({
      userId: session.userId,
      correctAnswers: 18,
      xpDelta: 180,
    });

    const restored = await repository.getSession(session.sessionId);
    const leaderboard = await repository.getLeaderboard(session.userId);

    expect(restored?.achievements).toContain("ACH-005");
    expect(leaderboard[0]).toMatchObject({
      userId: session.userId,
      totalXp: 180,
    });
  });
});
