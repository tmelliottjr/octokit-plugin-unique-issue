import { Octokit } from "@octokit/core";
import {
  CreateOrUpdateUniqueIssueOptionsT,
  CreateOrUpdateUniqueIssueResponseT,
} from "./types";
import { VERSION } from "./version";
import { composeUniqueIssue } from "./compose-unique-issue";

export { composeUniqueIssue } from "./compose-unique-issue";

export function uniqueIssue(octokit: Octokit) {
  return {
    async createOrUpdateUniqueIssue(
      options: CreateOrUpdateUniqueIssueOptionsT,
    ): Promise<CreateOrUpdateUniqueIssueResponseT> {
      return composeUniqueIssue(octokit, options);
    },
  };
}
uniqueIssue.VERSION = VERSION;
