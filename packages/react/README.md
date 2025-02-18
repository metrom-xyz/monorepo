# Metrom React

Collection of React hooks a for seamless and efficient integration with Metrom.

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

Once installed setup the wagmi and tanstack configuration and wrap your React
app with the context providers by following the official
[wagmi documentation](https://wagmi.sh/react/getting-started#manual-installation).

One last thing to do before using the hooks is to instantiate the
`MetromApiClient` that will be passed to the hooks:

```tsx
import { MetromApiClient } from "@metrom-xyz/react";

const metromApiClient = new MetromApiClient("base_url");
```

The `base_url` can be obtained from the `SERVICE_URLS` mapping:

```tsx
import { MetromApiClient, SERVICE_URLS } from "@metrom-xyz/react";

const metromApiClient = new MetromApiClient(
  SERVICE_URLS["development|production"].metrom,
);
```

## Usage

Once the setup is done, the hooks can be used in any React component, for
example:

```tsx
import { metromApiClient } from ".";

function MyReactComponent() {
  const { claims, loading } = useClaims({
    apiClient: metromApiClient,
    address: "...",
  });

  if (loading) return <div>loading claims...</div>;

  return <div>...</div>;
}
```
