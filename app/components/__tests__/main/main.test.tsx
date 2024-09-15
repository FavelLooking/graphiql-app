import {render, screen, waitFor, within} from "@testing-library/react";
import { Main } from "../../main/main";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import { auth } from "~/utils/firebaseConfig";
import {createInstance} from "i18next";
import {Provider} from "react-redux";
import store from "~/store/store";
import {MemoryRouter} from "react-router-dom";
import {I18nextProvider} from "react-i18next";

vi.mock("../../../utils/firebaseConfig", () => ({
  auth: {
    currentUser: null,
  },
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({
    currentUser: null,
  })),
  onAuthStateChanged: vi.fn((auth, callback) => {
    callback({ uid: 'testUser' });
    return () => {};
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

const i18n = createInstance();

i18n.init({
  lng: "en",
  resources: {
    en: {
      translation: {
        buttons: {
          signIn: "Sign In",
          signUp: "Sign Up",
          signOut: "Sign Out",
        },
      },
    },
  }
})

describe("Main Component", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("renders main sections correctly", async () => {
    render(
        <Provider store={store}>
          <MemoryRouter>
            <I18nextProvider i18n={i18n}>
              <Main />
            </I18nextProvider>
          </MemoryRouter>
        </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByRole("main")).toBeInTheDocument();
      expect(screen.getByText("welcome")).toBeInTheDocument();
      expect(screen.getByText("description")).toBeInTheDocument();
      expect(screen.getByText("developers")).toBeInTheDocument();
      expect(screen.getByText("cource")).toBeInTheDocument();
    })
  });

  test("renders developer information correctly", async () => {
    render(
        <Provider store={store}>
          <MemoryRouter>
            <I18nextProvider i18n={i18n}>
              <Main />
            </I18nextProvider>
          </MemoryRouter>
        </Provider>,
    );
    await waitFor(() => {
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
    })
  });

  test("renders rest, graphql, and history buttons when user is signed in", () => {
    auth.currentUser = { uid: "123", email: "test@example.com" };

    render(
        <Provider store={store}>
          <MemoryRouter>
            <I18nextProvider i18n={i18n}>
              <Main />
            </I18nextProvider>
          </MemoryRouter>
        </Provider>,
    );
    expect(screen.getByText("buttons.restClient")).toBeInTheDocument();
    expect(screen.getByText("buttons.graphiqlClient")).toBeInTheDocument();
    expect(screen.getByText("buttons.history")).toBeInTheDocument();
  });

  test("renders course information with HTML content", () => {
    render(
        <Provider store={store}>
          <MemoryRouter>
            <I18nextProvider i18n={i18n}>
              <Main />
            </I18nextProvider>
          </MemoryRouter>
        </Provider>,
    );
    expect(screen.getByText("courseInfo")).toBeInTheDocument();
  });
});
