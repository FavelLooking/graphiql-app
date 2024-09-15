import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { History } from "../../history/History";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { RootState } from "../../../store/store";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import historyReducer from "../../../store/historySlice";
import "@testing-library/jest-dom";
import { createInstance } from "i18next";
import { I18nextProvider } from "react-i18next";

const mockStore = (initialState: Partial<RootState>) =>
  configureStore({
    reducer: {
      history: historyReducer,
    },
    preloadedState: {
      history: initialState.history || { queries: [] },
    },
  });

const i18n = createInstance();

i18n.init({
  lng: "en",
  resources: {
    en: {
      translation: {
        history: "History",
      },
    },
  },
});

describe("History Component", () => {
  it("renders empty state when no history items are present", () => {
    const store = mockStore({
      history: {
        queries: [],
      },
    });

    render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <MemoryRouter>
            <History />
          </MemoryRouter>
        </I18nextProvider>
      </Provider>,
    );

    expect(screen.getByText("buttons.history")).toBeInTheDocument();
    expect(screen.getByText("emptyHistoryP1")).toBeInTheDocument();
    expect(screen.getByText("emptyHistoryP2")).toBeInTheDocument();
    expect(screen.getByText("buttons.restClient")).toBeInTheDocument();
    expect(screen.getByText("buttons.graphiqlClient")).toBeInTheDocument();
  });

  it("renders links when history items are present", () => {
    const store = mockStore({
      history: {
        queries: [
          { query: "first search", route: "/search/1" },
          { query: "second search", route: "/search/2" },
        ],
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <History />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText("buttons.history")).toBeInTheDocument();

    const firstLink = screen.getByText("FIRST SEARCH");
    const secondLink = screen.getByText("SECOND SEARCH");

    expect(firstLink).toBeInTheDocument();
    expect(secondLink).toBeInTheDocument();
    expect(screen.getByText("/search/1")).toBeInTheDocument();
    expect(screen.getByText("/search/2")).toBeInTheDocument();
  });

  it("truncates long routes", () => {
    const store = mockStore({
      history: {
        queries: [
          {
            query: "long route search",
            route: "/really/long/example/with/more/than/30/symbols/long",
          },
        ],
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <History />
        </MemoryRouter>
      </Provider>,
    );

    const truncatedRoute = screen.getByText(
      "/really/long/example/with/more...",
    );
    expect(truncatedRoute).toBeInTheDocument();
  });

  it("redirect buttons work correctly", async () => {
    const store = mockStore({
      history: {
        queries: [],
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/history"]}>
          <Routes>
            <Route path="/history" element={<History />} />
            <Route path="/rest" element={<div>GET Page</div>} />
            <Route path="/graphql" element={<div>GraphQL Page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    const restButton = screen.getByText("buttons.restClient");
    const graphqlButton = screen.getByText("buttons.graphiqlClient");

    expect(restButton).toBeInTheDocument();
    expect(graphqlButton).toBeInTheDocument();

    fireEvent.click(restButton);

    await waitFor(() => {
      expect(screen.getByText("GET Page")).toBeInTheDocument();
    });
  });
});
