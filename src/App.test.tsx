import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "@/App";
import { course } from "@/content/course";

const mocks = vi.hoisted(() => ({
  repository: {
    getSession: vi.fn(),
    createSession: vi.fn(),
    saveProgress: vi.fn(),
    recordAnswer: vi.fn(),
    recordFinalResult: vi.fn(),
    saveTastingNote: vi.fn(),
    getLeaderboard: vi.fn(),
  },
  getSessionIdCookie: vi.fn(),
  setSessionIdCookie: vi.fn(),
  clearSessionIdCookie: vi.fn(),
}));

vi.mock("@/repositories/learningRepository", () => ({
  createLearningRepository: () => mocks.repository,
}));

vi.mock("@/lib/cookies", () => ({
  SESSION_COOKIE: "wj_session_id",
  getSessionIdCookie: mocks.getSessionIdCookie,
  setSessionIdCookie: mocks.setSessionIdCookie,
  clearSessionIdCookie: mocks.clearSessionIdCookie,
}));

const completedChapterIds = course.chapters.map((chapter) => chapter.id);
const session = {
  userId: "user_1",
  sessionId: "session_1",
  displayName: "Ada",
  totalXp: 700,
  completedChapterIds,
  achievements: ["ACH-001", "ACH-002", "ACH-003", "ACH-004"],
};

describe("App final challenge", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getSessionIdCookie.mockReturnValue("session_1");
    mocks.repository.getSession.mockResolvedValue(session);
    mocks.repository.recordFinalResult.mockResolvedValue({ xpAwarded: 200 });
  });

  it("waits for the refreshed leaderboard before showing the final rank", async () => {
    const user = userEvent.setup();
    let resolveLeaderboard: (entries: unknown[]) => void = () => {};
    const refreshedLeaderboard = new Promise((resolve) => {
      resolveLeaderboard = resolve;
    });
    mocks.repository.getLeaderboard
      .mockResolvedValueOnce([
        {
          rank: 7,
          userId: session.userId,
          displayName: session.displayName,
          totalXp: 700,
          completedChapters: completedChapterIds.length,
          achievements: session.achievements,
          isCurrentUser: true,
        },
      ])
      .mockReturnValueOnce(refreshedLeaderboard);

    render(<App />);

    await user.click(await screen.findByRole("button", { name: "Открыть финальное испытание" }));

    for (const question of course.finalChallenge.questions) {
      const option = question.options.find(
        (candidate) => candidate.id === question.correctOptionId,
      );
      const questionSection = screen
        .getByRole("heading", { name: question.question })
        .closest("section");

      if (!option || !questionSection) throw new Error(`Missing test fixture for ${question.id}`);

      await user.click(within(questionSection).getByRole("button", { name: option.text }));
    }

    await user.click(screen.getByRole("button", { name: "Завершить испытание" }));

    await waitFor(() => {
      expect(mocks.repository.getLeaderboard).toHaveBeenCalledTimes(2);
    });
    expect(screen.queryByText("Путешествие завершено")).not.toBeInTheDocument();

    resolveLeaderboard([
      {
        rank: 2,
        userId: session.userId,
        displayName: session.displayName,
        totalXp: 900,
        completedChapters: completedChapterIds.length,
        achievements: [...session.achievements, "ACH-005"],
        isCurrentUser: true,
      },
    ]);

    expect(await screen.findByText("Путешествие завершено")).toBeInTheDocument();
    expect(screen.getByText("Общий XP: 900")).toBeInTheDocument();
    expect(screen.getByText("Место в leaderboard: #2")).toBeInTheDocument();
    expect(screen.getByText(/Мастер виски \(Whisky Master\)/)).toBeInTheDocument();
  });
});
