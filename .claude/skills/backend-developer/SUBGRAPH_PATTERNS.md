---
name: subgraph-patterns
description: Detailed subgraph implementation patterns for Metrom DeFi
---

# Subgraph Implementation Patterns

Detailed patterns and real-world examples from the Metrom subgraph codebase.

---

## 1. Event Handler Patterns

### Basic Event Handler

**Simple entity creation from event:**
```typescript
import { CreateRewardsCampaign } from "../generated/MetromV3/MetromV3";
import { RewardsCampaign, Transaction, Metrom } from "../generated/schema";
import { getOrCreateTransaction, getMetromOrThrow, BI_1 } from "../commons";
import { Address, Bytes } from "@graphprotocol/graph-ts";

export function handleCreateRewardsCampaign(event: CreateRewardsCampaign): void {
    // Step 1: Get shared entities
    let transaction = getOrCreateTransaction(event);
    let metrom = getMetromOrThrow();

    // Step 2: Update aggregate counters
    metrom.campaignsAmount = metrom.campaignsAmount.plus(BI_1);
    metrom.save();

    // Step 3: Create main entity
    let campaign = new RewardsCampaign(event.params.id);
    campaign.transaction = transaction.id;
    campaign.metrom = metrom.id;
    campaign.creationBlockNumber = event.block.number;
    campaign.creationTimestamp = event.block.timestamp;
    campaign.owner = event.params.owner;
    campaign.pendingOwner = Address.zero();
    campaign.from = event.params.from;
    campaign.to = event.params.to;
    campaign.kind = event.params.kind;
    campaign.data = event.params.data;
    campaign.specificationHash = event.params.specificationHash;
    campaign.dataHash = Bytes.empty();
    campaign.root = Bytes.empty();
    campaign.save();
}
```

### Event Handler with Array Processing

**Handling arrays in events:**
```typescript
export function handleCreateRewardsCampaign(event: CreateRewardsCampaign): void {
    let transaction = getOrCreateTransaction(event);
    let metrom = getMetromOrThrow();

    // Create campaign
    let campaign = new RewardsCampaign(event.params.id);
    campaign.transaction = transaction.id;
    campaign.metrom = metrom.id;
    campaign.owner = event.params.owner;
    campaign.save();

    // Process array of rewards
    for (let i = 0; i < event.params.rewards.length; i++) {
        let eventReward = event.params.rewards[i];

        // Get or create token
        let token = getOrCreateToken(eventReward.token);

        // Create reward entity
        let reward = new Reward(getRewardId(campaign.id, token.id));
        reward.campaign = campaign.id;
        reward.token = token.id;
        reward.amount = eventReward.amount;
        reward.claimed = BI_0;
        reward.recovered = BI_0;
        reward.save();

        // Update claimable fees
        let claimableFee = getOrCreateClaimableFee(token);
        claimableFee.amount = claimableFee.amount.plus(eventReward.fee);
        claimableFee.save();
    }
}
```

### State Update Handler

**Updating existing entity state:**
```typescript
export function handleDistributeReward(event: DistributeReward): void {
    // Load existing entity (must exist)
    let campaign = getCampaignOrThrow(event.params.campaignId);

    // Update mutable fields
    campaign.root = event.params.root;
    campaign.dataHash = event.params.dataHash;
    campaign.save();

    // Create event record
    let distributeEvent = new DistributeRewardEvent(getEventId(event));
    distributeEvent.transaction = getOrCreateTransaction(event).id;
    distributeEvent.campaign = campaign.id;
    distributeEvent.root = event.params.root;
    distributeEvent.dataHash = event.params.dataHash;
    distributeEvent.save();
}
```

### Accumulation Handler

