import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { course } from "@/content/course";
import { FinalChallenge } from "./FinalChallenge";

afterEach(() => {
  cleanup();
});

describe("FinalChallenge", () => {
  it("scores 10 XP per correct answer and shows completion CTA", async () => {
    const onComplete = vi.fn();
    const question = course.finalChallenge.questions[0];
    const correctOption = question.options.find(
      (option) => option.id === question.correctOptionId,
    );

    render(
      <FinalChallenge
        summary={{
          totalXp: 640,
          achievements: ["Мастер виски (Whisky Master)"],
          leaderboardRank: 3,
        }}
        questions={course.finalChallenge.questions.slice(0, 1)}
        onComplete={onComplete}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: correctOption?.text }));
    await userEvent.click(screen.getByRole("button", { name: "Завершить испытание" }));

    expect(onComplete).toHaveBeenCalledWith({ correctAnswers: 1, xp: 10 });
    expect(screen.getByText("Общий XP: 640")).toBeInTheDocument();
    expect(screen.getByText("Место в leaderboard: #3")).toBeInTheDocument();
    expect(screen.getByText("Достижения: Мастер виски (Whisky Master)")).toBeInTheDocument();
    expect(screen.getByText("Сравнить с друзьями")).toBeInTheDocument();
  });

  it("keeps the final open and shows an error when saving completion fails", async () => {
    const onComplete = vi.fn().mockRejectedValue(new Error("network"));
    const question = course.finalChallenge.questions[0];
    const correctOption = question.options.find(
      (option) => option.id === question.correctOptionId,
    );

    render(
      <FinalChallenge
        questions={course.finalChallenge.questions.slice(0, 1)}
        onComplete={onComplete}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: correctOption?.text }));
    await userEvent.click(screen.getByRole("button", { name: "Завершить испытание" }));

    expect(
      await screen.findByText("Не удалось сохранить результат финала. Проверьте связь и попробуйте ещё раз."),
    ).toBeInTheDocument();
    expect(screen.queryByText("Сравнить с друзьями")).not.toBeInTheDocument();
  });

  it("shows the saved awarded XP returned by onComplete", async () => {
    const onComplete = vi.fn().mockResolvedValue({ correctAnswers: 1, xp: 0 });
    const question = course.finalChallenge.questions[0];
    const correctOption = question.options.find(
      (option) => option.id === question.correctOptionId,
    );

    render(
      <FinalChallenge
        questions={course.finalChallenge.questions.slice(0, 1)}
        onComplete={onComplete}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: correctOption?.text }));
    await userEvent.click(screen.getByRole("button", { name: "Завершить испытание" }));

    expect(await screen.findByText("XP за финал: 0")).toBeInTheDocument();
  });
});
