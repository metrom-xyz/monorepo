# Contributing

This document provides detailed instructions on contributing to the Metrom
frontend, which is built with Next.js and uses `npm` as the package manager.

## Getting started

To begin, install the package dependencies using `npm`. Run the following
command from the root of the project:

```
npm install
```

### Building the packages

The frontend depends on internal packages (`sdk`, `ui`), so ensure they are
built by running:

```
npm build
```

### Setting up environment variables

After installing dependencies, configure the necessary environment variables to
run the application locally. To do this, create a new `.env` file and copy the
contents of `.env.example`.

### Environment variables

| Name                                   | Description                                            | Required | Default |
| -------------------------------------- | ------------------------------------------------------ | -------- | ------- |
| `NEXT_PUBLIC_ENVIRONMENT`              | Metrom environment (`development` or `production`)     | ✅       | `-`     |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect project ID                               | ✅       | `-`     |
| `NEXT_PUBLIC_SAFE`                     | Whether to build the app as a Safe App                 | ❌       | `false` |
| `NEXT_PUBLIC_FATHOM_SITE_ID`           | [Fathom](https://usefathom.com/) site id for analytics | ❌       | `-`     |
| `NEXT_PUBLIC_APTOS`                    | Whether to build the app with Aptos support            | ❌       | `false` |
| `NEXT_PUBLIC_APTOS_CLIENT_API_KEY`     | API key to query Aptos indexer                         | ❌       | `-`     |

## Running the development server

Once the environment variables are set up, start the development server:

```
npm dev
```
