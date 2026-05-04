import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Index from "./Index.jsx";

describe("Index page", () => {
  it("shows the main hero heading", () => {
    render(
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Aircraft Detection/);
  });

  it("shows detection module cards", () => {
    render(
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    );
    expect(screen.getByText("Upload Image")).toBeInTheDocument();
    expect(screen.getByText("Upload Video")).toBeInTheDocument();
  });
});
