import { Octokit } from "@octokit/core";

import { uniqueIssue, composeCreateOrUpdateUniqueIssue } from "../src";

describe("Smoke test", () => {
  it("{ uniqueIssue } export is a function", () => {
    expect(uniqueIssue).toBeInstanceOf(Function);
  });

  it("uniqueIssue.VERSION is set", () => {
    expect(uniqueIssue.VERSION).toEqual("0.0.0-development");
  });

  it("Loads plugin", () => {
    expect(() => {
      const TestOctokit = Octokit.plugin(uniqueIssue);
      new TestOctokit();
    }).not.toThrow();
  });

  it("[createOrUpdateUniqueIssue] is a function", () => {
    const TestOctokit = Octokit.plugin(uniqueIssue);
    const testOctokit = new TestOctokit();

    expect(testOctokit.createOrUpdateUniqueIssue).toBeInstanceOf(Function);
  });

  it("{ composeCreateOrUpdateUniqueIssue } export is a function", () => {
    expect(composeCreateOrUpdateUniqueIssue).toBeInstanceOf(Function);
  });
});
