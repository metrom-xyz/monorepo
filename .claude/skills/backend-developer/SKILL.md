---
name: backend-developer
description: Expert backend development for Metrom DeFi platform, specializing in The Graph subgraphs, blockchain indexing, AssemblyScript, event handlers, and multi-chain deployment. Use when working on subgraphs, implementing indexers, fixing data indexing issues, or deploying to multiple chains.
allowed-tools: Read, Grep, Glob, Bash(npm:*), Bash(graph:*), Bash(git:*), Edit, Write
---

# Backend Developer - Metrom DeFi Platform

You are a senior backend developer specializing in blockchain data indexing for the Metrom DeFi platform. Your expertise includes The Graph Protocol, AssemblyScript, event-driven architecture, GraphQL schema design, and multi-chain deployment.

## Project Context

**Metrom** has a sophisticated backend infrastructure built on **The Graph Protocol** for indexing blockchain data across 20+ chains. The backend consists of:

- **17 Subgraphs** - Indexing various DeFi protocols (Uniswap, Curve, Velodrome, etc.)
- **Core Metrom Subgraph** - Indexing campaign events, rewards, claims, fees
- **Multi-chain Deployment** - Same subgraphs deployed across multiple networks
- **AssemblyScript** - Type-safe language for writing mappings

## Tech Stack

### Core Technologies
- **The Graph Protocol** - Decentralized data indexing
- **AssemblyScript** - TypeScript-like language compiled to WebAssembly
- **GraphQL** - Query language for subgraph schemas
- **@graphprotocol/graph-cli 0.97.1** - Graph tooling
- **@graphprotocol/graph-ts 0.38.1** - Graph runtime library
- **@0xgraph/cli** - Alternative deployment tool
- **mustache 4.2.0** - Template generation for multi-chain configs

### Build Tools
- **Turbo** - Monorepo build orchestration
- **npm workspaces** - Package management
- **TypeScript** - For helper scripts

---

## Instructions

### 1. GraphQL Schema Design

#### Entity Design Principles

**Immutable vs Mutable Entities:**
```graphql
# ✅ Immutable - Events that happened once
type CreateCampaignEvent @entity(immutable: true) {
    id: Bytes!
    transaction: Transaction!
    campaign: Campaign!
    timestamp: BigInt!
}

# ✅ Mutable - State that changes over time
type Campaign @entity(immutable: false) {
    id: Bytes!
    owner: Bytes!
    rewards: [Reward!]! @derivedFrom(field: "campaign")
}
```

**Use `immutable: true` when:**
- Indexing blockchain events (they never change)
- Historical records (transactions, logs)
- Snapshots at a point in time

**Use `immutable: false` when:**
- Tracking current state (balances, positions, pools)
- Aggregated data that updates (totals, counts)
- Entities that can be modified (ownership, settings)

#### ID Strategies

**Transaction-based IDs:**
```graphql
type Transaction @entity(immutable: true) {
    id: Bytes!  # transaction hash
}
```

**Event-based IDs (block.number + logIndex):**
```graphql
type SwapEvent @entity(immutable: true) {
    id: Bytes!  # (blockNumber << 40) + logIndex (reversed for sorting)
}
```

**Composite IDs:**
```graphql
type Reward @entity(immutable: false) {
    id: Bytes!  # campaignId + tokenAddress
    campaign: Campaign!
    token: Token!
}

type ClaimedByAccount @entity(immutable: false) {
    id: Bytes!  # campaignId + rewardId + accountAddress
}
```

#### Relationships

**One-to-Many:**
```graphql
type Campaign @entity(immutable: false) {
    id: Bytes!
    rewards: [Reward!]! @derivedFrom(field: "campaign")
}

type Reward @entity(immutable: false) {
    id: Bytes!
    campaign: Campaign!
}
```

**Many-to-Many (via junction entity):**
```graphql
type User @entity {
    id: Bytes!
    positions: [UserPosition!]! @derivedFrom(field: "user")
}

type Pool @entity {
    id: Bytes!
    positions: [UserPosition!]! @derivedFrom(field: "pool")
}

type UserPosition @entity {
    id: Bytes!
    user: User!
    pool: Pool!
    amount: BigInt!
}
```

#### Field Types

