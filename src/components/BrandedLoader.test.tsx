import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BrandedLoader } from "./BrandedLoader";

describe("BrandedLoader", () => {
  it("renders whisky glass loader with accessible label", () => {
    render(<BrandedLoader label="Готовим первый драм" />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Готовим первый драм",
    );
    expect(
      screen.getByLabelText("Бокал виски наполняется"),
    ).toBeInTheDocument();
  });
});
