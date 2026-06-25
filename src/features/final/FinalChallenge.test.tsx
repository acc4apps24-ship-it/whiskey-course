import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { course } from "@/content/course";
import { FinalChallenge } from "./FinalChallenge";

describe("FinalChallenge", () => {
  it("scores 10 XP per correct answer and shows completion CTA", async () => {
    const onComplete = vi.fn();
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

    expect(onComplete).toHaveBeenCalledWith({ correctAnswers: 1, xp: 10 });
    expect(screen.getByText("Сравнить с друзьями")).toBeInTheDocument();
  });
});
