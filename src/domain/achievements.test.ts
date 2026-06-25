import { describe, expect, it } from "vitest";
import { getUnlockedAchievementIds } from "./achievements";

describe("achievements", () => {
  it("unlocks exact content-spec achievements from completed chapters and final", () => {
    expect(getUnlockedAchievementIds(["chapter-1-first-dram"], false)).toEqual(["ACH-001"]);
    expect(getUnlockedAchievementIds(["chapter-1-first-dram", "chapter-2-speyside"], false)).toEqual([
      "ACH-001",
      "ACH-002",
    ]);
    expect(getUnlockedAchievementIds(["chapter-4-islay", "chapter-5-casks"], true)).toEqual([
      "ACH-003",
      "ACH-004",
      "ACH-005",
    ]);
  });
});
