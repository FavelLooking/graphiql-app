import React from "react";
import {render, waitFor} from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes, Navigate } from "react-router-dom";
import { vi } from "vitest";
import ProtectedRoute from "../ProtectedRoute";
import store, { RootState } from "../../store/store";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../store/authSlice";
import { Main } from "~/components/main/main";
import "@testing-library/jest-dom";

vi.mock("react-redux", async () => {
  const actual =
    await vi.importActual<typeof import("react-redux")>("react-redux");
  return {
    ...actual,
    useSelector: (fn: (state: RootState) => unknown) => fn(store.getState()),
  };
});

describe("ProtectedRoute", () => {
  const mockStore = (initialState: Partial<RootState>) =>
    configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState: initialState,
    });

  const renderWithProviders = (
    element: React.ReactElement,
    store: ReturnType<typeof mockStore>,
  ) => {
    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/protected"]}>
          <Routes>
            <Route path="/protected" element={element} />
            <Route path="/" element={<Navigate to="/" />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );
  };

  test("redirects to redirectPath if token exists", async () => {
    const storeWithToken = mockStore({
      auth: {token: "fakeToken"},
    });

    const {container} = renderWithProviders(
        <ProtectedRoute element={<Main/>}/>,
        storeWithToken,
    );

    await waitFor(() => {
      expect(container.innerHTML).toContain("main");
    });
  });

  test("renders element if token does not exist", () => {
    const storeWithoutToken = mockStore({
      auth: { token: null },
    });

    const { getByText } = renderWithProviders(
      <ProtectedRoute element={<div>Protected Content</div>} />,
      storeWithoutToken,
    );

    expect(getByText("Protected Content")).toBeInTheDocument();
  });

  test("redirects to default path '/' when no redirectPath is provided and token exists", async () => {
    const storeWithToken = mockStore({
      auth: {token: "fakeToken"},
    });

    const {container} = renderWithProviders(
        <ProtectedRoute element={<Main/>}/>,
        storeWithToken,
    );

    await waitFor(() => {
      expect(container.innerHTML).toContain("main");
    });
  });

  test("renders the protected component if no token and doesn't redirect", () => {
    const storeWithoutToken = mockStore({
      auth: { token: null },
    });

    const { getByText } = renderWithProviders(
      <ProtectedRoute element={<div>Protected Content</div>} />,
      storeWithoutToken,
    );

    expect(getByText("Protected Content")).toBeInTheDocument();
  });
});
