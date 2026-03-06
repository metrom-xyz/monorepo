# Multi-Chain Subgraph Deployment Guide

Complete guide for deploying Metrom subgraphs across multiple blockchain networks.

---

## Table of Contents

1. [Deployment Overview](#deployment-overview)
2. [Configuration Management](#configuration-management)
3. [Deployment Process](#deployment-process)
4. [Chain-Specific Considerations](#chain-specific-considerations)
5. [Monitoring & Maintenance](#monitoring--maintenance)
6. [Troubleshooting](#troubleshooting)

---

## Deployment Overview

### Supported Networks

Metrom subgraphs are deployed across **20+ blockchain networks**:

**Mainnet Networks:**
- Ethereum Mainnet
- Arbitrum One
- Base
- Gnosis
- Hemi
- Katana (Aptos MVM)
- Lens
- LightLink Phoenix
- Linea
- Lumia
- Plasma
- Saga
- Scroll
- Sei
- Sonic
- Swell
- Taiko
- Telos

**Testnet Networks:**
- Base Sepolia
- Sepolia
- Swell Testnet
- Sei Testnet
- Katana Testnet

### Deployment Tools

**The Graph Studio** - Official hosted service
```bash
graph auth --studio <access-token>
graph deploy --studio <subgraph-name>
```

**Decentralized Network** - The Graph Network
```bash
graph auth --node https://api.thegraph.com/deploy/
graph deploy --node https://api.thegraph.com/deploy/ <subgraph-name>
```

**Custom Indexer** - Self-hosted or third-party
```bash
graph deploy --node http://localhost:8020/ --ipfs http://localhost:5001/ <subgraph-name>
```

---

## Configuration Management

### Directory Structure

```
subgraphs/metrom/
├── config/
│   ├── mainnet.json
│   ├── arbitrum.json
│   ├── base.json
│   ├── sepolia.json
│   └── ...
├── subgraph.template.yaml
├── subgraph.yaml (generated)
├── schema.graphql
├── src/
│   ├── addresses.ts
│   ├── commons.ts
│   └── mappings/
└── package.json
```

### Configuration Files

**subgraph.template.yaml:**
```yaml
specVersion: 1.0.0
indexerHints:
  prune: auto
schema:
  file: ./schema.graphql
dataSources:
  - kind: ethereum
    name: Metrom{{version}}
    network: {{network}}
    source:
      address: "{{address}}"
      abi: Metrom{{version}}
      startBlock: {{startBlock}}
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.7
      language: wasm/assemblyscript
      entities:
        - Metrom
        - Campaign
        - Reward
        - Token
      abis:
        - name: Metrom{{version}}
          file: ./abis/Metrom{{version}}.json
        - name: Erc20
          file: ./abis/Erc20.json
        - name: Erc20BytesName
          file: ./abis/Erc20BytesName.json
        - name: Erc20BytesSymbol
          file: ./abis/Erc20BytesSymbol.json
      eventHandlers:
        - event: Initialize(address,address,uint24,uint32,uint32)
          handler: handleInitialize
        - event: CreateRewardsCampaign(indexed bytes32,address,uint32,uint32,uint8,bytes,bytes32,(address,uint256,uint256)[])
          handler: handleCreateRewardsCampaign
        - event: CreatePointsCampaign(indexed bytes32,address,uint32,uint32,uint8,bytes,bytes32,uint256,address,uint256)
          handler: handleCreatePointsCampaign
        - event: DistributeReward(indexed bytes32,bytes32,bytes32)
          handler: handleDistributeReward
        - event: ClaimReward(indexed bytes32,address,uint256,address)
          handler: handleClaimReward
        - event: RecoverReward(indexed bytes32,address,uint256,address)
          handler: handleRecoverReward
      file: ./src/mappings/v{{version}}.ts
```

**config/mainnet.json:**
```json
{
  "network": "mainnet",
  "address": "0x1234567890abcdef1234567890abcdef12345678",
  "startBlock": 18000000,
  "version": "3"
}
```

**config/arbitrum.json:**
```json
{
  "network": "arbitrum-one",
  "address": "0xabcdef1234567890abcdef1234567890abcdef12",
  "startBlock": 45000000,
  "version": "3"
}
```

**config/base.json:**
```json
{
  "network": "base",
  "address": "0x9876543210fedcba9876543210fedcba98765432",
  "startBlock": 2000000,
  "version": "3"
}
```

### Template Generation Script

**scripts/prepare.ts:**
```typescript
import * as fs from 'fs';
import * as path from 'path';
import * as Mustache from 'mustache';

interface ChainConfig {
  network: string;
  address: string;
  startBlock: number;
  version: string;
}

function generateSubgraphYaml(chain: string): void {
  const configPath = path.join(__dirname, '..', 'config', `${chain}.json`);
  const templatePath = path.join(__dirname, '..', 'subgraph.template.yaml');
  const outputPath = path.join(__dirname, '..', 'subgraph.yaml');

  // Read config
  const config: ChainConfig = JSON.parse(
    fs.readFileSync(configPath, 'utf-8')
  );

  // Read template
  const template = fs.readFileSync(templatePath, 'utf-8');

  // Generate subgraph.yaml
  const output = Mustache.render(template, config);
  fs.writeFileSync(outputPath, output);

  console.log(`Generated subgraph.yaml for ${chain}`);
}

// Get chain from command line
const chain = process.argv[2];
if (!chain) {
  console.error('Usage: npm run prepare <chain>');
  process.exit(1);
}

generateSubgraphYaml(chain);
```

**Generate addresses.ts:**
```typescript
// scripts/generate-addresses.ts
import * as fs from 'fs';
import * as path from 'path';

interface ChainConfig {
  network: string;
  address: string;
  startBlock: number;
}

function generateAddressesFile(chain: string): void {
  const configPath = path.join(__dirname, '..', 'config', `${chain}.json`);
  const config: ChainConfig = JSON.parse(
    fs.readFileSync(configPath, 'utf-8')
  );

  const output = `// Auto-generated - DO NOT EDIT
import { Address } from "@graphprotocol/graph-ts";

export const METROM_ADDRESS = Address.fromString("${config.address}");
`;

  const outputPath = path.join(__dirname, '..', 'src', 'addresses.ts');
  fs.writeFileSync(outputPath, output);

  console.log(`Generated addresses.ts for ${chain}`);
}

const chain = process.argv[2];
if (!chain) {
  console.error('Usage: npm run generate-addresses <chain>');
  process.exit(1);
}

generateAddressesFile(chain);
```

### package.json Scripts

```json
{
  "name": "@metrom-xyz/subgraph-metrom",
  "version": "1.0.0",
  "scripts": {
    "prepare": "tsx scripts/prepare.ts",
    "generate-addresses": "tsx scripts/generate-addresses.ts",
    "codegen": "graph codegen",
    "build": "graph build",
    "test": "graph test",

    "deploy:mainnet": "npm run prepare mainnet && npm run generate-addresses mainnet && npm run codegen && npm run build && graph deploy --studio metrom-mainnet",
    "deploy:arbitrum": "npm run prepare arbitrum && npm run generate-addresses arbitrum && npm run codegen && npm run build && graph deploy --studio metrom-arbitrum",
    "deploy:base": "npm run prepare base && npm run generate-addresses base && npm run codegen && npm run build && graph deploy --studio metrom-base",
    "deploy:sepolia": "npm run prepare sepolia && npm run generate-addresses sepolia && npm run codegen && npm run build && graph deploy --studio metrom-sepolia",

    "deploy-all": "npm run deploy:mainnet && npm run deploy:arbitrum && npm run deploy:base"
  },
  "dependencies": {
    "@graphprotocol/graph-cli": "^0.97.1",
    "@graphprotocol/graph-ts": "^0.38.1"
  },
  "devDependencies": {
    "mustache": "^4.2.0",
    "tsx": "^4.20.5",
    "typescript": "^5.9.2"
  }
}
```

---

## Deployment Process

### Step-by-Step Deployment

#### 1. Authenticate with Graph Studio

```bash
# Get access token from https://thegraph.com/studio/
graph auth --studio <YOUR_DEPLOY_KEY>
```

#### 2. Create Subgraph in Studio

1. Go to https://thegraph.com/studio/
2. Click "Create a Subgraph"
3. Enter subgraph name: `metrom-mainnet`
4. Select network: `mainnet`
5. Copy the deploy command

#### 3. Prepare Configuration

```bash
# Generate subgraph.yaml and addresses.ts for target chain
npm run prepare mainnet
npm run generate-addresses mainnet
```

#### 4. Generate Code

```bash
# Generate AssemblyScript types from schema and ABIs
npm run codegen
```

This creates:
- `generated/schema.ts` - Entity classes
- `generated/MetromV3/MetromV3.ts` - Contract and event classes

#### 5. Build Subgraph

```bash
npm run build
```

This compiles AssemblyScript to WebAssembly and outputs to `build/`.

#### 6. Deploy

```bash
# Deploy to Graph Studio
graph deploy --studio metrom-mainnet

# Or use the npm script
npm run deploy:mainnet
```

#### 7. Monitor Deployment

1. Go to https://thegraph.com/studio/
2. Click on your subgraph
3. Monitor sync status
4. Check for indexing errors

### Automated Multi-Chain Deployment

**Deploy script (deploy-all.sh):**
```bash
#!/bin/bash

CHAINS=("mainnet" "arbitrum" "base" "sepolia")

for chain in "${CHAINS[@]}"
do
  echo "Deploying to $chain..."

  # Prepare config
  npm run prepare $chain
  npm run generate-addresses $chain

  # Build
  npm run codegen
  npm run build

  # Deploy
  graph deploy --studio metrom-$chain

  if [ $? -eq 0 ]; then
    echo "✅ Successfully deployed to $chain"
  else
    echo "❌ Failed to deploy to $chain"
    exit 1
  fi

  echo "---"
done

echo "🎉 All deployments complete!"
```

Make executable and run:
```bash
chmod +x deploy-all.sh
./deploy-all.sh
```

---

## Chain-Specific Considerations

### Start Block Selection

**Why it matters:**
- Lower start block = longer sync time
- Too high = might miss events
- Optimal: first block where contract was deployed

**Find deployment block:**
```bash
# Using etherscan API
curl "https://api.etherscan.io/api?module=account&action=txlist&address=0x1234...&startblock=0&endblock=99999999&sort=asc&apikey=YOUR_API_KEY" | jq '.'

# Or check transaction directly
# The deployment tx block number is your start block
```

**Recommended approach:**
```json
{
  "startBlock": 18123456  // Block of contract deployment
}
```

### Network Names

**Must match The Graph's network identifiers:**

| Chain | Network Name in subgraph.yaml |
|-------|-------------------------------|
| Ethereum | `mainnet` |
| Arbitrum One | `arbitrum-one` |
| Arbitrum Sepolia | `arbitrum-sepolia` |
| Base | `base` |
| Base Sepolia | `base-sepolia` |
| Optimism | `optimism` |
| Polygon | `matic` |
| Polygon zkEVM | `polygon-zkevm` |
| Gnosis | `gnosis` |
| Celo | `celo` |
| Avalanche | `avalanche` |
| BSC | `bsc` |
| Fantom | `fantom` |
| Moonbeam | `moonbeam` |
| Moonriver | `moonriver` |

**Verify network name:**
```yaml
dataSources:
  - kind: ethereum
    network: arbitrum-one  # ✅ Correct
    # network: arbitrum    # ❌ Wrong
```

### Contract Addresses

**Ensure correct address per chain:**
```typescript
// ❌ Wrong - hardcoded single address
export const METROM_ADDRESS = Address.fromString(
  "0x1234567890abcdef1234567890abcdef12345678"
);

// ✅ Correct - generated per chain from config
// src/addresses.ts (generated by script)
export const METROM_ADDRESS = Address.fromString("{{address}}");
```

### Block Time Differences

Different chains have different block times:

| Chain | Block Time | Blocks/Day |
|-------|------------|------------|
| Ethereum | ~12s | ~7,200 |
| Arbitrum | ~0.25s | ~345,600 |
| Base | ~2s | ~43,200 |
| Polygon | ~2s | ~43,200 |

**Impact on time-based logic:**
```typescript
// ❌ Wrong - assumes Ethereum block times
let dayInBlocks = 7200;

// ✅ Correct - use timestamps
let oneDayAgo = event.block.timestamp.minus(BigInt.fromI32(86400));
```

---

## Monitoring & Maintenance

### Health Checks

**Check sync status:**
```graphql
query {
  _meta {
    block {
      number
      hash
    }
    deployment
    hasIndexingErrors
  }
}
```

**Check indexing progress:**
```bash
# Get current block on chain
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  https://mainnet.infura.io/v3/YOUR_KEY

# Compare with subgraph block
```

### Error Monitoring

**Check for errors in Studio:**
1. Go to subgraph dashboard
2. Click "Logs" tab
3. Filter by error level

**Common errors:**
- **"Entity not found"** - Missing required entity (check ID generation)
- **"Call reverted"** - Contract call failed (use try_ methods)
- **"Failed to index block"** - Node issue or handler crash

**Add logging for debugging:**
```typescript
import { log } from "@graphprotocol/graph-ts";

export function handleEvent(event: MyEvent): void {
  log.info("Processing event: {}", [event.transaction.hash.toHex()]);

  let entity = Entity.load(id);
  if (entity === null) {
    log.warning("Entity not found: {}", [id.toHex()]);
    return;
  }

  log.debug("Entity loaded successfully: {}", [entity.id.toHex()]);
}
```

### Version Updates

**Deploying new version:**
```bash
# Update version in package.json
npm version patch  # or minor/major

# Update changelog
echo "v1.0.1 - Fixed entity loading bug" >> CHANGELOG.md

# Deploy with version label
graph deploy --studio metrom-mainnet --version-label v1.0.1
```

### Rollback Strategy

**If new deployment has issues:**
```bash
# Redeploy previous version
graph deploy --studio metrom-mainnet --version-label v1.0.0
```

---

## Troubleshooting

### Common Issues

#### Issue: "network not supported"
```
Error: Failed to deploy to network: network not supported
```

**Solution:**
Check network name in `subgraph.yaml` matches The Graph's identifiers:
```yaml
network: arbitrum-one  # ✅ Correct
# not: arbitrum        # ❌ Wrong
```

#### Issue: "startBlock is required"
```
Error: startBlock is required for data sources
```

**Solution:**
Add startBlock to config:
```json
{
  "startBlock": 18000000
}
```

#### Issue: Subgraph not syncing
```
Status: Syncing (0 blocks behind)
```

**Possible causes:**
1. **RPC rate limiting** - The Graph node hitting RPC limits
2. **Invalid start block** - Started too far back
3. **Handler errors** - Check logs for errors

**Solutions:**
```bash
# Check logs
# Look for "Failed to process block" errors

# If handler errors, fix and redeploy
# If RPC issues, wait or contact The Graph support
```

#### Issue: "Entity not found"
```
Error: Entity Campaign with ID 0x1234... not found
```

**Solution:**
Check entity creation order:
```typescript
// ❌ Wrong - trying to load before creation
let campaign = getCampaignOrThrow(id);  // Throws if not created yet

// ✅ Correct - use getOrCreate or check null
let campaign = Campaign.load(id);
if (campaign === null) {
    log.warning("Campaign not found, skipping", []);
    return;
}
```

#### Issue: BigInt overflow
```
Error: Cannot convert ... to a BigInt
```

**Solution:**
```typescript
// ❌ Wrong
let amount = BigInt.fromI32(event.params.largeNumber);  // Overflow!

// ✅ Correct
let amount = event.params.largeNumber;  // Already BigInt from event
```

### Debugging Techniques

#### Enable Verbose Logging

```typescript
import { log } from "@graphprotocol/graph-ts";

export function handleCreateCampaign(event: CreateCampaign): void {
    log.debug("=== handleCreateCampaign START ===", []);
    log.debug("Campaign ID: {}", [event.params.id.toHex()]);
    log.debug("Owner: {}", [event.params.owner.toHex()]);

    // Your handler logic

    log.debug("=== handleCreateCampaign END ===", []);
}
```

#### Test Locally

```bash
# Start local graph node
git clone https://github.com/graphprotocol/graph-node
cd graph-node/docker
./setup.sh
docker-compose up

# Deploy locally
npm run create-local
npm run deploy-local

# Query locally
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "{ campaigns(first: 5) { id owner } }"}' \
  http://localhost:8000/subgraphs/name/metrom/metrom
```

#### Use Matchstick Testing

```bash
# Run tests
npm run test

# Run specific test
npm run test -- handleCreateCampaign
```

---

## Deployment Checklist

Before deploying to production:

- [ ] Config files created for all target chains
- [ ] Contract addresses verified on each chain
- [ ] Start blocks set to deployment block
- [ ] Network names match The Graph identifiers
- [ ] Schema follows best practices
- [ ] All event handlers implemented
- [ ] Contract calls use try_ methods
- [ ] Tests pass locally
- [ ] Built successfully without errors
- [ ] Deployed to testnet first
- [ ] Verified sync on testnet
- [ ] No indexing errors on testnet
- [ ] Test queries work correctly
- [ ] Documentation updated
- [ ] Team notified of deployment

After deployment:

- [ ] Monitor sync progress
- [ ] Check for indexing errors
- [ ] Run test queries
- [ ] Verify data accuracy
- [ ] Update frontend endpoints
- [ ] Monitor query performance

---

This guide covers the complete deployment lifecycle for Metrom subgraphs across multiple chains. Always test on testnet before production deployments!
