import "jest-styled-components";
import React, { useRef } from "react";
import Layout from "..";
import { renderWithRouter, wait, testState } from "test-utils";
import { Router } from "@reach/router";

function StubRoute() {
  return <div>navigated</div>;
}
function LayoutWrapper() {
  const ref = useRef();
  return (
    <Router>
      <StubRoute path="/" />
      <Layout path="/layout" default headerRef={ref} />
    </Router>
  );
}
function setup(stateOverrides = {}) {
  return renderWithRouter(<LayoutWrapper />, {
    route: "/layout",
    state: { ...testState, ...stateOverrides }
  });
}

beforeEach(() => {
  window.SVGElement.prototype.getBBox = () => ({
    x: 0,
    y: 0
    // whatever other props you need
  });
});

afterEach(() => {
  delete window.SVGElement.prototype.getBBox;
});

test("renders", async () => {
  let utils;
  await wait(async () => {
    utils = setup();
  });
  expect(utils.container).toMatchSnapshot();
});
