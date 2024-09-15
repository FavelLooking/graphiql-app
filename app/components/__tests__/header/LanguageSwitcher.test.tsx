import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LanguageSwitcher } from "../../header/LanguageSwitcher";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { createInstance } from "i18next";
import "@testing-library/jest-dom";

const i18n = createInstance();

describe("LanguageSwitcher", () => {
  beforeAll(() => {
    i18n.use(initReactI18next).init({
      lng: "en",
      resources: {
        en: { translation: {} },
        ru: { translation: {} },
      },
    });
  });

  it("should render the button with the correct initial language", () => {
    const { getByText } = render(
      <I18nextProvider i18n={i18n}>
        <LanguageSwitcher />
      </I18nextProvider>,
    );

    expect(getByText("Рус")).toBeInTheDocument();
  });

  it("should toggle the language when the button is clicked", () => {
    const { getByText } = render(
      <I18nextProvider i18n={i18n}>
        <LanguageSwitcher />
      </I18nextProvider>,
    );

    const button = getByText("Рус");
    fireEvent.click(button);

    expect(i18n.language).toBe("ru");
    expect(getByText("En")).toBeInTheDocument();
  });
});
