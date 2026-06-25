import { describe, expect, it } from "vitest";
import { calculateAnswerXp, calculateChapterCompletionXp, calculateFinalXp } from "./xp";

describe("xp rules", () => {
  it("awards 10 XP for a correct answer and 0 for an incorrect answer", () => {
    expect(calculateAnswerXp(true)).toBe(10);
    expect(calculateAnswerXp(false)).toBe(0);
  });

  it("caps final challenge XP at 200", () => {
    expect(calculateFinalXp(0)).toBe(0);
    expect(calculateFinalXp(14)).toBe(140);
    expect(calculateFinalXp(20)).toBe(200);
    expect(calculateFinalXp(25)).toBe(200);
  });

  it("adds chapter completion and Perfect Chapter XP", () => {
    expect(calculateChapterCompletionXp({ completed: true, perfect: false })).toBe(100);
    expect(calculateChapterCompletionXp({ completed: true, perfect: true })).toBe(150);
    expect(calculateChapterCompletionXp({ completed: false, perfect: true })).toBe(0);
  });
});
