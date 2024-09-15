import { render, screen, within } from "@testing-library/react";
import { Main } from "../../main/main";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import { auth } from "../../../utils/firebaseConfig";

vi.mock("../../../utils/firebaseConfig", () => ({
  auth: {
    currentUser: null,
  },
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("../../button/RedirectButton", () => ({
  RedirectButton: ({
    text,
    redirectPath,
  }: {
    text: string;
    redirectPath: string;
  }) => (
    <button data-testid="redirect-button" data-redirect={redirectPath}>
      {text}
    </button>
  ),
}));

describe("Main Component", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("renders main sections correctly", () => {
    render(<Main />);

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByText("welcome")).toBeInTheDocument();
    expect(screen.getByText("description")).toBeInTheDocument();
    expect(screen.getByText("developers")).toBeInTheDocument();
    expect(screen.getByText("cource")).toBeInTheDocument();
  });

  test("renders developer information correctly", () => {
    render(<Main />);

    expect(screen.getByText("maxim")).toBeInTheDocument();
    expect(screen.getByText("pavel")).toBeInTheDocument();
    expect(screen.getByText("fedor")).toBeInTheDocument();

    const maximHeading = screen.getByText("maxim");
    const maximSection = maximHeading.closest("div");

    expect(maximSection).toBeInTheDocument();

    const maximLink = within(maximSection).getByRole("link", {
      name: "github",
    });
    expect(maximLink).toHaveAttribute(
      "href",
      "https://github.com/maximozaitsev",
    );
  });

  test("renders sign-in and sign-up buttons when user is not signed in", () => {
    render(<Main />);

    expect(screen.getByText("buttons.signIn")).toBeInTheDocument();
    expect(screen.getByText("buttons.signUp")).toBeInTheDocument();
  });

  test("renders rest, graphql, and history buttons when user is signed in", () => {
    auth.currentUser = { uid: "123", email: "test@example.com" };

    render(<Main />);

    expect(screen.getByText("buttons.restClient")).toBeInTheDocument();
    expect(screen.getByText("buttons.graphiqlClient")).toBeInTheDocument();
    expect(screen.getByText("buttons.history")).toBeInTheDocument();
  });

  test("renders course information with HTML content", () => {
    render(<Main />);

    expect(screen.getByText("courseInfo")).toBeInTheDocument();
  });
});
