import "@testing-library/jest-dom";

jest.useFakeTimers();

jest.mock("next/image", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: (props: any) =>
      React.createElement("img", {
        ...props,
        src:
          typeof props.src === "string"
            ? props.src
            : props?.src?.src ?? "",
      }),
  };
});
