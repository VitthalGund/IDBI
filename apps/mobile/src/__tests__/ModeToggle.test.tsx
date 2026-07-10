import React from "react";

jest.mock("@trustbank/ui-kit", () => ({
  ModeToggle: jest.fn(() => null),
}));

import { ModeToggle } from "@trustbank/ui-kit";

describe("ModeToggle Component", () => {
  it("mock is defined", () => {
    expect(ModeToggle).toBeDefined();
  });
});
