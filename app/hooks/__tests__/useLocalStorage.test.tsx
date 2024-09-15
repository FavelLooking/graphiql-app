import { renderHook, act } from "@testing-library/react";
import useLocalStorage from "../useLocalStorage";

const originalConsoleError = console.error;
const originalWindow = global.window;

describe("useLocalStorage", () => {
  beforeEach(() => {
    console.error = vi.fn();
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    console.error = originalConsoleError;
    global.window = originalWindow;
  });

  test("initializes with value from localStorage if available", () => {
    window.localStorage.setItem("testKey", JSON.stringify("stored value"));

    const { result } = renderHook(() =>
      useLocalStorage("testKey", "default value"),
    );

    expect(result.current[0]).toBe("stored value");
  });

  test("initializes with default value if localStorage is empty", () => {
    const { result } = renderHook(() =>
      useLocalStorage("testKey", "default value"),
    );

    expect(result.current[0]).toBe("default value");
  });

  test("sets new value and updates localStorage", () => {
    const { result } = renderHook(() =>
      useLocalStorage("testKey", "default value"),
    );

    act(() => {
      result.current[1]("new value");
    });

    expect(result.current[0]).toBe("new value");
    expect(window.localStorage.getItem("testKey")).toBe(
      JSON.stringify("new value"),
    );
  });

  test("handles JSON parse error and uses default value", () => {
    window.localStorage.setItem("testKey", "invalid JSON");

    const { result } = renderHook(() =>
      useLocalStorage("testKey", "default value"),
    );

    expect(console.error).toHaveBeenCalled();
    expect(result.current[0]).toBe("default value");
  });
});
