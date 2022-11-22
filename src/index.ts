import { Octokit } from "@octokit/core";
import { VERSION } from "./version";
import { Endpoints } from "@octokit/types";

const OCTOKIT_UNIQUE_ISSUE_ID_PREFIX = "octokit-unique-issue id=";

type CreateOrUpdateUniqueIssueOptionsT =
  Endpoints["POST /repos/{owner}/{repo}/issues"]["parameters"] & {
    identifier: string;
    update_previous?: boolean;
  };

type CreateOrUpdateUniqueIssueResponseT =
  | Endpoints["POST /repos/{owner}/{repo}/issues"]["response"]
  | Endpoints["PATCH /repos/{owner}/{repo}/issues/{issue_number}"]["response"];

export function uniqueIssue(octokit: Octokit) {
  return {
    async createOrUpdateUniqueIssue(
      options: CreateOrUpdateUniqueIssueOptionsT
    ): Promise<CreateOrUpdateUniqueIssueResponseT> {
      const {
        owner,
        repo,
        identifier,
        update_previous = true,
        body,
        ...rest
      } = options;

      if (!identifier) {
        throw Object.assign(new Error("identifier is required."), {
          name: "MissingIdentifierError",
        });
      }

      const term = OCTOKIT_UNIQUE_ISSUE_ID_PREFIX + identifier;

      // MDAST compatible comment marker; see https://github.com/syntax-tree/mdast-comment-marker
      const commentMarker = `<!-- ${term} -->`;

      const {
        data: { items, total_count },
      } = await octokit.request("GET /search/issues", {
        q: `"${term}" is:issue is:open repo:${owner}/${repo}`,
      });

      if (total_count === 1 && update_previous) {
        return await octokit.request(
          "PATCH /repos/{owner}/{repo}/issues/{issue_number}",
          {
            owner,
            repo,
            issue_number: items[0].number,
            ...(body !== undefined
              ? { body: body + `\n${commentMarker}` }
              : {}),
            ...rest,
          }
        );
      }

      if (total_count > 1 && update_previous) {
        throw Object.assign(
          new Error("More than 1 issue was found with identifier."),
          {
            identifier,
            issue_numbers: items.map((item) => item.number).join(),
            name: "DuplicateIssueError",
          }
        );
      }

      for (const item of items) {
        await octokit.request(
          "PATCH /repos/{owner}/{repo}/issues/{issue_number}",
          {
            owner,
            repo,
            issue_number: item.number,
            state: "closed",
          }
        );
      }

      return await octokit.request("POST /repos/{owner}/{repo}/issues", {
        owner,
        repo,
        ...(body !== undefined ? { body: body + `\n${commentMarker}` } : {}),
        ...rest,
      });
    },
  };
}
uniqueIssue.VERSION = VERSION;
