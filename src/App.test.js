import { render, screen } from "@testing-library/react";
import App from "./App";

// Polyfill ResizeObserver for test environment
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

test("renders flow controls", () => {
  render(<App />);
  const addSourceButton = screen.getByText(/Add source/i);
  expect(addSourceButton).toBeInTheDocument();
});
