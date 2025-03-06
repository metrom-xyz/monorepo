# Contributing

This document provides detailed instructions on contributing to the Metrom
frontend, which is built with Next.js and uses `pnpm` as the package manager.

## Getting started

To begin, install the package dependencies using `pnpm`. Run the following
command from the root of the project:

```
pnpm install
```

### Building the packages

The frontend depends on internal packages (`sdk`, `ui`), so ensure they are
built by running:

```
pnpm build
```

### Setting up unvironment uariables

After installing dependencies, configure the necessary environment variables to
run the application locally. To do this, create a new `.env` file and copy the
contents of `.env.example`.

### Environment variables

| Name                                   | Description                                        | Required | Default |
| -------------------------------------- | -------------------------------------------------- | -------- | ------- |
| `NEXT_PUBLIC_ENVIRONMENT`              | Metrom environment (`development` or `production`) | ✅       | `-`     |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect project ID                           | ✅       | `-`     |

## Running the development server

Once the environment variables are set up, start the development server:

```
pnpm dev
```
