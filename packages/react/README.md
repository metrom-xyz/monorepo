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

Once installed, set up the Wagmi and TanStack configuration, then wrap your
React app with the required context providers by following the official
[wagmi documentation](https://wagmi.sh/react/getting-started#manual-installation).

Before using the hooks, instantiate the `MetromApiClient` and pass it to them:

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

Once the setup is done, the hooks can be used in any React component, just
import the desired Metrom api client (development or production):

```tsx
import {
  metromDevelopmentApiClient,
  metromProductionApiClient,
} from "@metrom-xyz/react";
```

and then use the hook, for example:

```tsx
import { metromDevelopmentApiClient } from "@metrom-xyz/react";

function MyReactComponent() {
  const { claims, loading } = useClaims({
    apiClient: metromDevelopmentApiClient,
    address: "...",
  });

  if (loading) return <div>loading claims...</div>;

  return <div>...</div>;
}
```
