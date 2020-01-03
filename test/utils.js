import React from "react";
import { render as rtlRender } from "@testing-library/react";
import PropTypes from "prop-types";
import { StoreProvider } from "../src/screens/home/components/Store";
import { SnackbarProvider } from "notistack";

function render(ui, options) {
  function Wrapper({ children }) {
    return (
      <SnackbarProvider>
        <StoreProvider>{children}</StoreProvider>
      </SnackbarProvider>
    );
  }
  Wrapper.propTypes = {
    children: PropTypes.node
  };

  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

export * from "@testing-library/react";
export { render };
