import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginForm from "../../auth/LoginForm";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { I18nextProvider } from "react-i18next";
import { createInstance } from "i18next";
import store from "../../../store/store";
import * as authHandler from "../../../utils/authHandler";
import { vi } from "vitest";

const i18n = createInstance();

i18n.init({
  lng: "en",
  resources: {
    en: {
      translation: {
        "buttons.signIn": "Sign In",
        "titles.email": "Email",
        "titles.password": "Password",
        "notifications.successLogin": "Login successful! Redirecting...",
        "notifications.errorLogin":
          "Error logging in. Please check your credentials.",
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
      </Provider>,
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
      </Provider>,
    );

    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("submits the form and handles success notification", async () => {
    const mockAuthSubmit = vi
      .spyOn(authHandler, "handleAuthSubmit")
      .mockResolvedValue({ success: true, message: "Login successful!" });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <LoginForm />
          </I18nextProvider>
        </BrowserRouter>
      </Provider>,
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    // Simulate user input
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Password123!" } });

    // Submit the form
    fireEvent.click(submitButton);

    // Wait for the notification to appear
    await waitFor(() =>
      expect(screen.getByText("Login successful!")).toBeInTheDocument(),
    );

    expect(mockAuthSubmit).toHaveBeenCalledWith(
      true,
      "test@example.com",
      "Password123!",
      expect.anything(),
      expect.anything(),
    );

    // Cleanup mock
    mockAuthSubmit.mockRestore();
  });
});
