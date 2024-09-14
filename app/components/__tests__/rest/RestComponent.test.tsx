import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { RestComponent } from "~/components/rest/RestComponent";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import store from "~/store/store";
import { createInstance } from "i18next";
import { I18nextProvider } from "react-i18next";

const i18n = createInstance();

i18n.init({
  lng: "en",
  resources: {
    en: {
      translation: {
        "titles.body": "Body",
        "titles.variable": "Variable",
        "titles.header": "Header",
        "buttons.addVariable": "Add Variable",
        "buttons.addHeader": "Add Header",
        "buttons.sendRequest": "Send Request",
      },
    },
  },
});

const dispatchMock = vi.fn();

vi.mock("react-redux", async () => {
  const actual =
    await vi.importActual<typeof import("react-redux")>("react-redux");
  return {
    ...actual,
    useDispatch: () => dispatchMock,
  };
});

const decodeBase64 = (str: string) => {
  return decodeURIComponent(escape(atob(str)));
};

const encodeBase64 = (str: string) => {
  return btoa(unescape(encodeURIComponent(str)));
};

const navigateMock = vi.fn();
const useLocationMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useLocation: () => useLocationMock(),
  };
});


interface IControlledProps {
  value?: string;
  onBeforeChange?: (editor: unknown, data: unknown, value: string) => void;
}

vi.mock("react-codemirror2", () => ({
  Controlled: ({ value = "", onBeforeChange }: IControlledProps) => {
    return (
      <textarea
        data-testid="code-mirror"
        value={value}
        onChange={(e) => {
          if (onBeforeChange) {
            onBeforeChange(null, null, e.target.value);
          }
        }}
      />
    );
  },
}));

vi.spyOn(store, "dispatch").mockImplementation(dispatchMock);

