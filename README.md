# octokit-plugin-unique-issue

> Creates and retrieves unique GitHub issues

[![@latest](https://img.shields.io/npm/v/octokit-plugin-unique-issue.svg)](https://www.npmjs.com/package/octokit-plugin-unique-issue)
[![Build Status](https://github.com/tmelliottjr/octokit-plugin-unique-issue/workflows/Test/badge.svg)](https://github.com/tmelliottjr/octokit-plugin-unique-issue/actions?query=workflow%3ATest+branch%3Amain)

## Usage

<table>
<tbody valign=top align=left>
<tr><th>

Browsers

</th><td width=100%>

Load `octokit-plugin-unique-issue` and [`@octokit/core`](https://github.com/octokit/core.js) (or core-compatible module) directly from [cdn.skypack.dev](https://cdn.skypack.dev)

```html
<script type="module">
  import { Octokit } from "https://cdn.skypack.dev/@octokit/core";
  import { uniqueIssue } from "https://cdn.skypack.dev/octokit-plugin-unique-issue";
</script>
```

</td></tr>
<tr><th>

Node

</th><td>

Install with `npm install @octokit/core octokit-plugin-unique-issue`. Optionally replace `@octokit/core` with a compatible module

```js
const { Octokit } = require("@octokit/core");
const { uniqueIssue } = require("octokit-plugin-unique-issue");
```

</td></tr>
</tbody>
</table>

### `createOrUpdateUniqueIssue`

Creates or updates an issue with the provided `identifier`.

By default, when `close_previous` is `false` and a **_single_** issue with the provided identifier is found, that issue will be updated, otherwise a new issue is created. An error will be thrown if more than one issue with the provided identifier is found.

When `close_previous` is `true`, all existing issues with the provided identifier will be closed before creating a new issue.

`createOrUpdateUniqueIssue` accepts all supported parameters for [creating](https://docs.github.com/en/rest/issues/issues#create-an-issue) or [updating](https://docs.github.com/en/rest/issues/issues#update-an-issue) an issue with the GitHub REST API.

### Update Issue

```js
const MyOctokit = Octokit.plugin(uniqueIssue);
const octokit = new MyOctokit({ auth: "secret123" });

const response = await octokit.createOrUpdateUniqueIssue({
  identifier: "super-unique-identifier",
  owner: "tmelliottjr",
  repo: "octokit-plugin-unique-issue",
  title: "My unique issue",
  body: "The body of my unique issue!",
});
```

### Create and Close Previous Issue

```js
const MyOctokit = Octokit.plugin(uniqueIssue);
const octokit = new MyOctokit({ auth: "secret123" });

const response = await octokit.createOrUpdateUniqueIssue({
  identifier: "super-unique-identifier",
  owner: "tmelliottjr",
  repo: "octokit-plugin-unique-issue",
  title: "My unique issue",
  body: "The body of my unique issue!",
  close_previous: true,
});
```

## Options

<table width="100%">
  <thead align=left>
    <tr>
      <th width=150>
        name
      </th>
      <th width=70>
        type
      </th>
      <th>
        description
      </th>
    </tr>
  </thead>
  <tbody align=left valign=top>
    <tr>
      <th>
        <code>identifier</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        <strong>Required.</strong> Unique identifier for the issue.
      </td>
    </tr>
        <tr>
      <th>
        <code>close_previous</code>
      </th>
      <th>
        <code>boolean</code>
      </th>
      <td>
        <strong>Optional.</strong> Defaults to <code>false</code>. Close existing issue(s) with <code>identifier</code>.
      </td>
    </tr>
  </tbody>
</table>

## How it Works

`createOrUpdateUniqueIssue` will add an [MDAST Comment Marker](https://github.com/syntax-tree/mdast-comment-marker) to an issue's body containing the unique identifier provided.

```html
<!-- octokit-unique-issue id="super-unique-identifier" -->
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

[MIT](LICENSE)
