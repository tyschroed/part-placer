import "jest-styled-components";
import React from "react";
import EditMaterial from "../EditMaterial";
import {render, fireEvent, wait} from '../../../../../test/utils';

const setup = () => {

  const onEditCompleteMock = jest.fn();
  const utils = render(<EditMaterial onEditComplete={onEditCompleteMock} />);
  return {
    ...utils,
    onEditCompleteMock,
    materialName: utils.getByLabelText("Material Name"),
    width: utils.getByLabelText("Width"),
    height: utils.getByLabelText("Height"),
    submitButton: utils.getByTestId("create-material")
  };
};

test("error if form is not valid", async () => {
  const {
    submitButton,
    container,
    width,
    height,
    onEditCompleteMock
  } = setup();
  fireEvent.change(width, { target: { value: "" } });
  fireEvent.change(height, { target: { value: "" } });

  await wait(() => {
    fireEvent.click(submitButton);
  });
  expect(
    container.querySelector("#dimension-dimensions\\.height-helper-text")
      .textContent
  ).toContain("Required");
  expect(
    container.querySelector("#dimension-dimensions\\.width-helper-text")
      .textContent
  ).toContain("Required");
  expect(container.textContent).toContain("Material name is required.");
  expect(onEditCompleteMock).toHaveBeenCalledTimes(0);
});

test("submit if form is valid", async () => {
  const { submitButton, materialName, onEditCompleteMock } = setup();
  fireEvent.change(materialName, { target: { value: "name" } });
  await wait(() => {
    fireEvent.click(submitButton);
  });

  expect(onEditCompleteMock).toHaveBeenCalledTimes(1);
});
