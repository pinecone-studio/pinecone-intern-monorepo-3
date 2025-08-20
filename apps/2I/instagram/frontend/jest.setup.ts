import "@testing-library/jest-dom";


jest.mock("next/navigation", () =>
  require("./src/test/mocks/nextNavigation.mock")
);
