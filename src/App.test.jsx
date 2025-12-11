import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "./App";

describe("App", () => {
  test("updates the top text", async () => {
    // Arrangee
    const user = userEvent.setup();
    render(<App />);
    const topTextBox = screen.getAllByRole("textbox")[0];
    // Act
    await user.clear(topTextBox);
    await user.type(topTextBox, "A coder does not simply");

    // Assert
    expect(screen.getByText("A coder does not simply")).toBeInTheDocument();
  });

  test("updates the bottom text", async () => {
    const user = userEvent.setup();
    render(<App />);
    const bottomTextBox = screen.getAllByRole("textbox")[1];

    await user.clear(bottomTextBox);
    await user.type(bottomTextBox, "Code without coffee");

    expect(screen.getByText("Code without coffee")).toBeInTheDocument();
  });
  
  
 test("gets a new meme image", async() => {
   // Arrangee
    const user = userEvent.setup()
    render(<App />)
    const getMemeImageButton = screen.getByRole('button')
    
   // Act
   await user.click(getMemeImageButton)
   
   // Assert
  const images = screen.getAllByRole('img') 
  expect(images[1].src).toBe("https://i.imgflip.com/1c1uej.jpg")
  
 }) 

  
});
