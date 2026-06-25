import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { course } from "@/content/course";
import { CourseMap } from "./CourseMap";

describe("CourseMap", () => {
  it("shows chapters and locks final challenge before base completion", async () => {
    const onOpenChapter = vi.fn();
    render(
      <CourseMap
        course={course}
        completedChapterIds={[]}
        onOpenChapter={onOpenChapter}
      />,
    );

    expect(screen.getByText("Первый драм")).toBeInTheDocument();
    expect(screen.getByText("Спейсайд")).toBeInTheDocument();
    expect(screen.getByText("Финальное испытание закрыто")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Открыть Первый драм" }));
    expect(onOpenChapter).toHaveBeenCalledWith("chapter-1-first-dram");
  });
});
