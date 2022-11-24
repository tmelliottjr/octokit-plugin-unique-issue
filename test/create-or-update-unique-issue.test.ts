import * as fetchMock from "fetch-mock";
import { Octokit } from "@octokit/core";
import { escape } from "querystring";

import { uniqueIssue } from "../src";

const MyOctokit = Octokit.plugin(uniqueIssue).defaults({
  userAgent: "test",
});

describe("createOrUpdateUniqueIssue", () => {
  it("should create an issue if no existing issues are found", async () => {
    const searchQueryPart = escape(
      '"octokit-unique-issue id=identifier" is:issue is:open repo:owner/repo'
    );

    const mock = fetchMock
      .sandbox()
      .getOnce(`https://api.github.com/search/issues?q=${searchQueryPart}`, {
        status: 200,
        body: {
          total_count: 0,
          items: [],
        },
      })
      .postOnce("https://api.github.com/repos/owner/repo/issues", {
        status: 201,
        body: {
          id: 1,
        },
      });

    const octokit = new MyOctokit({
      request: {
        fetch: mock,
      },
    });

    const { data } = await octokit.createOrUpdateUniqueIssue({
      owner: "owner",
      repo: "repo",
      title: "title",
      body: "body",
      identifier: "identifier",
    });

    expect(data).toStrictEqual({ id: 1 });
  });

  it.todo(
    "should create an issue when existing issues are found and `update_previous` is false"
  );

  it.todo("should close existing issues when `update_previous` is false");

  it.todo(
    "should throw when existing issues are found and `update_previous` is true"
  );

  it.todo(
    "should update an existing issue if one is found and `update_previous` is true"
  );

  it.todo("should throw when `identifier` is not provided");
});
