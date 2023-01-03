import React from "react";
import OFMLayout from "./OFMLayout";

export default {
  title: "Open File Manager"
};

const Content = () => {
  return (
    <span>
      {'forked from '}
      <a href="https://github.com/HarveyD/react-component-library" target="_blank" className="link">
        {'https://github.com/HarveyD/react-component-library'}
      </a>
    </span>
  )
}

export const WithText = () => (
  <OFMLayout
    heading="I am a test component"
    content={<Content />}
  />
);

export const WithButtons = () => (
  <OFMLayout
    heading="I have a button"
    content={
      <div>
        <button onClick={() => alert("You clicked me!")}>Click me</button>
      </div>
    }
  />
);
