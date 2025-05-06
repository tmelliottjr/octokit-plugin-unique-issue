import { Octokit } from "@octokit/core";
import {
  CreateOrUpdateUniqueIssueOptionsT,
  CreateOrUpdateUniqueIssueResponseT,
} from "./types";

const OCTOKIT_UNIQUE_ISSUE_ID_PREFIX = "octokit-unique-issue id=";

export async function composeCreateOrUpdateUniqueIssue(
  octokit: Octokit,
  options: CreateOrUpdateUniqueIssueOptionsT,
): Promise<CreateOrUpdateUniqueIssueResponseT> {
  const {
    owner,
    repo,
    identifier,
    close_previous = false,
    body,
    ...rest
  } = options;

  if (!identifier) {
    throw Object.assign(new Error("identifier is required."), {
      name: "MissingIdentifierError",
    });
  }

  const term = `${OCTOKIT_UNIQUE_ISSUE_ID_PREFIX}"${identifier}"`;

  // MDAST compatible comment marker; see https://github.com/syntax-tree/mdast-comment-marker
  const commentMarker = `<!-- ${term} -->`;

  const {
    data: { items, total_count },
  } = await octokit.request("GET /search/issues", {
    q: `"${term}" is:issue is:open repo:${owner}/${repo}`,
  });

  if (total_count === 1 && !close_previous) {
    const response = await octokit.request(
      "PATCH /repos/{owner}/{repo}/issues/{issue_number}",
      {
        owner,
        repo,
        issue_number: items[0].number,
        ...(body !== undefined ? { body: body + `\n\n${commentMarker}` } : {}),
        ...rest,
      },
    );

    return {
      ...response,
      updated: true,
      closed_issues: [],
    };
  }

  if (total_count > 1 && !close_previous) {
    throw Object.assign(
      new Error("More than 1 issue was found with identifier."),
      {
        identifier,
        issue_numbers: items.map((item) => item.number).join(),
        name: "DuplicateIssueError",
      },
    );
  }

  for (const item of items) {
    await octokit.request("PATCH /repos/{owner}/{repo}/issues/{issue_number}", {
      owner,
      repo,
      issue_number: item.number,
      state: "closed",
    });
  }

  const response = await octokit.request("POST /repos/{owner}/{repo}/issues", {
    owner,
    repo,
    body: body !== undefined ? body + `\n\n${commentMarker}` : commentMarker,
    ...rest,
  });

  return {
    ...response,
    updated: false,
    closed_issues: items.map((item) => item),
  };
}
