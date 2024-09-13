import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeAll } from "vitest";
import { Footer } from "../../footer/footer";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { createInstance } from "i18next";
import "@testing-library/jest-dom";

const i18n = createInstance();

describe("Footer", () => {
  beforeAll(() => {
    i18n.use(initReactI18next).init({
      lng: "en",
      resources: {
        en: {
          translation: {
            titles: {
              taskGH: "GitHub Repository",
            },
          },
        },
        ru: {
          translation: {
            titles: {
              taskGH: "Репозиторий GitHub",
            },
          },
        },
      },
    });
  });

  it("should render the GitHub link with correct text", () => {
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <Footer />
        </I18nextProvider>
      </MemoryRouter>
    );

    const githubLink = screen.getByText("GitHub Repository");
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/FavelLooking/graphiql-app"
    );
  });

  it("should render the year 2024", () => {
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <Footer />
        </I18nextProvider>
      </MemoryRouter>
    );

    const yearText = screen.getByText("2024");
    expect(yearText).toBeInTheDocument();
  });

  it("should render the course logo with correct alt text", () => {
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <Footer />
        </I18nextProvider>
      </MemoryRouter>
    );

    const courseLogo = screen.getByAltText("course logo");
    expect(courseLogo).toBeInTheDocument();
    expect(courseLogo).toHaveAttribute("src", "/rss-logo.svg");
  });
});
