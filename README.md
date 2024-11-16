# Deno Publish Version

Change the version of the package before publishing it.

Any **'Package'** files containing the `"version": "0.0.0"` are supported.

- Default files: `deno.jsonc, deno.json, jsr.json, package.json`

# Usage

```yml
- uses: denoland/setup-deno@v2

- uses: maks11060/deno-publish-version@v2
  with:
    # Default: [deno.jsonc|deno.json|jsr.json|package.json]
    config-file:

    # Default: ${{ github.event.release.tag_name }} 'v1.2.3' or '1.2.3'
    tag:
```

# Examples

Publishing after creating a release
```yml
# publish.yml
name: Publish

on:
  release:
    types: [published]

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write # The OIDC ID token is used for authentication with JSR.

    steps:
      - name: Clone repository
        uses: actions/checkout@v4

      - name: Set up Deno 2
        uses: denoland/setup-deno@v2

      - name: Set version # Get the version from the release tag and update in [config].json
        uses: maks11060/deno-publish-version@v2

      - name: Publish to JSR
        run: deno publish --allow-dirty
```

Publishing after tag creation
```yml
# publish.yml
name: Publish

on:
  push:
    tags: 'v*.*.*'

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write # The OIDC ID token is used for authentication with JSR.

    steps:
      - name: Clone repository
        uses: actions/checkout@v4

      - name: Set up Deno 2
        uses: denoland/setup-deno@v2

      - name: Set version # Get the version from tag and update it in [config].json
        uses: maks11060/deno-publish-version@v2
        with:
          tag: ${{ github.ref_name }}

      - name: Publish to JSR
        run: deno publish --allow-dirty
```
