import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";
import { createSupabaseLearningRepository } from "./supabaseLearningRepository";

function createDuplicateXpClient() {
  const duplicateError = {
    code: "23505",
    message: "duplicate key value violates unique constraint",
  };
  const xpEvents = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    insert: vi.fn().mockResolvedValue({ error: duplicateError }),
  };
  const progress = {
    upsert: vi.fn().mockResolvedValue({ error: null }),
  };
  const client = {
    from: vi.fn((table: string) => {
      if (table === "wj_xp_events") return xpEvents;
      if (table === "wj_progress") return progress;
      throw new Error(`Unexpected table ${table}`);
    }),
  };

  return { client: client as unknown as SupabaseClient, progress, xpEvents };
}

describe("createSupabaseLearningRepository", () => {
  it("treats duplicate final XP events as already awarded", async () => {
    const { client, xpEvents } = createDuplicateXpClient();
    const repository = createSupabaseLearningRepository(client);

    await expect(
      repository.recordFinalResult({
        userId: "user_1",
        correctAnswers: 20,
        xpDelta: 200,
      }),
    ).resolves.toEqual({ xpAwarded: 0 });
    expect(xpEvents.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        event_type: "final",
        source_id: "final-challenge",
      }),
    );
  });

  it("treats duplicate chapter completion XP events as already awarded", async () => {
    const { client, progress, xpEvents } = createDuplicateXpClient();
    const repository = createSupabaseLearningRepository(client);

    await expect(
      repository.saveProgress({
        userId: "user_1",
        chapterId: "chapter-1-first-dram",
        status: "completed",
      }),
    ).resolves.toEqual({ xpAwarded: 0 });
    expect(progress.upsert).toHaveBeenCalled();
    expect(xpEvents.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        event_type: "chapter-completion",
        source_id: "chapter-1-first-dram",
      }),
    );
  });
});
