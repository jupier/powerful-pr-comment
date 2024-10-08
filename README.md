# Powerful pull request comment

[![GitHub Super-Linter](https://github.com/jupier/powerful-pr-comment/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/jupier/powerful-pr-comment/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/jupier/powerful-pr-comment/actions/workflows/check-dist.yml/badge.svg)](https://github.com/jupier/powerful-pr-comment/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/jupier/powerful-pr-comment/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/jupier/powerful-pr-comment/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

## Summary

Powerful Pull Request Comment is
[a GitHub Action](https://github.com/features/actions) that allows you to easily
create/update pull request comments. It provides useful features such as:

- **creating sticky comments**: a comment that is created only the first time
  and then then updated for the next runs
- **creating comments with updatable sections**
- ... more to come (appending content instead of replacing, deleting a
  comment...)

## Usage

### Prerequisites

You need to add this permission

```yaml
permissions:
  pull-requests: write
```

### Create and update a pr comment

```yaml
- uses: jupier/powerful-pr-comment@v0.0.5
  id: comment-created
  with:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    body: |
      # The content of this comment will be overwritten

# ...

- uses: jupier/powerful-pr-comment@v0.0.5
  with:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    commentId: ${{steps.test-action.outputs.commentId}}
    body: |
      # Hello world
      **Text in bold**
```

### Create/update a sticky comment

```yaml
- uses: jupier/powerful-pr-comment@v0.0.5
  with:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    sticky: true
    body: |
      # This comment is sticky
      This means it's created the first time 
      and then updated for the subsequent runs.
```

### Create and update a comment with sections

```yaml
- uses: jupier/powerful-pr-comment@v0.0.5
  with:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    sticky: true
    body: |
      I'm a comment containing multiple sections.
      Each section can be updated separately.
      # First section
      <!-- POWERFUL PR SECTION START: firstSection -->
      This content will be updated...
      <!-- POWERFUL PR SECTION END: firstSection -->
      # Second section
      <!-- POWERFUL PR SECTION START: secondSection -->
      This content can be updated...
      <!-- POWERFUL PR SECTION END: secondSection -->

# ...

- uses: jupier/powerful-pr-comment@v0.0.5
  with:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    section: firstSection
    sticky: true
    body: |
      The content of the first section has been updated
      **Well done 🤗**
```

### Other examples

Find more examples in our [CI workflow](./.github/workflows/ci.yml)

## Setup

Action created using
[typescript-action](https://github.com/actions/typescript-action).

After you've cloned the repository to your local machine or codespace, you'll
need to perform some initial setup steps before you can develop your action.

> [!NOTE]
>
> You'll need to have a reasonably modern version of
> [Node.js](https://nodejs.org) handy (20.x or later should work!). If you are
> using a version manager like [`nodenv`](https://github.com/nodenv/nodenv) or
> [`nvm`](https://github.com/nvm-sh/nvm), this template has a `.node-version`
> file at the root of the repository that will be used to automatically switch
> to the correct version when you `cd` into the repository. Additionally, this
> `.node-version` file is used by GitHub Actions in any `actions/setup-node`
> actions.

1. :hammer_and_wrench: Install the dependencies

   ```bash
   npm install
   ```

1. :building_construction: Package the TypeScript for distribution

   ```bash
   npm run bundle
   ```

1. :white_check_mark: Run the tests

   ```bash
   $ npm test

   PASS  ./index.test.js
     ✓ throws invalid number (3ms)
     ✓ wait 500 ms (504ms)
     ✓ test runs (95ms)

   ...
   ```

## Publishing a New Release

This project includes a helper script, [`script/release`](./script/release)
designed to streamline the process of tagging and pushing new releases for
GitHub Actions.

GitHub Actions allows users to select a specific version of the action to use,
based on release tags. This script simplifies this process by performing the
following steps:

1. **Retrieving the latest release tag:** The script starts by fetching the most
   recent release tag by looking at the local data available in your repository.
1. **Prompting for a new release tag:** The user is then prompted to enter a new
   release tag. To assist with this, the script displays the latest release tag
   and provides a regular expression to validate the format of the new tag.
1. **Tagging the new release:** Once a valid new tag is entered, the script tags
   the new release.
1. **Pushing the new tag to the remote:** Finally, the script pushes the new tag
   to the remote repository. From here, you will need to create a new release in
   GitHub and users can easily reference the new tag in their workflows.
