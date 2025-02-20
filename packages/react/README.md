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
    <MetromProvider environment={Environment.Development}>
      {/** ... */}
    </MetromProvider>
  );
}
```

> Omitting the environment will default to `development`.

## Usage

Once the setup is done, the hooks can be used in any React component:

```tsx
import { useClaims } from "@metrom-xyz/react";

function Component() {
  const { claims, loading } = useClaims({ address: "..." });

  if (loading) return <div>loading claims...</div>;

  return <div>...</div>;
}
```

## Hooks

### useClaims

Hook for fetching the active claims (still with rewards to claim) for an
account.

#### Import

```tsx
import { useClaims } from "@metrom-xyz/react";
```

#### Usage

```tsx
import { useAccount } from "wagmi";
import { useClaims } from "@metrom-xyz/react";

function App() {
  const { address } = useAccount();
  const result = useClaims({ address });
}
```

### useClaimsTransaction

Hook for simulating/validating the contract interaction in order to claim the
rewards for an account on a given chain; it returns the simulation result that
can be used to submit the transaction.

#### Import

```tsx
import { useClaimsTransaction } from "@metrom-xyz/react";
```

#### Usage

```tsx
import { useAccount, useChainId, useWriteContract } from "wagmi";
import { useClaimsTransaction } from "@metrom-xyz/react";

function App() {
  const { address } = useAccount();
  const chainId = useChainId();
  const { writeContractAsync } = useWriteContract();

  const { loading: loadingClaims, claims } = useClaims({ address });
  const {
    loading: simulatingClaims,
    error,
    transaction,
  } = useClaimsTransaction({
    chainId,
    claims,
    address,
  });

  function claimRewards() {
    if (loadingClaims || simulatingClaims || error || !transaction) return;

    const submitTx = async () => {
      const tx = await writeContractAsync(transaction.request);
    };

    void submitTx();
  }

  return (
    <div>
      <button onClick={claimRewards}>claim</button>
    </div>
  );
}
```
