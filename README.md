# Auth client

The unified connector between Agora clients and the authentication service.

[![X (formerly Twitter) Follow](https://img.shields.io/twitter/follow/agora_ecrivains)](https://twitter.com/agora_ecrivains)
[![Discord](https://img.shields.io/discord/1315240114691248138?logo=discord)](https://discord.gg/rp4Qr8cA)

<hr />

![GitHub repo file or directory count](https://img.shields.io/github/directory-file-count/a-novel/auth-client)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/a-novel/auth-client)

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/a-novel/auth-client/main.yaml)
[![codecov](https://codecov.io/gh/a-novel/auth-client/graph/badge.svg?token=YrqkfkjoF5)](https://codecov.io/gh/a-novel/auth-client)

![Coverage graph](https://codecov.io/gh/a-novel/auth-client/graphs/sunburst.svg?token=YrqkfkjoF5)

## Installation

> ⚠️ **Warning**: Even though the package is public, GitHub registry requires you to have a Personal Access Token
> with `repo` and `read:packages` scopes to pull it in your project. See
> [this issue](https://github.com/orgs/community/discussions/23386#discussioncomment-3240193) for more information.

Create a `.npmrc` file in the root of your project if it doesn't exist, and make sure it contains the following:

```ini
@a-novel:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${YOUR_PERSONAL_ACCESS_TOKEN}
```

Then, install the package using pnpm:

```bash
# react
pnpm add react react-dom
# mui
pnpm add @emotion/react @emotion/styled @mui/material
# other
pnpm add @tanstack/react-query i18next react-i18next
# a-novel
pnpm add @a-novel/neon-ui @a-novel/auth-client
```

> Follow the extra steps to install [@a-novel/neon-ui](https://github.com/a-novel/neon-ui).