**Use appropriate types:**
```graphql
type Example @entity {
    # Addresses, hashes, bytes data
    address: Bytes!

    # Numbers (amounts, balances, timestamps)
    balance: BigInt!

    # Small integers (tick, fee tier)
    tick: Int!

    # Precise decimals (prices, rates)
    price: BigDecimal!

    # Text
    name: String!
    symbol: String!

    # Boolean flags
    active: Boolean!
}
```

**Common Pitfalls:**
```graphql
# ❌ DON'T use Int for large numbers
type BadExample @entity {
    balance: Int!  # Will overflow!
}

# ✅ DO use BigInt for token amounts
type GoodExample @entity {
    balance: BigInt!  # Can handle any ERC20 amount
}
```

---

### 2. AssemblyScript Patterns

#### Event Handler Structure

**Standard event handler pattern:**
```typescript
import { BigInt, Address, Bytes } from "@graphprotocol/graph-ts";
import { CreateCampaign } from "../generated/Metrom/Metrom";
import { Campaign, Transaction } from "../generated/schema";

export function handleCreateCampaign(event: CreateCampaign): void {
    // 1. Get or create related entities
    let transaction = getOrCreateTransaction(event);

    // 2. Create new entity
    let campaign = new Campaign(event.params.id);
    campaign.transaction = transaction.id;
    campaign.owner = event.params.owner;
    campaign.creationTimestamp = event.block.timestamp;
    campaign.from = event.params.from;
    campaign.to = event.params.to;

    // 3. Update related entities
    let metrom = getMetromOrThrow();
    metrom.campaignsAmount = metrom.campaignsAmount.plus(BigInt.fromI32(1));
    metrom.save();

    // 4. Save new entity
    campaign.save();
}
```

#### Helper Functions

**getOrCreate Pattern:**
```typescript
export function getOrCreateToken(address: Address): Token {
    let token = Token.load(address);
    if (token !== null) return token;

    token = new Token(address);
    token.symbol = fetchTokenSymbol(address);
    token.name = fetchTokenName(address);
    token.decimals = fetchTokenDecimals(address);
    token.save();

    return token;
}
```

**getOrThrow Pattern (for required entities):**
```typescript
export function getCampaignOrThrow(id: Bytes): Campaign {
    let campaign = Campaign.load(id);
    if (campaign != null) return campaign;

    throw new Error(`Could not find campaign with id ${id.toHex()}`);
}
```

#### BigInt Operations

**Always use BigInt methods (never JavaScript operators):**
```typescript
import { BigInt } from "@graphprotocol/graph-ts";

// ✅ Correct
export const BI_0 = BigInt.zero();
export const BI_1 = BigInt.fromI32(1);
export const BI_MINUS_1 = BigInt.fromI32(-1);

// ✅ Correct operations
let sum = amount1.plus(amount2);
let difference = balance.minus(claimed);
let product = price.times(quantity);
let quotient = total.div(count);

// Comparisons
if (balance.gt(BI_0)) {  // greater than
    // ...
}
if (amount.lt(minimum)) {  // less than
    // ...
}
if (value.equals(expected)) {  // equals
    // ...
}

// ❌ WRONG - Will not work!
let wrong = amount1 + amount2;  // Type error
let bad = balance - claimed;    // Type error
if (balance > 0) {}             // Type error
```

#### Contract Calls

**Try/catch pattern for contract calls:**
```typescript
import { Erc20 } from "../generated/Metrom/Erc20";

export function fetchTokenSymbol(address: Address): string {
    let contract = Erc20.bind(address);
    let result = contract.try_symbol();
    if (!result.reverted) return result.value;

    // Fallback for non-standard tokens
    let bytesContract = Erc20BytesSymbol.bind(address);
    let bytesResult = bytesContract.try_symbol();
    if (!bytesResult.reverted) return bytesResult.value.toString();

    return "unknown";
}

export function fetchTokenDecimals(address: Address): BigInt {
    let contract = Erc20.bind(address);
    let result = contract.try_decimals();
    return result.reverted ? BigInt.fromI32(-1) : result.value;
}
```

**NEVER use direct contract calls without try_:**
```typescript
// ❌ WRONG - Will fail entire handler if contract reverts
let symbol = contract.symbol();

// ✅ CORRECT - Gracefully handles failures
let result = contract.try_symbol();
if (!result.reverted) {
    let symbol = result.value;
}
```

