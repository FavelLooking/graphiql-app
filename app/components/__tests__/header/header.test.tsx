import { render, screen /*fireEvent*/ } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Header } from "../../header/header";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { createInstance } from "i18next";
import store from "../../../store/store";
import "@testing-library/jest-dom";

const i18n = createInstance();

describe("Header", () => {
  beforeAll(() => {
    i18n.use(initReactI18next).init({
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
        ru: {
          translation: {
            buttons: {
              signIn: "Войти",
              signUp: "Зарегистрироваться",
              signOut: "Выйти",
            },
          },
        },
      },
    });
  });

  it("should render the logo and language switcher", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <I18nextProvider i18n={i18n}>
            <Header />
          </I18nextProvider>
        </MemoryRouter>
      </Provider>,
    );

    const logo = screen.getByAltText("logo");
    expect(logo).toBeInTheDocument();

    const languageSwitcher = screen.getByText("Рус");
    expect(languageSwitcher).toBeInTheDocument();
  });

  it("should show 'Sign In' and 'Sign Up' buttons when no token is present", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <I18nextProvider i18n={i18n}>
            <Header />
          </I18nextProvider>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText("Sign In")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
  });

  it("should show 'Sign Out' button when a token is present", () => {
    vi.spyOn(store.getState().auth, "token", "get").mockReturnValue(
      "fake-token",
    );

    render(
      <Provider store={store}>
        <MemoryRouter>
          <I18nextProvider i18n={i18n}>
            <Header />
          </I18nextProvider>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText("Sign Out")).toBeInTheDocument();
  });
});
