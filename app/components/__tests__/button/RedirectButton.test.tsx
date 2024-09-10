import { render, screen, fireEvent } from "@testing-library/react";
import { expect } from "chai";
import { MemoryRouter } from "react-router-dom";
import { RedirectButton } from "../../button/RedirectButton";
import { act } from "react-dom/test-utils";
import { spy } from "sinon";

describe("RedirectButton", () => {
  it("renders the button with provided text", () => {
    render(
      <MemoryRouter>
        <RedirectButton text="Go to Dashboard" redirectPath="/dashboard" />
      </MemoryRouter>
    );
    const buttonElement = screen.getByText("Go to Dashboard");
    expect(buttonElement).to.exist;
  });

  it("triggers onClick callback when clicked", () => {
    const mockOnClick = spy();

    render(
      <MemoryRouter>
        <RedirectButton
          text="Go to Dashboard"
          redirectPath="/dashboard"
          onClick={mockOnClick}
        />
      </MemoryRouter>
    );

    const buttonElement = screen.getByText("Go to Dashboard");
    act(() => {
      fireEvent.click(buttonElement);
    });

    expect(mockOnClick.calledOnce).to.be.true;
  });

  it("navigates to the correct redirectPath", () => {
    render(
      <MemoryRouter>
        <RedirectButton text="Go to Dashboard" redirectPath="/dashboard" />
      </MemoryRouter>
    );

    const linkElement = screen.getByText("Go to Dashboard").closest("a");
    expect(linkElement?.getAttribute("href")).to.equal("/dashboard");
  });
});