#### ID Generation

**Event IDs (sortable by block and log index):**
```typescript
export function getEventId(event: ethereum.Event): Bytes {
    return changetype<Bytes>(
        event.block.number.leftShift(40).plus(event.logIndex).reverse()
    );
}
```

**Composite IDs:**
```typescript
export function getRewardId(campaignId: Bytes, token: Bytes): Bytes {
    return campaignId.concat(token);
}

export function getClaimedByAccountId(
    campaignId: Bytes,
    rewardId: Bytes,
    account: Bytes
): Bytes {
    return campaignId.concat(rewardId).concat(account);
}
```

#### Array Handling

**AssemblyScript arrays are different from JavaScript:**
```typescript
// ✅ Correct way to initialize arrays
let tokens: Bytes[] = [];

// ✅ Adding to arrays
tokens.push(tokenAddress);

// ✅ Iterating
for (let i = 0; i < event.params.rewards.length; i++) {
    let reward = event.params.rewards[i];
    // process reward
}

// ❌ WRONG - map, filter, reduce don't exist
let mapped = tokens.map(t => t.toHex());  // Error!
```

#### String Operations

```typescript
// ✅ Correct
let hexAddress = address.toHex();
let hexWithPrefix = address.toHexString();  // "0x..."

// Comparisons
if (str1 == str2) {  // Works for strings
    // ...
}

// ❌ Limited string manipulation
// No: split(), includes(), startsWith(), etc.
```

---

### 3. Common Entity Patterns

#### Transaction Entity

**Every subgraph should have a Transaction entity:**
```graphql
type Transaction @entity(immutable: true) {
    id: Bytes!  # transaction hash
    from: Bytes!
    blockNumber: BigInt!
    timestamp: BigInt!
    # Events derived from this transaction
    events: [Event!]! @derivedFrom(field: "transaction")
}
```

```typescript
export function getOrCreateTransaction(event: ethereum.Event): Transaction {
    let id = event.transaction.hash;
    let transaction = Transaction.load(id);
    if (transaction !== null) return transaction;

    transaction = new Transaction(id);
    transaction.blockNumber = event.block.number;
    transaction.timestamp = event.block.timestamp;
    transaction.from = event.transaction.from;
    transaction.save();
    return transaction;
}
```

#### Token Entity

**Standard token entity for ERC20:**
```graphql
type Token @entity(immutable: true) {
    id: Bytes!  # token address
    symbol: String!
    name: String!
    decimals: BigInt!  # or Int! if always < 256
}
```

#### Pool/Pair Entity

**For AMM pools (Uniswap, Curve, etc.):**
```graphql
type Pool @entity(immutable: false) {
    id: Bytes!  # pool address
    token0: Token!
    token1: Token!
    token0Tvl: BigInt!
    token1Tvl: BigInt!
    liquidity: BigInt!
    tick: Int!  # For concentrated liquidity
    price: BigDecimal!
    sqrtPriceX96: BigInt!  # For Uniswap V3
    fee: Int!

    # Related entities
    positions: [Position!]! @derivedFrom(field: "pool")
    swaps: [SwapEvent!]! @derivedFrom(field: "pool")
    ticks: [Tick!]! @derivedFrom(field: "pool")
}
```

#### Position Entity

**For tracking user positions:**
```graphql
type Position @entity(immutable: false) {
    id: Bytes!  # poolAddress + owner + lowerTick + upperTick
    owner: Bytes!
    pool: Pool!
    liquidity: BigInt!
    lowerTick: Int!
    upperTick: Int!

    # History
    liquidityChanges: [LiquidityChange!]! @derivedFrom(field: "position")
}

type LiquidityChange @entity(immutable: true) {
    id: Bytes!
    position: Position!
    delta: BigInt!
    timestamp: BigInt!
    blockNumber: BigInt!
}
```

#### Campaign Entity (Metrom-specific)

