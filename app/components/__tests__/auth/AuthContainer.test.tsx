import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AuthContainer from "../../auth/AuthContainer";
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
        "buttons.login": "Login",
        "buttons.register": "Register",
      },
    },
  },
});

describe("AuthContainer", () => {
  it("renders the login form by default", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <AuthContainer />
          </I18nextProvider>
        </BrowserRouter>
      </Provider>,
    );

    expect(screen.getByRole("heading", { name: /Login/i })).toBeTruthy();
  });

  it("switches to register form when register tab is clicked", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <AuthContainer />
          </I18nextProvider>
        </BrowserRouter>
      </Provider>,
    );

    fireEvent.click(screen.getByText("Register"));

    expect(screen.queryByRole("heading", { name: /Register/i })).toBeTruthy();
  });
});
