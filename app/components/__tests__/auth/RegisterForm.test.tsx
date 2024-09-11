import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import RegisterForm from "../../auth/RegisterForm";
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
        "buttons.signUp": "Sign Up",
        "titles.email": "Email",
        "titles.password": "Password",
        "titles.confirmPassword": "Confirm Password",
      },
    },
  },
});

describe("RegisterForm", () => {
  it("renders email, password, and confirm password inputs", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <RegisterForm />
          </I18nextProvider>
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();

    const passwordFields = screen.getAllByLabelText(/password/i);
    expect(passwordFields[0]).toBeInTheDocument();
    expect(passwordFields[1]).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <RegisterForm />
          </I18nextProvider>
        </BrowserRouter>
      </Provider>
    );

    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
  });
});
