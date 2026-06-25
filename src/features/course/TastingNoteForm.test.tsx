import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TastingNoteForm } from "./TastingNoteForm";

describe("TastingNoteForm", () => {
  it("saves partial notes without clearing data", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(<TastingNoteForm onSave={onSave} />);

    await userEvent.type(screen.getByLabelText("Аромат (Nose)"), "яблоко и мёд");
    await userEvent.click(screen.getByRole("button", { name: "Сохранить заметку" }));

    expect(onSave).toHaveBeenCalledWith({ nose: "яблоко и мёд" });
    expect(screen.getByDisplayValue("яблоко и мёд")).toBeInTheDocument();
  });
});
