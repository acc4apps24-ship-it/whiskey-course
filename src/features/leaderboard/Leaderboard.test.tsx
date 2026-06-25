import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Leaderboard } from "./Leaderboard";

describe("Leaderboard", () => {
  it("shows rank, name, XP, achievements, completed chapters, and current user marker", () => {
    render(
      <Leaderboard
        entries={[
          {
            rank: 1,
            userId: "u1",
            displayName: "Андрей",
            totalXp: 1320,
            completedChapters: 5,
            achievements: ["Первый драм"],
            isCurrentUser: false,
          },
          {
            rank: 9,
            userId: "u2",
            displayName: "Ты",
            totalXp: 420,
            completedChapters: 2,
            achievements: ["Разведчик Спейсайда"],
            isCurrentUser: true,
          },
        ]}
      />,
    );

    expect(screen.getByText("#1")).toBeInTheDocument();
    expect(screen.getByText("Андрей")).toBeInTheDocument();
    expect(screen.getByText("1320 XP")).toBeInTheDocument();
    expect(screen.getByText("5 глав")).toBeInTheDocument();
    expect(screen.getByText("Первый драм")).toBeInTheDocument();
    expect(screen.getByText("Разведчик Спейсайда")).toBeInTheDocument();
    expect(screen.getByText("Текущий игрок")).toBeInTheDocument();
  });

  it("shows empty state", () => {
    render(<Leaderboard entries={[]} />);

    expect(
      screen.getByText("Пока нет результатов. Стань первым в лиге."),
    ).toBeInTheDocument();
  });
});
