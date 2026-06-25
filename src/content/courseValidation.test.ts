import { describe, expect, it } from "vitest";
import { course } from "./course";

describe("course content", () => {
  it("ships an engine-first content slice with chapters 1 and 2 plus a final placeholder", () => {
    expect(course.id).toBe("whisky-journey");
    expect(course.version).toBe("1.0");
    expect(course.chapters.map((chapter) => chapter.id)).toEqual([
      "chapter-1-first-dram",
      "chapter-2-speyside",
    ]);
    expect(course.finalChallenge.questions).toHaveLength(2);
  });

  it("keeps every card in an allowed type and every quiz answer explainable", () => {
    const allowed = new Set([
      "content",
      "fact",
      "myth",
      "quiz-single",
      "quiz-true-false",
      "quiz-match",
      "practice",
      "summary",
    ]);

    for (const chapter of course.chapters) {
      expect(chapter.cards.length).toBeGreaterThanOrEqual(3);
      for (const card of chapter.cards) {
        expect(allowed.has(card.type)).toBe(true);
        if (
          card.type === "quiz-single" ||
          card.type === "quiz-true-false" ||
          card.type === "quiz-match"
        ) {
          expect(card.explanation.length).toBeGreaterThan(12);
        }
      }
    }
  });

  it("contains exact achievement ids from the content spec for the first slice", () => {
    expect(course.achievements.map((achievement) => achievement.id)).toEqual([
      "ACH-001",
      "ACH-002",
      "ACH-003",
      "ACH-004",
      "ACH-005",
    ]);
  });

  it("keeps ACH-005 condition aligned with the content spec", () => {
    expect(course.achievements.find((achievement) => achievement.id === "ACH-005")?.condition).toBe(
      "Завершен весь курс",
    );
  });
});
