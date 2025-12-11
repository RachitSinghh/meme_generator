import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";

import Main from "./Main";

describe("Main", () => {
  test("renders the default meme UI", () => {
    render(<Main />);
    expect(screen.getByText("Top Text")).toBeInTheDocument();

    expect(screen.getByText("Bottom Text")).toBeInTheDocument();

    expect(screen.getByText("One does not simply")).toBeInTheDocument();

    expect(screen.getByText("Walk into Mordor")).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("One does not simply"),
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Walk into Mordor")).toBeInTheDocument();

    expect(screen.getByRole("button")).toHaveTextContent("Get a new meme image 🖼");
  });
});