**Accumulating values over time:**
```typescript
export function handleClaimReward(event: ClaimReward): void {
    let campaign = getCampaignOrThrow(event.params.campaignId);
    let token = getOrCreateToken(event.params.token);
    let reward = getRewardOrThrow(campaign.id, token.id);

    // Update aggregate claimed amount
    reward.claimed = reward.claimed.plus(event.params.amount);
    reward.save();

    // Update per-account claimed amount
    let claimedByAccount = getOrCreateClaimedByAccount(
        campaign.id,
        reward.id,
        event.params.receiver
    );
    claimedByAccount.amount = claimedByAccount.amount.plus(event.params.amount);
    claimedByAccount.save();

    // Create event record
    let claimEvent = new ClaimRewardEvent(getEventId(event));
    claimEvent.transaction = getOrCreateTransaction(event).id;
    claimEvent.campaign = campaign.id;
    claimEvent.token = token.id;
    claimEvent.amount = event.params.amount;
    claimEvent.receiver = event.params.receiver;
    claimEvent.save();
}
```

---

## 2. AMM Protocol Patterns

### Uniswap V3 Swap Handler

**Tracking price changes from swaps:**
```typescript
import { Swap } from "../generated/UniswapV3Pool/UniswapV3Pool";
import { Pool, SwapChange } from "../generated/schema";

export function handleSwap(event: Swap): void {
    let pool = Pool.load(event.address);
    if (pool === null) {
        log.warning("Pool not found: {}", [event.address.toHex()]);
        return;
    }

    // Update pool state
    pool.sqrtPriceX96 = event.params.sqrtPriceX96;
    pool.tick = event.params.tick;
    pool.liquidity = event.params.liquidity;

    // Calculate price from sqrtPriceX96
    // price = (sqrtPriceX96 / 2^96) ^ 2
    let sqrtPrice = pool.sqrtPriceX96.toBigDecimal();
    let q96 = BigDecimal.fromString("79228162514264337593543950336"); // 2^96
    let price = sqrtPrice.div(q96).times(sqrtPrice.div(q96));
    pool.price = price;

    pool.save();

    // Record swap change event
    let swapChange = new SwapChange(getEventId(event));
    swapChange.timestamp = event.block.timestamp;
    swapChange.blockNumber = event.block.number;
    swapChange.pool = pool.id;
    swapChange.tick = event.params.tick;
    swapChange.sqrtPriceX96 = event.params.sqrtPriceX96;
    swapChange.save();
}
```

### Liquidity Position Tracking

**Handling Mint/Burn events (liquidity changes):**
```typescript
import { Mint, Burn } from "../generated/UniswapV3Pool/UniswapV3Pool";
import { Pool, Position, LiquidityChange } from "../generated/schema";

export function handleMint(event: Mint): void {
    let pool = Pool.load(event.address);
    if (pool === null) return;

    // Create position ID
    let positionId = event.address
        .concat(event.params.owner)
        .concat(Bytes.fromI32(event.params.tickLower))
        .concat(Bytes.fromI32(event.params.tickUpper));

    // Get or create position
    let position = Position.load(positionId);
    if (position === null) {
        position = new Position(positionId);
        position.pool = pool.id;
        position.owner = event.params.owner;
        position.lowerTick = event.params.tickLower;
        position.upperTick = event.params.tickUpper;
        position.liquidity = BI_0;
        position.direct = true;
    }

    // Update liquidity
    position.liquidity = position.liquidity.plus(event.params.amount);
    position.save();

    // Update pool liquidity
    pool.liquidity = pool.liquidity.plus(event.params.amount);
    pool.save();

    // Record liquidity change
    let change = new LiquidityChange(getEventId(event));
    change.timestamp = event.block.timestamp;
    change.blockNumber = event.block.number;
    change.position = position.id;
    change.delta = event.params.amount;
    change.save();
}

export function handleBurn(event: Burn): void {
    let pool = Pool.load(event.address);
    if (pool === null) return;

    let positionId = event.address
        .concat(event.params.owner)
        .concat(Bytes.fromI32(event.params.tickLower))
        .concat(Bytes.fromI32(event.params.tickUpper));

    let position = Position.load(positionId);
    if (position === null) {
        log.error("Position not found for burn: {}", [positionId.toHex()]);
        return;
    }

    // Decrease liquidity
    position.liquidity = position.liquidity.minus(event.params.amount);
    position.save();

    // Update pool liquidity
    pool.liquidity = pool.liquidity.minus(event.params.amount);
    pool.save();

    // Record liquidity change (negative delta)
    let change = new LiquidityChange(getEventId(event));
    change.timestamp = event.block.timestamp;
    change.blockNumber = event.block.number;
    change.position = position.id;
    change.delta = event.params.amount.times(BigInt.fromI32(-1));
    change.save();
}
```

