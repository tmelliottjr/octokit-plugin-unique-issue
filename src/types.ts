import { Endpoints } from "@octokit/types";

type CreatedIssueResponseT =
  Endpoints["POST /repos/{owner}/{repo}/issues"]["response"] & {
    updated: false;
    closed_issues: Endpoints["GET /search/issues"]["response"]["data"]["items"];
  };
type UpdatedIssueResponseT =
  Endpoints["PATCH /repos/{owner}/{repo}/issues/{issue_number}"]["response"] & {
    updated: true;
    closed_issues: [...[]];
  };

export type CreateOrUpdateUniqueIssueOptionsT =
  Endpoints["POST /repos/{owner}/{repo}/issues"]["parameters"] & {
    identifier: string;
    close_previous?: boolean;
  };

export type CreateOrUpdateUniqueIssueResponseT =
  | CreatedIssueResponseT
  | UpdatedIssueResponseT;
