import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Chapter } from "@/content/courseTypes";
import { CardPlayer } from "./CardPlayer";

afterEach(() => {
  cleanup();
});

const quizChapter: Chapter = {
  id: "chapter-1-first-dram",
  title: "Первый драм",
  subtitle: "First Dram",
  durationMinutes: 7,
  cards: [
    {
      id: "INTRO-01",
      type: "content",
      title: "Старт",
      body: "Начинаем путь.",
    },
    {
      id: "INTRO-02",
      type: "content",
      title: "Single Malt",
      body: "Готовимся к вопросу.",
    },
    {
      id: "CH1-Q01",
      type: "quiz-true-false",
      title: "Правда или миф?",
      body: "Односолодовый виски (Single Malt) всегда сделан из одной бочки.",
      options: [
        { id: "true", text: "Правда" },
        { id: "false", text: "Миф" },
      ],
      correctOptionId: "false",
      successFeedback: "Верно. Single Malt означает с одной винокурни.",
      errorFeedback: "Почти, но нет.",
      explanation:
        "Single Malt означает одну винокурню и соложеный ячмень, а не одну конкретную бочку.",
      xp: 10,
    },
    {
      id: "SUMMARY-01",
      type: "summary",
      title: "Итог",
      body: "Глава завершена.",
    },
  ],
};

describe("CardPlayer", () => {
  it("does not reveal quiz answer before selection and shows explanation after answer", async () => {
    const onCompleteChapter = vi.fn();
    render(
      <CardPlayer
        chapter={quizChapter}
        onCompleteChapter={onCompleteChapter}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Дальше" }));
    await userEvent.click(screen.getByRole("button", { name: "Дальше" }));

    expect(screen.queryByText(/Single Malt означает одну винокурню/)).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Миф" }));

    expect(screen.getByText(/Single Malt означает одну винокурню/)).toBeInTheDocument();
    expect(screen.getByText("Верно. +10 XP")).toBeInTheDocument();
  });

  it("reports a quiz answer once and prevents answer changes", async () => {
    const onAnswerSelected = vi.fn();
    render(
      <CardPlayer
        chapter={quizChapter}
        onAnswerSelected={onAnswerSelected}
        onCompleteChapter={vi.fn()}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Дальше" }));
    await userEvent.click(screen.getByRole("button", { name: "Дальше" }));
    await userEvent.click(screen.getByRole("button", { name: "Миф" }));
    await userEvent.click(screen.getByRole("button", { name: "Правда" }));

    expect(onAnswerSelected).toHaveBeenCalledTimes(1);
    expect(onAnswerSelected).toHaveBeenCalledWith({
      chapterId: "chapter-1-first-dram",
      activityId: "CH1-Q01",
      answer: "false",
      isCorrect: true,
      xpDelta: 10,
    });
  });

  it("shows a retry path when answer persistence fails", async () => {
    const onAnswerSelected = vi
      .fn()
      .mockRejectedValueOnce(new Error("network"))
      .mockResolvedValueOnce(undefined);
    render(
      <CardPlayer
        chapter={quizChapter}
        onAnswerSelected={onAnswerSelected}
        onCompleteChapter={vi.fn()}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Дальше" }));
    await userEvent.click(screen.getByRole("button", { name: "Дальше" }));
    await userEvent.click(screen.getByRole("button", { name: "Миф" }));

    expect(
      await screen.findByText("Не удалось сохранить ответ. Проверьте связь и попробуйте ещё раз."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Дальше" })).toBeDisabled();

    await userEvent.click(screen.getByRole("button", { name: "Повторить сохранение" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Дальше" })).toBeEnabled();
    });
    expect(onAnswerSelected).toHaveBeenCalledTimes(2);
  });

  it("shows a retry path when chapter completion persistence fails", async () => {
    const chapter: Chapter = {
      id: "summary-chapter",
      title: "Финиш",
      subtitle: "Summary",
      durationMinutes: 1,
      cards: [
        {
          id: "SUMMARY-01",
          type: "summary",
          title: "Итог",
          body: "Глава завершена.",
        },
      ],
    };
    const onCompleteChapter = vi
      .fn()
      .mockRejectedValueOnce(new Error("network"))
      .mockResolvedValueOnce(undefined);

    render(<CardPlayer chapter={chapter} onCompleteChapter={onCompleteChapter} />);

    await userEvent.click(screen.getByRole("button", { name: "Завершить главу" }));

    expect(
      await screen.findByText("Не удалось сохранить прогресс. Проверьте связь и попробуйте ещё раз."),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Завершить главу" }));

    await waitFor(() => {
      expect(
        screen.queryByText("Не удалось сохранить прогресс. Проверьте связь и попробуйте ещё раз."),
      ).not.toBeInTheDocument();
    });
    expect(onCompleteChapter).toHaveBeenCalledTimes(2);
  });

  it("renders tasting notes for practice cards and saves drafts", async () => {
    const chapter: Chapter = {
      id: "practice-chapter",
      title: "Практика",
      subtitle: "Practice",
      durationMinutes: 3,
      cards: [
        {
          id: "PRACTICE-01",
          type: "practice",
          title: "Наблюдение",
          body: "Запиши аромат.",
          promptFields: ["nose"],
          feedback: "Заметка сохранена.",
        },
      ],
    };
    const onSaveTastingNote = vi.fn().mockResolvedValue(undefined);

    render(
      <CardPlayer
        chapter={chapter}
        onCompleteChapter={vi.fn()}
        onSaveTastingNote={onSaveTastingNote}
      />,
    );

    await userEvent.type(screen.getByLabelText("Аромат (Nose)"), "ваниль");
    await userEvent.click(screen.getByRole("button", { name: "Сохранить заметку" }));

    expect(onSaveTastingNote).toHaveBeenCalledWith({ nose: "ваниль" });
  });
});