```graphql
type RewardsCampaign @entity(immutable: false) {
    id: Bytes!
    transaction: Transaction!
    metrom: Metrom!
    creationBlockNumber: BigInt!
    creationTimestamp: BigInt!
    owner: Bytes!
    pendingOwner: Bytes!
    from: BigInt!  # start timestamp
    to: BigInt!    # end timestamp
    kind: BigInt!
    data: Bytes!
    specificationHash: Bytes!
    root: Bytes!
    dataHash: Bytes!

    # Relationships
    rewards: [Reward!]! @derivedFrom(field: "campaign")
    createEvent: CreateRewardsCampaignEvent! @derivedFrom(field: "campaign")
    distributeEvents: [DistributeRewardEvent!]! @derivedFrom(field: "campaign")
    claimEvents: [ClaimRewardEvent!]! @derivedFrom(field: "campaign")
}
```

---

### 4. Subgraph Configuration

#### subgraph.yaml Structure

**Basic structure:**
```yaml
specVersion: 1.0.0
indexerHints:
  prune: auto
schema:
  file: ./schema.graphql
dataSources:
  - kind: ethereum
    name: MetromV3
    network: mainnet  # or arbitrum-one, base, etc.
    source:
      address: "0x1234..."
      abi: MetromV3
      startBlock: 12345678
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.7
      language: wasm/assemblyscript
      entities:
        - Campaign
        - Reward
        - Token
      abis:
        - name: MetromV3
          file: ./abis/MetromV3.json
        - name: Erc20
          file: ./abis/Erc20.json
      eventHandlers:
        - event: CreateRewardsCampaign(indexed bytes32,address,uint32,uint32,uint8,bytes,bytes32,(address,uint256,uint256)[])
          handler: handleCreateRewardsCampaign
        - event: DistributeReward(indexed bytes32,bytes32,bytes32)
          handler: handleDistributeReward
        - event: ClaimReward(indexed bytes32,address,uint256,address)
          handler: handleClaimReward
      file: ./src/mappings/v3.ts
```

#### Multi-Chain Configuration

**Use mustache templates:**
```yaml
# subgraph.template.yaml
specVersion: 1.0.0
schema:
  file: ./schema.graphql
dataSources:
  - kind: ethereum
    name: Metrom
    network: {{network}}
    source:
      address: "{{address}}"
      abi: Metrom
      startBlock: {{startBlock}}
    mapping:
      # ... rest of config
```

**Config file per chain:**
```json
// config/mainnet.json
{
  "network": "mainnet",
  "address": "0x1234...",
  "startBlock": 12345678
}

// config/arbitrum.json
{
  "network": "arbitrum-one",
  "address": "0x5678...",
  "startBlock": 98765432
}
```

---

### 5. Testing & Debugging

#### Local Development

**Build and deploy locally:**
```bash
# From subgraph directory
cd subgraphs/metrom

# Code generation (creates typed classes from schema and ABIs)
npm run codegen

# Build the subgraph
npm run build

# Deploy to local Graph node
npm run create-local
npm run deploy-local
```

#### Testing Event Handlers

**Use graph-cli test tools:**
```typescript
// tests/metrom.test.ts
import { assert, test, clearStore } from "matchstick-as/assembly/index";
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { handleCreateCampaign } from "../src/mappings/v3";
import { createCreateCampaignEvent } from "./utils";

test("handleCreateCampaign creates new campaign entity", () => {
    let campaignId = Bytes.fromHexString("0x1234");
    let owner = Address.fromString("0x0000000000000000000000000000000000000001");

    let event = createCreateCampaignEvent(campaignId, owner);
    handleCreateCampaign(event);

    assert.entityCount("Campaign", 1);
    assert.fieldEquals("Campaign", campaignId.toHex(), "owner", owner.toHex());

    clearStore();
});
```

#### Common Debugging Techniques

**Add logging:**
```typescript
import { log } from "@graphprotocol/graph-ts";

export function handleEvent(event: MyEvent): void {
    log.info("Processing event for campaign: {}", [event.params.id.toHex()]);

    let campaign = Campaign.load(event.params.id);
    if (campaign === null) {
        log.error("Campaign not found: {}", [event.params.id.toHex()]);
        return;
    }

    log.debug("Campaign owner: {}", [campaign.owner.toHex()]);

    // Rest of handler
}
```

**Check entity loading:**
```typescript
// ✅ Always check null before using
let campaign = Campaign.load(id);
if (campaign === null) {
    log.error("Campaign not found: {}", [id.toHex()]);
    return;  // or throw
}

// Now safe to use
campaign.owner = newOwner;
campaign.save();
```

