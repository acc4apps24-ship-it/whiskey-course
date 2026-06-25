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
});
