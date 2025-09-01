import "@testing-library/jest-dom";
import { server } from "./tests/server";
import { afterAll, afterEach, beforeAll, vi } from "vitest";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => server.close());

//global variables
global.usersData = [];

// mock global functions
global.confirm = vi.fn(() => true);
global.alert = vi.fn();

// mock settimeout to execute immediately
// global.setTimeout = vi.fn((fn) => fn());

// global test utilities
// global.mockFetch = (data, ok = true) => {
//   return vi.fn.mockImplementation(() =>
//     Promise.resolve({
//       ok,
//       json: () => Promise.resolve(data),
//     })
//   );
// };
