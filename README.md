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

Create a unique issue based on the provided `identifier`. When an issue with the same identifier already exists an error will be thrown. Setting `close_previous` will result in the previous issue being closed, before creating a new one.

`createOrUpdateUniqueIssue` accepts all supported parameters for creating an issue with the [GitHub REST API](https://docs.github.com/en/rest/issues/issues#create-an-issue).

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
        <strong>Optional.</strong> Defaults to <code>false</code>. Close existing issue(s) with <code>identifier</code>
      </td>
    </tr>
  </tbody>
</table>
  
## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

[MIT](LICENSE)
