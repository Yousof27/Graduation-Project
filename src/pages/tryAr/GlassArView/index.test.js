import { render } from "@testing-library/react";
import React from "react";
import GlassArView from ".";

describe("ThreedView", () => {
  let props;
  
  beforeEach(() => {
    props = {
      modelname: 'rayban_aviator_or_vertFlash',
      canvaswidth: 700,
      canvasheight: 700,
      buttonFontColor: 'white',
      buttonBackgroundColor: '#FFE5B4'
    };
  });

  describe("ThreedView Button Render", () => {
    it("Add a Button", () => {
      const { container } = render(<GlassArView {...props} />);
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.firstChild).toMatchInlineSnapshot();
    });
  });
});
