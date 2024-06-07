import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Input from "../../common/input";

describe("Input Component", () => {
  it("renders correctly", () => {
    render(
      <Input name="test" label="Test Label" width="200px" height="40px" />,
    );
    const inputElement = screen.getByLabelText("Test Label");
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveStyle("width: 200px");
    expect(inputElement).toHaveStyle("height: 40px");
  });

  it("displays the label correctly", () => {
    render(<Input name="test" label="Test Label" />);
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("applies the disabled state", () => {
    render(<Input name="test" disabled={true} />);
    const inputElement = screen.getByRole("textbox");
    expect(inputElement).toBeDisabled();
  });

  it("displays error messages", () => {
    const errorMessage = "Error message";
    render(<Input name="test" error={errorMessage} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toHaveClass("text-red-500");
  });

  it("handles input changes", () => {
    const handleOnChange = jest.fn();
    render(<Input name="test" onChange={handleOnChange} />);
    const inputElement = screen.getByRole("textbox");
    fireEvent.change(inputElement, { target: { value: "New value" } });
    expect(handleOnChange).toHaveBeenCalled();
  });
});
