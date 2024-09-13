import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import GraphQlComponent from "../../graphql/GraphQlComponent";
import historyReducer from "../../../store/historySlice";
import { configureStore } from "@reduxjs/toolkit";
import { RootState } from "../../../store/store";
import { MemoryRouter } from "react-router";
import { toast } from "react-toastify";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import { createInstance } from "i18next";
import { I18nextProvider } from "react-i18next";
import { ICodeEditorProps } from "~/components/editor/Editor";

vi.mock("react-toastify", () => ({
  toast: {
    warn: vi.fn(),
  },
}));

vi.mock("@graphiql/toolkit", () => ({
  createGraphiQLFetcher: vi.fn().mockImplementation(() => ({
    fetch: vi.fn().mockResolvedValue({
      data: {
        __schema: { types: [] },
      },
    }),
  })),
}));

vi.mock("graphql", () => ({
  buildClientSchema: vi.fn(),
  getIntrospectionQuery: vi.fn(),
  printSchema: vi.fn(() => "schema"),
}));

vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: () => vi.fn(),
}));

vi.mock("../../editor/Editor", () => ({
  __esModule: true,
  default: (props: ICodeEditorProps) => (
    <div>
      Mocked Code Mirror Component
      <input
        type="text"
        value={props.value || ""}
        onChange={(event) => {
          if (props.onChange) {
            props.onChange(event.target.value);
          }
        }}
        placeholder="Mocked Input"
      />
    </div>
  ),
}));

const i18n = createInstance();

i18n.init({
  lng: "en",
  resources: {
    en: {
      translation: {
        enterURL: "please, enter URL",
        response: "Response",
        buttons: {
          submit: "Submit",
        },
      },
    },
  },
});

vi.mock("react-i18next", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, string>;
  return {
    ...actual,
    useTranslation: () => ({ t: (key: string) => key }),
  };
});

const mockStore = (initialState: Partial<RootState>) =>
  configureStore({
    reducer: {
      history: historyReducer,
    },
    preloadedState: {
      history: initialState.history || { queries: [] },
    },
  });

describe("GraphQlComponent", () => {
  const navigate = vi.fn();
  beforeEach(() => {
    vi.mock("react-router-dom", () => ({
      ...vi.importActual("react-router-dom"),
      useNavigate: () => navigate,
    }));
  });

  const store = mockStore({
    history: {
      queries: [],
    },
  });

  const renderComponent = (serverData?: unknown) => {
    render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <MemoryRouter>
            <GraphQlComponent serverData={serverData} />
          </MemoryRouter>
        </I18nextProvider>
      </Provider>,
    );
  };

  it("renders the component correctly", () => {
    renderComponent();

    expect(screen.getByText("Endpoint URL:")).toBeInTheDocument();
    expect(screen.getByText("SDL URL:")).toBeInTheDocument();
    expect(screen.getByText(/headers/i)).toBeInTheDocument();
    expect(screen.getByText(/submit/i)).toBeInTheDocument();
    expect(screen.getByText(/prettify/i)).toBeInTheDocument();
    expect(screen.getByText(/getSDLScheme/i)).toBeInTheDocument();
  });

  it("shows a warning when an invalid URL is submitted", async () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText(/Endpoint URL:/i), {
      target: { value: "invalid-url" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Mocked Input/i), {
      target: { value: "query { test }" },
    });
    fireEvent.click(screen.getByText(/submit/i));

    await waitFor(() => {
      expect(toast.warn).toHaveBeenCalledWith("URL isn't valid");
    });
  });

  it("adds a new header row", () => {
    renderComponent();

    fireEvent.click(screen.getByText(/addHeader/i));
    expect(screen.getAllByPlaceholderText(/headerKey/i)).toHaveLength(2);
    expect(screen.getAllByPlaceholderText(/headerValue/i)).toHaveLength(2);
  });

  it("handles input changes for headers", () => {
    renderComponent();

    fireEvent.change(screen.getAllByPlaceholderText(/headerKey/i)[0], {
      target: { value: "Authorization" },
    });
    fireEvent.change(screen.getAllByPlaceholderText(/headerValue/i)[0], {
      target: { value: "Bearer token" },
    });

    const headerKeys = screen.getAllByPlaceholderText(
      /headerKey/i,
    ) as HTMLInputElement[];
    const headerValues = screen.getAllByPlaceholderText(
      /headerValue/i,
    ) as HTMLInputElement[];

    expect(headerKeys[0].value).toBe("Authorization");
    expect(headerValues[0].value).toBe("Bearer token");
  });

  it("prettifies query on button click", async () => {
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/Mocked Input/i), {
      target: { value: "query{test}" },
    });
    fireEvent.click(screen.getByText(/prettify/i));

    await waitFor(() => {
      const inputElement = screen.getByPlaceholderText(
        /Mocked Input/i,
      ) as HTMLInputElement;
      expect(inputElement.value).toBe("query {  test}");
    });
  });

  it("show response if serverData exist", () => {
    const serverData = { data: "data is exist" };
    renderComponent(serverData);
    const textElement = screen.getByText(/data is exist/i);
    expect(textElement).toBeInTheDocument();
  });
});
