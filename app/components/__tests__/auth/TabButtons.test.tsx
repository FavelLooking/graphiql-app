import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import TabButtons from "../../auth/TabButtons";
import { vi } from "vitest";
import { I18nextProvider } from "react-i18next";
import { createInstance } from "i18next";

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

describe("TabButtons", () => {
  it("renders the login and register buttons", () => {
    const mockOnTabChange = vi.fn();

    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <TabButtons activeTab="login" onTabChange={mockOnTabChange} />
        </I18nextProvider>
      </BrowserRouter>,
    );

    expect(screen.queryByText("Login")).not.toBeNull();
    expect(screen.queryByText("Register")).not.toBeNull();
  });
});