### Tick Tracking

**Managing tick state for concentrated liquidity:**
```typescript
import { Tick as TickEvent } from "../generated/UniswapV3Pool/UniswapV3Pool";
import { Tick, Pool } from "../generated/schema";

export function handleTickUpdate(event: TickEvent): void {
    let pool = Pool.load(event.address);
    if (pool === null) return;

    // Create tick ID
    let tickId = event.address.concat(Bytes.fromI32(event.params.tick));

    // Get or create tick
    let tick = Tick.load(tickId);
    if (tick === null) {
        tick = new Tick(tickId);
        tick.pool = pool.id;
        tick.idx = event.params.tick;
        tick.liquidityGross = BI_0;
        tick.liquidityNet = BI_0;
    }

    // Update tick state
    tick.liquidityGross = event.params.liquidityGross;
    tick.liquidityNet = event.params.liquidityNet;
    tick.save();
}
```

---

## 3. Helper Function Patterns

### getOrCreate Pattern

**Standard getOrCreate for reusable entities:**
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

**With parent entity:**
```typescript
export function getOrCreateClaimableFee(token: Token): ClaimableFee {
    let claimableFee = ClaimableFee.load(token.id);
    if (claimableFee !== null) return claimableFee;

    claimableFee = new ClaimableFee(token.id);
    claimableFee.metrom = METROM_ADDRESS;
    claimableFee.token = token.id;
    claimableFee.amount = BI_0;
    claimableFee.save();

    return claimableFee;
}
```

**With composite ID:**
```typescript
export function getOrCreateClaimedByAccount(
    campaignId: Bytes,
    rewardId: Bytes,
    account: Bytes
): ClaimedByAccount {
    let id = getClaimedByAccountId(campaignId, rewardId, account);
    let claimed = ClaimedByAccount.load(id);
    if (claimed !== null) return claimed;

    claimed = new ClaimedByAccount(id);
    claimed.reward = rewardId;
    claimed.account = account;
    claimed.amount = BI_0;
    claimed.save();

    return claimed;
}

function getClaimedByAccountId(
    campaignId: Bytes,
    rewardId: Bytes,
    account: Bytes
): Bytes {
    return campaignId.concat(rewardId).concat(account);
}
```

### getOrThrow Pattern

**When entity must exist:**
```typescript
export function getMetromOrThrow(): Metrom {
    let metrom = Metrom.load(METROM_ADDRESS);
    if (metrom != null) return metrom;

    throw new Error(
        `Could not find Metrom at address ${METROM_ADDRESS.toHex()}`
    );
}

export function getCampaignOrThrow(id: Bytes): RewardsCampaign {
    let campaign = RewardsCampaign.load(id);
    if (campaign != null) return campaign;

    throw new Error(`Could not find campaign with id ${id.toHex()}`);
}

export function getRewardOrThrow(campaignId: Bytes, token: Bytes): Reward {
    let reward = Reward.load(getRewardId(campaignId, token));
    if (reward != null) return reward;

    throw new Error(
        `Could not find reward for token ${token.toHex()} on campaign ${campaignId.toHex()}`
    );
}
```

### Contract Call Helpers

