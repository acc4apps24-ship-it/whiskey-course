import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { course } from "@/content/course";
import { CardPlayer } from "./CardPlayer";

describe("CardPlayer", () => {
  it("does not reveal quiz answer before selection and shows explanation after answer", async () => {
    const onCompleteChapter = vi.fn();
    render(
      <CardPlayer
        chapter={course.chapters[0]}
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
});
