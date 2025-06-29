import { render, fireEvent } from "@testing-library/react";
import React from "react";
import ControlButton from ".";

describe("ThreedView", () => {
  let props;

  beforeEach(() => {
    props = {
      backgroundColor: "red",
      color: "blue",
      onClick: jest.fn(),
      className: "test",
      children: "test",
    };
  });

  describe("ThreedView Button Render", () => {
    it("Add a Button", () => {
      const { container } = render(<ControlButton {...props} />);
      expect(container.querySelector(".JeelizVTOWidgetButton")).toBeTruthy();
    });
  });

  describe("ThreedView Button Call", () => {
    it("Call Button", () => {
      const { container } = render(<ControlButton {...props} />);
      const button = container.querySelector(".JeelizVTOWidgetButton");
      fireEvent.click(button);
      expect(props.onClick).toHaveBeenCalled();
    });
  });

  describe("ThreedView Button Click", () => {
    it("Click Button", () => {
      const { container } = render(<ControlButton {...props} />);
      const button = container.querySelector(".JeelizVTOWidgetButton");
      fireEvent.click(button);
      expect(props.onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("ThreedView Button Snap", () => {
    it("Snap Button", () => {
      const { container } = render(<ControlButton {...props} />);
      expect(container.firstChild).toMatchInlineSnapshot(`
        <button
          class="JeelizVTOWidgetButton test"
          style="background-color: red; color: blue;"
        >
          test
        </button>
      `);
    });

    it("Snap Button props change", () => {
      props.backgroundColor = "black";
      props.color = "white";
      props.className = "checkClass";
      props.children = "model btn";

      const { container } = render(<ControlButton {...props} />);
      expect(container.firstChild).toMatchInlineSnapshot(`
        <button
          class="JeelizVTOWidgetButton checkClass"
          style="background-color: black; color: white;"
        >
          model btn
        </button>
      `);
    });
  });
});
