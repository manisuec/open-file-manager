import React from "react";

import { OFMProps } from "./OFM.types";

import "./ofm.scss";

const OFMLayout: React.FC<OFMProps> = ({ heading, content }) => (
  <div data-testid="test-component" className="test-component">
    <h1 data-testid="test-component__heading" className="heading">
      {heading}
    </h1>
    <div data-testid="test-component__content">{content}</div>
  </div>
);

export default OFMLayout;
