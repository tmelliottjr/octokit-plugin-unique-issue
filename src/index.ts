import { Octokit } from "@octokit/core";
import {
  CreateOrUpdateUniqueIssueOptionsT,
  CreateOrUpdateUniqueIssueResponseT,
} from "./types";
import { VERSION } from "./version";
import { composeCreateOrUpdateUniqueIssue } from "./compose-unique-issue";

export { composeCreateOrUpdateUniqueIssue } from "./compose-unique-issue";

export function uniqueIssue(octokit: Octokit) {
  return {
    async createOrUpdateUniqueIssue(
      options: CreateOrUpdateUniqueIssueOptionsT,
    ): Promise<CreateOrUpdateUniqueIssueResponseT> {
      return composeCreateOrUpdateUniqueIssue(octokit, options);
    },
  };
}
uniqueIssue.VERSION = VERSION;
