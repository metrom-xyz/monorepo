# Metrom React

Collection of React hooks for a seamless and efficient integration with Metrom.

## Installation

The hooks rely on [wagmi](https://wagmi.sh/react/installation#installation)
under the hood, so a few required packages must be installed, alongside
`@metrom-xyz/react`:

```bash
pnpm add @metrom-xyz/react wagmi viem @tanstack/react-query
# or
yarn add @metrom-xyz/react wagmi viem @tanstack/react-query
# or
npm add @metrom-xyz/react wagmi viem @tanstack/react-query
```

## Setup

A couple configuration steps are required before being able to use the Metrom
hooks.

### External dependencies

Once installed, set up the Wagmi and TanStack configuration, then wrap your
React app with the required context providers by following the official
[wagmi documentation](https://wagmi.sh/react/getting-started#manual-installation).

### Wrap app in context provider

Wrap your app with the `MetromProvider` React Context Provider and pass the
environment you wish to target the `environment` property.

The `Environment` is exported by the library.

```tsx
import { Environment, MetromProvider } from "@metrom-xyz/react";

function App() {
  return (
    <MetromProvider environment={Environment.Development}>...</MetromProvider>
  );
}
```

> Omitting the environment will default to `development`.

## Usage

Once the setup is done, the hooks can be used in any React component:

```tsx
import { useClaims } from "@metrom-xyz/react";

function Component() {
  const { data, isLoading } = useClaims({ address: "..." });

  if (isLoading) return <div>loading claims...</div>;

  return <div>...</div>;
}
```
