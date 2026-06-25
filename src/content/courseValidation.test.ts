import { describe, expect, it } from "vitest";
import { course } from "./course";

describe("course content", () => {
  it("contains all 7 chapters and the 20-question Final Challenge from the content spec", () => {
    expect(course.id).toBe("whisky-journey");
    expect(course.version).toBe("1.0");
    expect(course.chapters.map((chapter) => chapter.id)).toEqual([
      "chapter-1-first-dram",
      "chapter-2-speyside",
      "chapter-3-highlands",
      "chapter-4-islay",
      "chapter-5-casks",
      "chapter-6-tasting",
      "chapter-7-whisky-detective",
    ]);
    expect(course.finalChallenge.questions.map((question) => question.id)).toEqual([
      "FINAL-Q01",
      "FINAL-Q02",
      "FINAL-Q03",
      "FINAL-Q04",
      "FINAL-Q05",
      "FINAL-Q06",
      "FINAL-Q07",
      "FINAL-Q08",
      "FINAL-Q09",
      "FINAL-Q10",
      "FINAL-Q11",
      "FINAL-Q12",
      "FINAL-Q13",
      "FINAL-Q14",
      "FINAL-Q15",
      "FINAL-Q16",
      "FINAL-Q17",
      "FINAL-Q18",
      "FINAL-Q19",
      "FINAL-Q20",
    ]);
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