**Fetching token metadata with fallbacks:**
```typescript
import { Erc20 } from "../generated/Metrom/Erc20";
import { Erc20BytesSymbol } from "../generated/Metrom/Erc20BytesSymbol";
import { Erc20BytesName } from "../generated/Metrom/Erc20BytesName";

export function fetchTokenSymbol(address: Address): string {
    // Try standard ERC20
    let contract = Erc20.bind(address);
    let result = contract.try_symbol();
    if (!result.reverted) return result.value;

    // Try bytes32 variant
    let bytesContract = Erc20BytesSymbol.bind(address);
    let bytesResult = bytesContract.try_symbol();
    if (!bytesResult.reverted) return bytesResult.value.toString();

    return "unknown";
}

export function fetchTokenName(address: Address): string {
    let contract = Erc20.bind(address);
    let result = contract.try_name();
    if (!result.reverted) return result.value;

    let bytesContract = Erc20BytesName.bind(address);
    let bytesResult = bytesContract.try_name();
    if (!bytesResult.reverted) return bytesResult.value.toString();

    return "unknown";
}

export function fetchTokenDecimals(address: Address): BigInt {
    let contract = Erc20.bind(address);
    let result = contract.try_decimals();
    return result.reverted ? BigInt.fromI32(18) : result.value;
}
```

### ID Generation Helpers

**Event ID (sortable by block and log index):**
```typescript
export function getEventId(event: ethereum.Event): Bytes {
    // Shift block number left by 40 bits, add log index, reverse for sorting
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

export function getPositionId(
    pool: Address,
    owner: Address,
    lowerTick: i32,
    upperTick: i32
): Bytes {
    return pool
        .concat(owner)
        .concat(Bytes.fromI32(lowerTick))
        .concat(Bytes.fromI32(upperTick));
}

export function getTickId(pool: Address, tickIndex: i32): Bytes {
    return pool.concat(Bytes.fromI32(tickIndex));
}
```

---

## 4. Advanced Patterns

### Singleton Entity Pattern

**Managing protocol-level state:**
```typescript
// Schema
type Metrom @entity(immutable: false) {
    id: Bytes!
    ossified: Boolean!
    owner: Bytes!
    pendingOwner: Bytes!
    updater: Bytes!
    fee: BigInt!
    campaignsAmount: BigInt!
    # ... other fields
}

// Initialize handler
export function handleInitialize(event: Initialize): void {
    let metrom = new Metrom(METROM_ADDRESS);
    metrom.ossified = false;
    metrom.owner = event.params.owner;
    metrom.pendingOwner = Address.zero();
    metrom.updater = event.params.updater;
    metrom.fee = event.params.fee;
    metrom.campaignsAmount = BI_0;
    metrom.save();
}

// Access singleton
export function getMetromOrThrow(): Metrom {
    let metrom = Metrom.load(METROM_ADDRESS);
    if (metrom != null) return metrom;
    throw new Error("Metrom not initialized");
}
```

### Ownership Transfer Pattern

**Two-step ownership transfer:**
```typescript
// Step 1: Initiate transfer
export function handleTransferOwnership(event: TransferOwnership): void {
    let campaign = getCampaignOrThrow(event.params.campaignId);

    // Set pending owner (doesn't transfer yet)
    campaign.pendingOwner = event.params.newOwner;
    campaign.save();

    // Create event record
    let transferEvent = new TransferOwnershipEvent(getEventId(event));
    transferEvent.transaction = getOrCreateTransaction(event).id;
    transferEvent.campaign = campaign.id;
    transferEvent.owner = event.params.newOwner;
    transferEvent.save();
}

// Step 2: Accept transfer
export function handleAcceptOwnership(event: AcceptOwnership): void {
    let campaign = getCampaignOrThrow(event.params.campaignId);

    // Complete transfer
    campaign.owner = campaign.pendingOwner;
    campaign.pendingOwner = Address.zero();
    campaign.save();

    // Create event record
    let acceptEvent = new AcceptOwnershipEvent(getEventId(event));
    acceptEvent.transaction = getOrCreateTransaction(event).id;
    acceptEvent.campaign = campaign.id;
    acceptEvent.owner = campaign.owner;
    acceptEvent.save();
}
```

### Snapshot Pattern

