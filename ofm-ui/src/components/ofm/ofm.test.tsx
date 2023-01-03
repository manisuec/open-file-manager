import React from "react";
import { render, within } from "@testing-library/react";

import OFM from "./OFMLayout";
import { OFMProps } from "./OFM.types";

describe("OFM", () => {
  const renderComponent = ({ heading, content }: Partial<OFMProps>) =>
    render(
      <OFM
        heading={heading || "Default heading text"}
        content={content || <div>Default content</div>}
      />
    );

  it("should render heading text correctly", () => {
    const headingText = "Some test heading";

    const { getByTestId } = renderComponent({ heading: headingText });

    const OFM = getByTestId("test-component__heading");

    expect(OFM).toHaveTextContent(headingText);
  });

  it("should render content correctly", () => {
    const { getByTestId } = renderComponent({
      content: <div data-testid="some-test-content">I am test content</div>
    });

    expect(
      within(getByTestId("test-component__content")).queryByTestId(
        "some-test-content"
      )
    ).toBeInTheDocument();
  });
});