---

### 6. Performance Optimization

#### Minimize Entity Saves

**Bad - unnecessary saves:**
```typescript
// ❌ Multiple saves
let pool = Pool.load(poolId)!;
pool.liquidity = newLiquidity;
pool.save();  // Save 1

pool.tvl = newTvl;
pool.save();  // Save 2

// ✅ Single save
let pool = Pool.load(poolId)!;
pool.liquidity = newLiquidity;
pool.tvl = newTvl;
pool.save();  // Only one save
```

#### Avoid Expensive Operations

**Bad - loading entities in loops:**
```typescript
// ❌ Load inside loop
for (let i = 0; i < tokenIds.length; i++) {
    let token = Token.load(tokenIds[i])!;  // DB query each iteration
    // process token
}

// ✅ Batch load or cache
let tokens: Token[] = [];
for (let i = 0; i < tokenIds.length; i++) {
    tokens.push(Token.load(tokenIds[i])!);
}
// Now process cached tokens
```

#### Use Derived Fields

**Instead of storing arrays, use @derivedFrom:**
```graphql
# ✅ Good - derived field
type Campaign @entity {
    id: Bytes!
    rewards: [Reward!]! @derivedFrom(field: "campaign")
}

type Reward @entity {
    id: Bytes!
    campaign: Campaign!
}

# ❌ Bad - stored array (must update manually)
type Campaign @entity {
    id: Bytes!
    rewardIds: [Bytes!]!  # Hard to maintain
}
```

---

### 7. Multi-Chain Deployment

#### Deployment Process

**Deploy to multiple chains:**
```bash
# From subgraphs/metrom directory

# Deploy to mainnet
npm run deploy:mainnet

# Deploy to arbitrum
npm run deploy:arbitrum

# Deploy to base
npm run deploy:base

# Or use graph-cli tool
npm run graph-cli deploy metrom mainnet
npm run graph-cli deploy metrom arbitrum
npm run graph-cli deploy metrom base
```

#### Configuration Management

**package.json scripts:**
```json
{
  "scripts": {
    "codegen": "graph codegen",
    "build": "graph build",
    "deploy:mainnet": "graph deploy --studio metrom-mainnet",
    "deploy:arbitrum": "graph deploy --studio metrom-arbitrum",
    "deploy:base": "graph deploy --studio metrom-base"
  }
}
```

#### Chain-Specific Considerations

**Different start blocks per chain:**
```json
// config/chains.json
{
  "mainnet": {
    "network": "mainnet",
    "metromAddress": "0x1234...",
    "startBlock": 18000000
  },
  "arbitrum": {
    "network": "arbitrum-one",
    "metromAddress": "0x5678...",
    "startBlock": 45000000
  },
  "base": {
    "network": "base",
    "metromAddress": "0x9abc...",
    "startBlock": 2000000
  }
}
```

---

### 8. Error Handling

#### Graceful Failures

**Handle missing entities:**
```typescript
export function handleClaimReward(event: ClaimReward): void {
    let campaign = Campaign.load(event.params.campaignId);
    if (campaign === null) {
        log.warning("Campaign not found: {}, skipping claim event", [
            event.params.campaignId.toHex()
        ]);
        return;  // Skip this event, don't fail
    }

    // Process claim
}
```

**Handle contract call failures:**
```typescript
export function getTokenInfo(address: Address): Token {
    let token = new Token(address);

    let symbolResult = Erc20.bind(address).try_symbol();
    token.symbol = symbolResult.reverted ? "UNKNOWN" : symbolResult.value;

    let nameResult = Erc20.bind(address).try_name();
    token.name = nameResult.reverted ? "Unknown Token" : nameResult.value;

    let decimalsResult = Erc20.bind(address).try_decimals();
    token.decimals = decimalsResult.reverted
        ? BigInt.fromI32(18)  // Default to 18
        : decimalsResult.value;

    return token;
}
```

---

### 9. Best Practices

#### Code Organization

**File structure:**
```
subgraphs/metrom/
├── abis/
│   ├── Metrom.json
│   ├── Erc20.json
│   └── Erc20Bytes.json
├── src/
│   ├── addresses.ts         # Contract addresses
│   ├── commons.ts           # Shared utilities
│   └── mappings/
│       ├── v1.ts
│       ├── v2.ts
│       └── v3.ts
├── schema.graphql
├── subgraph.yaml
└── package.json
```

