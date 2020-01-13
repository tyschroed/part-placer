import React from "react";
import { render as rtlRender } from "@testing-library/react";
import PropTypes from "prop-types";
import { StoreProvider, defaultInitialState } from "../shared/context/Store";
import { SnackbarProvider } from "notistack";
import {
  createHistory,
  createMemorySource,
  LocationProvider
} from "@reach/router";
import { AnalyticsProvider } from "../shared/context/Analytics";

function render(ui, { state, ...options } = {}) {
  function Wrapper({ children }) {
    return (
      <AnalyticsProvider>
        <StoreProvider value={state}>
          <SnackbarProvider>{children}</SnackbarProvider>
        </StoreProvider>
      </AnalyticsProvider>
    );
  }
  Wrapper.propTypes = {
    children: PropTypes.node
  };

  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

export * from "@testing-library/react";
export { render };

export function renderWithRouter(
  ui,
  {
    route = "/",
    history = createHistory(createMemorySource(route)),
    ...options
  } = {}
) {
  return {
    ...render(
      <LocationProvider history={history}>{ui}</LocationProvider>,
      options
    ),
    // adding `history` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    history
  };
}

export const testState = {
  ...defaultInitialState,
  materials: [
    {
      id: 1,
      name: "3/4 Plywood",
      dimensions: { width: "8'", height: "4'" },
      parts: [
        {
          name: "Door",
          quantity: 2,
          id: 1,
          dimensions: { width: "2'", height: "2'" }
        },
        {
          name: "Shelf",
          quantity: 2,
          id: 2,
          dimensions: { width: "3'", height: "3'" }
        }
      ]
    },
    {
      id: 2,
      name: "1/2 Plywood",
      dimensions: { width: "8'", height: "4'" },
      parts: [
        {
          name: "Back Panel",
          quantity: 1,
          id: 1,
          dimensions: { width: "2'", height: "2'" }
        },
        {
          name: "Drawer bottom",
          quantity: 4,
          id: 2,
          dimensions: { width: "17", height: "24" }
        }
      ]
    }
  ]
};
