import {
  render,
  fireEvent,
  screen,
  waitFor,
  act,
} from "@testing-library/react";
import CodeEditor, { ICodeEditorProps } from "../../editor/Editor";
import { vi } from "vitest";
import "@testing-library/jest-dom";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("codemirror", () => {
  const fromTextAreaMock = vi.fn(() => ({
    getValue: vi.fn(() => ""),
    setValue: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    toTextArea: vi.fn(),
    setSize: vi.fn(),
  }));

  return {
    __esModule: true,
    default: {
      fromTextArea: fromTextAreaMock,
    },
  };
});

vi.mock("codemirror-ssr", () => ({
  __esModule: true,
  default: vi.fn(() => ({
    fromTextArea: vi.fn(() => ({
      getValue: vi.fn(() => ""),
      setValue: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
      toTextArea: vi.fn(),
      setSize: vi.fn(),
    })),
  })),
}));

vi.mock("codemirror-ssr/addon/display/placeholder", () => ({
  __esModule: true,
  default: vi.fn(),
}));

describe("CodeEditor Component", () => {
  const defaultProps: ICodeEditorProps = {
    value: "",
    onChange: vi.fn(),
    onBlur: vi.fn(),
    variablesValue: "",
    onVariablesChange: vi.fn(),
    onVariablesBlur: vi.fn(),
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("Компонент рендерится без ошибок", () => {
    render(<CodeEditor {...defaultProps} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("Тогглирование видимости редактора переменных", () => {
    render(<CodeEditor {...defaultProps} />);
    const toggleButton = screen.getByRole("button");

    expect(screen.queryByTestId("variables-editor")).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(screen.getByTestId("variables-editor")).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(screen.queryByTestId("variables-editor")).toBeInTheDocument();
  });

  test("Вызывается onChange при изменении текста в основном редакторе", async () => {
    render(<CodeEditor {...defaultProps} />);

    const factoryMock = (await import("codemirror-ssr"))
      .default as unknown as vi.Mock;

    await waitFor(() => {
      expect(factoryMock).toHaveBeenCalled();
    });

    const codemirrorInstance = factoryMock.mock.results[0].value;

    const fromTextAreaMock =
      codemirrorInstance.fromTextArea as unknown as vi.Mock;

    await waitFor(() => {
      expect(fromTextAreaMock).toHaveBeenCalled();
    });

    const editorInstance = fromTextAreaMock.mock.results[0].value;

    const onMock = editorInstance.on as unknown as vi.Mock;

    const changeHandler = onMock.mock.calls.find(
      (call) => call[0] === "change",
    )[1];

    changeHandler();

    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  test("Вызывается onVariablesChange при изменении текста в редакторе переменных", async () => {
    render(<CodeEditor {...defaultProps} />);

    const factoryMock = (await import("codemirror-ssr"))
      .default as unknown as vi.Mock;

    await waitFor(() => {
      expect(factoryMock).toHaveBeenCalled();
    });

    const codemirrorInstance = factoryMock.mock.results[0].value;

    const fromTextAreaMock =
      codemirrorInstance.fromTextArea as unknown as vi.Mock;

    await waitFor(() => {
      expect(fromTextAreaMock.mock.calls.length).toBeGreaterThanOrEqual(2);
    });

    const mockVariablesEditorInstance = fromTextAreaMock.mock.results[1].value;

    const onMock = mockVariablesEditorInstance.on as unknown as vi.Mock;

    const changeHandler = onMock.mock.calls.find(
      (call) => call[0] === "change",
    )[1];

    changeHandler();

    expect(defaultProps.onVariablesChange).toHaveBeenCalled();
  });

  test("Вызывается onBlur при потере фокуса основным редактором", async () => {
    await act(async () => {
      render(<CodeEditor {...defaultProps} />);
    });

    const factoryMock = (await import("codemirror-ssr"))
      .default as unknown as vi.Mock;

    expect(factoryMock).toHaveBeenCalled();

    const codemirrorInstance = factoryMock.mock.results[0].value;

    const fromTextAreaMock =
      codemirrorInstance.fromTextArea as unknown as vi.Mock;

    expect(fromTextAreaMock).toHaveBeenCalled();

    const editorInstance = fromTextAreaMock.mock.results[0].value;

    const onMock = editorInstance.on as unknown as vi.Mock;
    const blurHandler = onMock.mock.calls.find(
      (call) => call[0] === "blur",
    )[1];

    blurHandler();

    expect(defaultProps.onBlur).toHaveBeenCalled();
  });

  test("Вызывается onVariablesBlur при потере фокуса редактором переменных", async () => {
    const onVariablesBlurMock = vi.fn();

    const testProps = {
      ...defaultProps,
      onVariablesBlur: onVariablesBlurMock,
    };

    render(<CodeEditor {...testProps} />);

    const factory = (await import("codemirror-ssr"))
      .default as unknown as vi.Mock;

    await waitFor(() => {
      expect(factory).toHaveBeenCalled();
    });

    const codemirrorInstance = factory.mock.results[0].value;

    const fromTextAreaMock =
      codemirrorInstance.fromTextArea as unknown as vi.Mock;

    await waitFor(() => {
      expect(fromTextAreaMock.mock.calls.length).toBeGreaterThanOrEqual(2);
    });

    const mockVariablesEditorInstance = fromTextAreaMock.mock.results[1].value;

    const onMock = mockVariablesEditorInstance.on as unknown as vi.Mock;

    const blurHandler = onMock.mock.calls.find(
      (call) => call[0] === "blur",
    )[1];

    blurHandler();

    expect(onVariablesBlurMock).toHaveBeenCalled();
  });
});
