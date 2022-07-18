import React from "react";
import TestComponent from "./TestComponent";

export default {
  title: "TestComponent"
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
  <TestComponent
    heading="I am a test component"
    content={<Content />}
  />
);

export const WithButtons = () => (
  <TestComponent
    heading="I have a button"
    content={
      <div>
        <button onClick={() => alert("You clicked me!")}>Click me</button>
      </div>
    }
  />
);
