# Deno Publish Version
Changes the version in **deno.json[c]** or **package.json** before publishing

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

      - name: Set version # Get release tag and update in deno.jsonc
        uses: maks11060/deno-publish-version@2
        with:
          config-file: deno.jsonc # or deno.json

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

      - name: Set version # Get the version from the tag and update to 'deno.json[c]'
        uses: maks11060/deno-publish-version@2
        with:
          config-file: deno.jsonc # or deno.json
          tag: ${{ github.ref_name }}

      - name: Publish to JSR
        run: deno publish --allow-dirty
```