**Taking periodic snapshots:**
```typescript
type PoolSnapshot @entity(immutable: true) {
    id: Bytes!  # poolAddress + timestamp
    pool: Pool!
    timestamp: BigInt!
    liquidity: BigInt!
    token0Tvl: BigInt!
    token1Tvl: BigInt!
    price: BigDecimal!
}

export function takeSnapshot(pool: Pool, timestamp: BigInt): void {
    let snapshotId = pool.id.concat(Bytes.fromBigInt(timestamp));

    let snapshot = new PoolSnapshot(snapshotId);
    snapshot.pool = pool.id;
    snapshot.timestamp = timestamp;
    snapshot.liquidity = pool.liquidity;
    snapshot.token0Tvl = pool.token0Tvl;
    snapshot.token1Tvl = pool.token1Tvl;
    snapshot.price = pool.price;
    snapshot.save();
}

// Call from event handler
export function handleSwap(event: Swap): void {
    let pool = Pool.load(event.address);
    if (pool === null) return;

    // Update pool
    pool.tick = event.params.tick;
    pool.save();

    // Take snapshot every hour
    let hourTimestamp = event.block.timestamp.div(BigInt.fromI32(3600))
        .times(BigInt.fromI32(3600));
    takeSnapshot(pool, hourTimestamp);
}
```

### Merkle Root Distribution Pattern

**Recording merkle root for off-chain claims:**
```typescript
export function handleDistributeReward(event: DistributeReward): void {
    let campaign = getCampaignOrThrow(event.params.campaignId);

    // Store merkle root and data hash
    campaign.root = event.params.root;
    campaign.dataHash = event.params.dataHash;
    campaign.save();

    // Create distribution event
    let distributeEvent = new DistributeRewardEvent(getEventId(event));
    distributeEvent.transaction = getOrCreateTransaction(event).id;
    distributeEvent.campaign = campaign.id;
    distributeEvent.root = event.params.root;
    distributeEvent.dataHash = event.params.dataHash;
    distributeEvent.save();
}

// Later, when user claims
export function handleClaimReward(event: ClaimReward): void {
    let campaign = getCampaignOrThrow(event.params.campaignId);

    // Verify campaign has distribution
    if (campaign.root.equals(Bytes.empty())) {
        log.warning("Claim for campaign without distribution: {}", [
            campaign.id.toHex()
        ]);
    }

    // Process claim (update reward.claimed, etc.)
    // ...
}
```

---

## 5. Error-Prone Areas & Solutions

### Problem: BigInt Arithmetic

**Wrong:**
```typescript
let sum = amount1 + amount2;  // ❌ Type error
let diff = balance - 10;      // ❌ Type error
if (balance > 0) {}           // ❌ Type error
```

**Correct:**
```typescript
let sum = amount1.plus(amount2);
let diff = balance.minus(BigInt.fromI32(10));
if (balance.gt(BI_0)) {}
```

### Problem: Null Safety

**Wrong:**
```typescript
let campaign = Campaign.load(id);
campaign.owner = newOwner;  // ❌ Might be null!
campaign.save();
```

**Correct:**
```typescript
let campaign = Campaign.load(id);
if (campaign === null) {
    log.error("Campaign not found: {}", [id.toHex()]);
    return;
}
campaign.owner = newOwner;
campaign.save();
```

### Problem: Contract Calls

**Wrong:**
```typescript
let symbol = Erc20.bind(address).symbol();  // ❌ Will fail entire handler if reverts
```

**Correct:**
```typescript
let result = Erc20.bind(address).try_symbol();
let symbol = result.reverted ? "unknown" : result.value;
```

### Problem: Array Methods

**Wrong:**
```typescript
let ids = tokens.map(t => t.id);  // ❌ map() doesn't exist
let filtered = tokens.filter(t => t.balance.gt(BI_0));  // ❌ filter() doesn't exist
```

**Correct:**
```typescript
let ids: Bytes[] = [];
for (let i = 0; i < tokens.length; i++) {
    ids.push(tokens[i].id);
}
```

### Problem: Entity Not Saved

