# n8n Node — Deploy Guide

## Publishing

Publishing is automated via GitHub Actions with npm provenance (required by n8n from May 1, 2026).

### One-Time Setup

1. **Create the npm package** — sign in to [npmjs.com](https://www.npmjs.com), verify the name `n8n-nodes-upvoty` is available.

2. **Create the GitHub repository** — the repo URL in `package.json` must match the GitHub repo the Action runs from. Currently set to `https://github.com/nicklasserra/n8n-nodes-upvoty`.

3. **Copy the package to the separate repo** — since the n8n node lives in a monorepo but publishes from its own repo:
   ```bash
   # From the separate n8n-nodes-upvoty repo
   cp -r /path/to/upvoty/packages/n8n/* .
   cp -r /path/to/upvoty/packages/n8n/.github .
   git add .
   git commit -m "Initial n8n community node"
   git push
   ```

4. **Generate an npm access token**:
   - Go to npmjs.com → Access Tokens → Generate New Token
   - Choose **Granular Access Token**
   - Scope it to the `n8n-nodes-upvoty` package with **Read and Write** permissions
   - Copy the token

5. **Add the token to GitHub**:
   - Go to GitHub repo → Settings → Secrets and variables → Actions
   - Create a new secret named `NPM_TOKEN` with the token value

### Publishing a Release

```bash
# Tag and push — GitHub Actions handles the rest
git tag v0.1.0
git push --tags
```

The workflow builds, lints, and publishes to npm with `--provenance`. Watch progress in the GitHub Actions tab.

### Publishing Manually (not recommended)

```bash
npm run build
npm run lint
npm publish --access public
```

Note: manual publishes lack provenance and won't meet n8n's verification requirements after May 2026.

### Submitting for n8n Verification

After publishing, submit for verification so the node appears in n8n's community directory:

1. Go to the [n8n Creator Hub](https://creators.n8n.io)
2. Sign up and submit the package name `n8n-nodes-upvoty`
3. Provide: GitHub repo URL, description, example workflows, and screenshots
4. n8n runs an automated scan (`@n8n/scan-community-package`) then manual QA review
