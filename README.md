# Deno Publish Version
Set publish version from github tag


# Example

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

      - name: Set up Deno
        uses: denoland/setup-deno@v1
        with:
          deno-version: v1.x

      - name: Set version # Get release tag and update in deno.jsonc
        uses: maks11060/deno-publish-version@1

      - name: Publish to JSR
        run: deno publish --allow-dirty
```