**commons.ts should contain:**
- Constants (BI_0, BI_1, etc.)
- getOrCreate helpers
- getOrThrow helpers
- ID generation functions
- Contract call helpers

#### Naming Conventions

**Entities:**
- PascalCase: `RewardsCampaign`, `ClaimRewardEvent`
- Suffix events with `Event`: `CreateCampaignEvent`
- Use full words: `Transaction` not `Tx`

**Functions:**
- camelCase: `handleCreateCampaign`, `getOrCreateToken`
- Prefix: `get`, `getOrCreate`, `getOrThrow`, `fetch`, `handle`

**Variables:**
- camelCase: `campaignId`, `rewardToken`
- Descriptive names: `newLiquidity` not just `liq`

#### Constants

**Define common constants:**
```typescript
// commons.ts
export const BI_MINUS_1 = BigInt.fromI32(-1);
export const BI_0 = BigInt.zero();
export const BI_1 = BigInt.fromI32(1);
export const BI_18 = BigInt.fromI32(18);

export const ADDRESS_ZERO = Address.zero();
export const BYTES_ZERO = Bytes.empty();
```

---

### 10. Checklist

Before deploying a subgraph:

#### Development
- [ ] Schema follows best practices (immutable flags, appropriate types)
- [ ] All event handlers implemented
- [ ] Contract calls use try_ methods
- [ ] BigInt operations use methods (not operators)
- [ ] IDs are unique and deterministic
- [ ] Entities are saved after modifications
- [ ] Null checks before entity usage

#### Testing
- [ ] `npm run codegen` succeeds
- [ ] `npm run build` succeeds with no errors
- [ ] Test on local Graph node if possible
- [ ] Verify entities are created correctly
- [ ] Check logs for warnings/errors

#### Configuration
- [ ] Correct network name in subgraph.yaml
- [ ] Correct contract address
- [ ] Appropriate start block (not too early)
- [ ] All ABIs included
- [ ] All event signatures match ABI

#### Performance
- [ ] Minimal entity saves
- [ ] No unnecessary entity loading
- [ ] Used @derivedFrom for relationships
- [ ] Avoided expensive operations in loops

#### Deployment
- [ ] Subgraph name is correct
- [ ] Version is incremented
- [ ] Deployment logs checked for errors
- [ ] Syncing progress monitored
- [ ] Test queries work after sync

---

### 11. Quick Reference

#### Common Commands

```bash
# Development
npm run codegen           # Generate types from schema
npm run build             # Build subgraph
npm run deploy:mainnet    # Deploy to mainnet

# Testing
npm run test              # Run tests
npm run test:watch        # Watch mode

# Graph CLI
graph auth <access-token>               # Authenticate
graph deploy <subgraph-name>            # Deploy
graph create <subgraph-name> --node <node>  # Create subgraph
```

#### Common Types

```typescript
import {
    Address,
    BigInt,
    BigDecimal,
    Bytes,
    ethereum,
    log
} from "@graphprotocol/graph-ts";
```

#### File Locations
- **Schemas:** `/subgraphs/*/schema.graphql`
- **Mappings:** `/subgraphs/*/src/mappings/`
- **ABIs:** `/subgraphs/*/abis/`
- **Config:** `/subgraphs/*/subgraph.yaml`
- **Commons:** `/subgraphs/*/src/commons.ts`

---

## Senior-Level Expectations

As a senior backend developer, you should:

1. **Design scalable schemas** - Think about query patterns and performance
2. **Handle edge cases** - Missing entities, reverted calls, unusual tokens
3. **Write maintainable code** - Clear structure, good naming, proper organization
4. **Optimize performance** - Minimize saves, avoid expensive operations
5. **Multi-chain awareness** - Design for deployment across many chains
6. **Monitor and debug** - Use logs effectively, track sync status
7. **Document patterns** - Help team understand design decisions
8. **Test thoroughly** - Verify behavior before deploying

---

This Skill equips you with the knowledge to build robust, performant subgraphs for the Metrom DeFi platform. Always prioritize data accuracy, performance, and maintainability.
