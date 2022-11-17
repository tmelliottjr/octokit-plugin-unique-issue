import { Octokit } from "@octokit/core";
import { VERSION } from "./version";
import { Endpoints } from "@octokit/types";

const OCTOKIT_UNIQUE_ISSUE_ID_PREFIX = "OCTOKIT_UNIQUE_ISSUE_ID:";

type CreateOrUpdateUniqueIssueOptionsT =
  Endpoints["POST /repos/{owner}/{repo}/issues"]["parameters"] & {
    identifier: string;
    update_previous?: boolean;
  };

type CreateOrUpdateUniqueIssueResponseT =
  | Endpoints["POST /repos/{owner}/{repo}/issues"]["response"]
  | Endpoints["PATCH /repos/{owner}/{repo}/issues/{issue_number}"]["response"];

/**
 * @param octokit Octokit instance
 * @param options Options passed to Octokit constructor
 */
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

      const term = OCTOKIT_UNIQUE_ISSUE_ID_PREFIX + identifier;

      const commentMarker = `<!-- ${term} -->`;

      const {
        data: { items, total_count },
      } = await octokit.request("GET /search/issues", {
        q: `${term} is:issue is:open repo:${owner}/${repo}`,
      });

      // If close_previous is set, close any existing issues found with unique key
      if (total_count !== 0 && !update_previous) {
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
      }

      // If one and only one issue was found, update!
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

      // If more than one issue was found, throw!
      if (total_count > 1) {
        throw Object.assign(
          new Error("More than 1 issue was found with identifier."),
          {
            identifier,
            issue_numbers: items.map((item) => item.number).join(),
            name: "DuplicateUniqueIssueError",
          }
        );
      }

      // Create
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
