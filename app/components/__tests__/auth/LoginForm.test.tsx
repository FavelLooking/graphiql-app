import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginForm from "../../auth/LoginForm";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { I18nextProvider } from "react-i18next";
import { createInstance } from "i18next";
import store from "../../../store/store";

const i18n = createInstance();

i18n.init({
  lng: "en",
  resources: {
    en: {
      translation: {
        "buttons.signIn": "Sign In",
        "titles.email": "Email",
        "titles.password": "Password",
      },
    },
  },
});

describe("LoginForm", () => {
  it("renders email and password inputs", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <LoginForm />
          </I18nextProvider>
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <LoginForm />
          </I18nextProvider>
        </BrowserRouter>
      </Provider>
    );

    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });
});
