# Metrom SDK

An SDK for building applications on top of Metrom.

## Installation

The SDK needs [viem](https://viem.sh/docs/installation) under the hood, so it
must be installed alongside `@metrom-xyz/sdk`:

```bash
npm add @metrom-xyz/sdk viem
# or
yarn add @metrom-xyz/sdk viem
# or
npm add @metrom-xyz/sdk viem
```

## Usage

The SDK package exports an API client that can be used anywhere in the
application:

```ts
import { MetromApiClient } from "@metrom-xyz/sdk";

await metromClient.fetchCampaignDetails({...});
```
