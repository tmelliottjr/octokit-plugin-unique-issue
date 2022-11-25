import * as fetchMock from "fetch-mock";
import { Octokit } from "@octokit/core";
import { escape } from "querystring";

import { uniqueIssue } from "../src";

const MyOctokit = Octokit.plugin(uniqueIssue).defaults({
  userAgent: "test",
});

const SEARCH_QUERY_PART = escape(
  '"octokit-unique-issue id="identifier"" is:issue is:open repo:owner/repo'
);

describe("createOrUpdateUniqueIssue", () => {
  it("should create an issue if no existing issues are found", async () => {
    const mock = fetchMock
      .sandbox()
      .getOnce(`https://api.github.com/search/issues?q=${SEARCH_QUERY_PART}`, {
        status: 200,
        body: {
          total_count: 0,
          items: [],
        },
      })
      .postOnce(
        "https://api.github.com/repos/owner/repo/issues",
        {
          status: 201,
          body: {
            id: 1,
          },
        },
        {
          body: {
            title: "title",
            body: 'body\n\n<!-- octokit-unique-issue id="identifier" -->',
          },
        }
      );

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

  it("should create an issue when no body is provided", async () => {
    const mock = fetchMock
      .sandbox()
      .getOnce(`https://api.github.com/search/issues?q=${SEARCH_QUERY_PART}`, {
        status: 200,
        body: {
          total_count: 0,
          items: [],
        },
      })
      .postOnce(
        "https://api.github.com/repos/owner/repo/issues",
        {
          status: 201,
          body: {
            id: 1,
          },
        },
        {
          body: {
            title: "title",
            body: '<!-- octokit-unique-issue id="identifier" -->',
          },
        }
      );

    const octokit = new MyOctokit({
      request: {
        fetch: mock,
      },
    });

    const { data } = await octokit.createOrUpdateUniqueIssue({
      owner: "owner",
      repo: "repo",
      title: "title",
      identifier: "identifier",
    });

    expect(data).toStrictEqual({ id: 1 });
  });

  it("should create an issue when existing issues are found and `close_previous` is true", async () => {
    const mock = fetchMock
      .sandbox()
      .getOnce(`https://api.github.com/search/issues?q=${SEARCH_QUERY_PART}`, {
        status: 200,
        body: {
          total_count: 1,
          items: [
            {
              number: 123,
            },
          ],
        },
      })
      .patchOnce(
        "https://api.github.com/repos/owner/repo/issues/123",
        {
          status: 200,
        },
        {
          body: { state: "closed" },
        }
      )
      .postOnce(
        "https://api.github.com/repos/owner/repo/issues",
        {
          status: 201,
          body: {
            id: 1,
          },
        },
        {
          body: {
            title: "title",
            body: 'body\n\n<!-- octokit-unique-issue id="identifier" -->',
          },
        }
      );

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
      close_previous: true,
    });

    expect(data).toStrictEqual({ id: 1 });
  });

  it("should throw when multiple existing issues are found and `close_previous` is false", async () => {
    const mock = fetchMock
      .sandbox()
      .getOnce(`https://api.github.com/search/issues?q=${SEARCH_QUERY_PART}`, {
        status: 200,
        body: {
          total_count: 2,
          items: [
            {
              number: 123,
            },
            {
              number: 456,
            },
          ],
        },
      });

    const octokit = new MyOctokit({
      request: {
        fetch: mock,
      },
    });

    expect(async () => {
      await octokit.createOrUpdateUniqueIssue({
        owner: "owner",
        repo: "repo",
        title: "title",
        body: "body",
        identifier: "identifier",
      });
    }).rejects.toThrow("More than 1 issue was found with identifier.");
  });

  it("should update an existing issue if one is found and `close_previous` is false", async () => {
    const mock = fetchMock
      .sandbox()
      .getOnce(`https://api.github.com/search/issues?q=${SEARCH_QUERY_PART}`, {
        status: 200,
        body: {
          total_count: 1,
          items: [
            {
              number: 123,
            },
          ],
        },
      })
      .patchOnce(
        "https://api.github.com/repos/owner/repo/issues/123",
        {
          status: 200,
          body: {
            id: 1,
          },
        },
        {
          body: {
            title: "title",
            body: 'body\n\n<!-- octokit-unique-issue id="identifier" -->',
          },
        }
      );

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

  it("should update an existing issue when no body is provided", async () => {
    const mock = fetchMock
      .sandbox()
      .getOnce(`https://api.github.com/search/issues?q=${SEARCH_QUERY_PART}`, {
        status: 200,
        body: {
          total_count: 1,
          items: [
            {
              number: 123,
            },
          ],
        },
      })
      .patchOnce(
        "https://api.github.com/repos/owner/repo/issues/123",
        {
          status: 200,
          body: {
            id: 1,
          },
        },
        {
          body: {
            title: "title",
          },
        }
      );

    const octokit = new MyOctokit({
      request: {
        fetch: mock,
      },
    });

    const { data } = await octokit.createOrUpdateUniqueIssue({
      owner: "owner",
      repo: "repo",
      title: "title",
      identifier: "identifier",
    });

    expect(data).toStrictEqual({ id: 1 });
  });

  it("should throw when `identifier` is not provided", async () => {
    const octokit = new MyOctokit({});

    expect(async () => {
      await octokit.createOrUpdateUniqueIssue({
        owner: "owner",
        repo: "repo",
        title: "title",
        body: "body",
        identifier: "",
      });
    }).rejects.toThrow("identifier is required.");
  });
});