**Wrong:**
```typescript
let token = new Token(address);
token.symbol = "ETH";
// ❌ Forgot to save!

let campaign = Campaign.load(id);
campaign.owner = newOwner;
// ❌ Forgot to save!
```

**Correct:**
```typescript
let token = new Token(address);
token.symbol = "ETH";
token.save();  // ✅

let campaign = Campaign.load(id)!;
campaign.owner = newOwner;
campaign.save();  // ✅
```

---

## 6. Testing Patterns

### Mock Event Creation

```typescript
// tests/utils.ts
import { newMockEvent } from "matchstick-as";
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { CreateCampaign } from "../generated/Metrom/Metrom";

export function createCreateCampaignEvent(
    id: Bytes,
    owner: Address,
    from: BigInt,
    to: BigInt
): CreateCampaign {
    let event = changetype<CreateCampaign>(newMockEvent());

    event.parameters = [];
    event.parameters.push(
        new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
    );
    event.parameters.push(
        new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
    );
    event.parameters.push(
        new ethereum.EventParam("from", ethereum.Value.fromUnsignedBigInt(from))
    );
    event.parameters.push(
        new ethereum.EventParam("to", ethereum.Value.fromUnsignedBigInt(to))
    );

    return event;
}
```

### Test Structure

```typescript
// tests/metrom.test.ts
import {
    assert,
    test,
    clearStore,
    beforeEach,
    afterEach
} from "matchstick-as/assembly/index";
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { handleCreateCampaign } from "../src/mappings/v3";
import { createCreateCampaignEvent } from "./utils";

beforeEach(() => {
    // Setup
});

afterEach(() => {
    clearStore();
});

test("handleCreateCampaign creates new campaign entity", () => {
    let campaignId = Bytes.fromHexString("0x1234");
    let owner = Address.fromString("0x0000000000000000000000000000000000000001");
    let from = BigInt.fromI32(1000000);
    let to = BigInt.fromI32(2000000);

    let event = createCreateCampaignEvent(campaignId, owner, from, to);
    handleCreateCampaign(event);

    assert.entityCount("Campaign", 1);
    assert.fieldEquals("Campaign", campaignId.toHex(), "owner", owner.toHex());
    assert.fieldEquals("Campaign", campaignId.toHex(), "from", from.toString());
});

test("handleCreateCampaign increments campaign count", () => {
    // ... test implementation
});
```

---

## 7. Performance Patterns

### Batch Updates

**Bad - multiple saves:**
```typescript
let pool = Pool.load(poolId)!;
pool.liquidity = newLiquidity;
pool.save();

pool.tick = newTick;
pool.save();

pool.price = newPrice;
pool.save();
```

**Good - single save:**
```typescript
let pool = Pool.load(poolId)!;
pool.liquidity = newLiquidity;
pool.tick = newTick;
pool.price = newPrice;
pool.save();
```

### Conditional Updates

**Only save if changed:**
```typescript
export function updatePoolIfNeeded(
    pool: Pool,
    newTick: i32,
    newLiquidity: BigInt
): void {
    let needsSave = false;

    if (pool.tick != newTick) {
        pool.tick = newTick;
        needsSave = true;
    }

    if (!pool.liquidity.equals(newLiquidity)) {
        pool.liquidity = newLiquidity;
        needsSave = true;
    }

    if (needsSave) {
        pool.save();
    }
}
```

### Avoid Redundant Loads

**Bad - loading same entity multiple times:**
```typescript
export function handler1(event: Event1): void {
    let pool = Pool.load(poolId)!;
    pool.tick = event.params.tick;
    pool.save();
}

export function handler2(event: Event2): void {
    let pool = Pool.load(poolId)!;  // Loads again
    pool.liquidity = event.params.liquidity;
    pool.save();
}
```

**Good - cache if multiple handlers run:**
```typescript
// If events are in same transaction, consider combining logic
```

---

These patterns represent battle-tested solutions from the Metrom subgraph codebase. Always refer to existing implementations when adding new features to maintain consistency.