describe("RestComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (serverData = null) => {
    return render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <MemoryRouter initialEntries={["/"]}>
            <Routes>
              <Route
                path="*"
                element={<RestComponent serverData={serverData} />}
              />
            </Routes>
          </MemoryRouter>
        </I18nextProvider>
      </Provider>,
    );
  };

  test("Компонент рендерится без ошибок", () => {
    renderComponent();
    expect(screen.getByPlaceholderText("API Endpoint")).toBeInTheDocument();
  });

  test("Можно выбрать HTTP-метод", () => {
    renderComponent();
    const methodSelect = screen.getByRole("combobox", { name: "method" });
    fireEvent.change(methodSelect, { target: { value: "POST" } });
    expect(methodSelect).toHaveValue("POST");
  });

  test("Обновление поля endpoint", () => {
    renderComponent();
    const endpointInput = screen.getByPlaceholderText("API Endpoint");
    fireEvent.change(endpointInput, {
      target: { value: "https://api.example.com" },
    });
    expect(endpointInput).toHaveValue("https://api.example.com");
  });

  test("Добавление нового заголовка", () => {
    renderComponent();
    const addButton = screen.getByText("Add Header");
    fireEvent.click(addButton);
    const headerKeys = screen.getAllByPlaceholderText("Header Key");
    expect(headerKeys.length).toBeGreaterThan(1);
  });

  test("Добавление новой переменной", () => {
    renderComponent();
    const addButton = screen.getByText("Add Variable");
    fireEvent.click(addButton);
    const variableKeys = screen.getAllByPlaceholderText("Variable Key");
    expect(variableKeys.length).toBeGreaterThan(1);
  });

  test("Обновление URL при изменении состояния", () => {
    const replaceStateSpy = vi.spyOn(window.history, "replaceState");
    renderComponent();
    const endpointInput = screen.getByPlaceholderText("API Endpoint");
    fireEvent.change(endpointInput, {
      target: { value: "https://swapi.dev/api/" },
    });
    expect(replaceStateSpy).toHaveBeenCalled();
  });

  test("Рендеринг ответа сервера", () => {
    const serverData = {
      response: 200,
      data: {
        people: "https://swapi.dev/api/people/",
        planets: "https://swapi.dev/api/planets/",
        films: "https://swapi.dev/api/films/",
        species: "https://swapi.dev/api/species/",
        vehicles: "https://swapi.dev/api/vehicles/",
        starships: "https://swapi.dev/api/starships/",
      },
    };

    renderComponent(serverData);

    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Response status: 200")).toBeInTheDocument();
    expect(screen.getByText("Response:")).toBeInTheDocument();

    const responseElement = screen.getByTestId("server-response");
    const expectedText = JSON.stringify(serverData.data, null, 2);

    expect(responseElement).toHaveTextContent(
      new RegExp(expectedText.replace(/\s+/g, "\\s*")),
    );
  });

  test("Рендеринг CodeMirror при методе POST", async () => {
    renderComponent();
    const methodSelect = screen.getByRole("combobox", { name: "method" });

    await act(async () => {
      fireEvent.change(methodSelect, { target: { value: "POST" } });
    });

    await waitFor(() => {
      expect(screen.getByText("Body")).toBeInTheDocument();
    });

    expect(screen.getByTestId("code-mirror")).toBeInTheDocument();
  });

  test("Не рендерить CodeMirror при методе GET", () => {
    renderComponent();
    expect(screen.queryByText("Body")).not.toBeInTheDocument();
  });

  test("Функция encodeBase64 корректно кодирует строку", () => {
    const originalString = "Привет, мир!";
    const encodedString = encodeBase64(originalString);
    expect(encodedString).toBe(
      btoa(unescape(encodeURIComponent(originalString))),
    );
  });

  test("Функция decodeBase64 корректно декодирует строку", () => {
    const originalString = "Привет, мир!";
    const encodedString = encodeBase64(originalString);
    const decodedString = decodeBase64(encodedString);
    expect(decodedString).toBe(originalString);
  });

  test("URL обновляется при изменении метода", async () => {
    const replaceStateSpy = vi.spyOn(window.history, "replaceState");
    renderComponent();
    const methodSelect = screen.getByRole("combobox", { name: "method" });

    await act(async () => {
      fireEvent.change(methodSelect, { target: { value: "POST" } });
    });

    expect(replaceStateSpy).toHaveBeenCalled();
  });

  test("Изменение значения заголовка", () => {
    renderComponent();
    const addButton = screen.getByText("Add Header");
    fireEvent.click(addButton);

    const headerKeys = screen.getAllByPlaceholderText("Header Key");
    const headerValues = screen.getAllByPlaceholderText("Header Value");

    // Изменяем второй заголовок
    fireEvent.change(headerKeys[1], { target: { value: "Authorization" } });
    fireEvent.change(headerValues[1], { target: { value: "Bearer token" } });

    expect(headerKeys[1]).toHaveValue("Authorization");
    expect(headerValues[1]).toHaveValue("Bearer token");
  });

  test("Изменение значения переменной", () => {
    renderComponent();
    const addButton = screen.getByText("Add Variable");
    fireEvent.click(addButton);

    const variableKeys = screen.getAllByPlaceholderText("Variable Key");
    const variableValues = screen.getAllByPlaceholderText("Variable Value");

    // Изменяем вторую переменную
    fireEvent.change(variableKeys[1], { target: { value: "userId" } });
    fireEvent.change(variableValues[1], { target: { value: "456" } });

    expect(variableKeys[1]).toHaveValue("userId");
    expect(variableValues[1]).toHaveValue("456");
  });

  test("Изменение содержимого CodeMirror обновляет bodyContent", async () => {
    const replaceStateSpy = vi.spyOn(window.history, "replaceState");

    renderComponent();
    const methodSelect = screen.getByRole("combobox", { name: "method" });

    await act(async () => {
      fireEvent.change(methodSelect, { target: { value: "POST" } });
    });

    const codeMirrorElement = screen.getByTestId("code-mirror");

    await act(async () => {
      fireEvent.change(codeMirrorElement, {
        target: { value: '{"newKey":"newValue"}' },
      });
    });

    await waitFor(() => {
      expect(replaceStateSpy).toHaveBeenCalled();
    });

    expect(codeMirrorElement).toHaveValue('{"newKey":"newValue"}');
  });

  test.each(["POST", "PUT", "PATCH", "DELETE"])(
    "Рендеринг CodeMirror при методе %s",
    async (method) => {
      renderComponent();
      const methodSelect = screen.getByRole("combobox", { name: "method" });

      await act(async () => {
        fireEvent.change(methodSelect, { target: { value: method } });
      });

      await waitFor(() => {
        expect(screen.getByText("Body")).toBeInTheDocument();
      });

      expect(screen.getByTestId("code-mirror")).toBeInTheDocument();
    },
  );
});
