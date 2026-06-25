import { describe, expect, it } from "vitest";
import { isFinalChallengeUnlocked } from "./progress";

describe("progress", () => {
  const required = ["chapter-1-first-dram", "chapter-2-speyside"];

  it("locks final challenge until required chapters are completed", () => {
    expect(isFinalChallengeUnlocked([], required)).toBe(false);
    expect(isFinalChallengeUnlocked(["chapter-1-first-dram"], required)).toBe(false);
    expect(isFinalChallengeUnlocked(required, required)).toBe(true);
  });
});
