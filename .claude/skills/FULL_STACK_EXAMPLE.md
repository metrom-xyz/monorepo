# Full-Stack Implementation: Campaign Performance Feature

This document shows how **both skills work together** to create a complete full-stack feature.

---

## Feature Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     USER INTERFACE                          │
│  (Frontend - senior-frontend-developer skill)               │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ GraphQL Queries
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     THE GRAPH API                           │
│  (Data Layer - Indexes blockchain events)                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Event Indexing
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   SUBGRAPH INDEXER                          │
│  (Backend - backend-developer skill)                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Event Listening
                              ▼
┌─────────────────────────────────────────────────────────────┐
│               BLOCKCHAIN (Ethereum, Arbitrum, etc.)         │
│  (Smart Contracts emit events)                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### 1. Blockchain Event

```solidity
// Smart contract emits event
emit ClaimReward(campaignId, token, amount, receiver);
```

### 2. Backend Processes Event (backend-developer skill)

```typescript
// subgraphs/metrom/src/mappings/v3.ts
export function handleClaimReward(event: ClaimReward): void {
    // Update campaign metrics
    let participant = getOrCreateParticipant(
        event.params.campaignId,
        event.params.receiver,
        event.block.timestamp
    );

    participant.totalClaimed = participant.totalClaimed.plus(event.params.amount);
    participant.claimCount = participant.claimCount.plus(BI_1);
    participant.save();

    // Take snapshot
    if (shouldTakeSnapshot(event.block.timestamp)) {
        takeCampaignSnapshot(campaign, timestamp, blockNumber);
    }
}
```

### 3. Frontend Queries Data (senior-frontend-developer skill)

```typescript
// packages/frontend/src/hooks/useCampaignPerformance.ts
export function useCampaignPerformance({ campaignId }) {
    return useQuery({
        queryKey: ['campaign-performance', campaignId],
        queryFn: async () => {
            const response = await client.query({
                query: `
                    query {
                        rewardsCampaign(id: "${campaignId}") {
                            snapshots { totalClaimed uniqueClaimers }
                            dailyMetrics { claimedToday uniqueClaimersToday }
                        }
                        campaignParticipants(where: { campaign: "${campaignId}" }) {
                            participant
                            totalClaimed
                            claimCount
                        }
                    }
                `
            });
            return response;
        }
    });
}
```

### 4. Frontend Displays Data

```typescript
// packages/frontend/src/components/features/campaign/PerformanceDashboard.tsx
export function PerformanceDashboard({ campaignId }) {
    const { data } = useCampaignPerformance({ campaignId });

    return (
        <div>
            <PerformanceMetrics summary={data.summary} />
            <PerformanceChart snapshots={data.snapshots} />
            <ParticipantLeaderboard participants={data.topParticipants} />
        </div>
    );
}
```

---

## Skills Comparison

| Aspect | Backend Developer Skill | Frontend Developer Skill |
|--------|------------------------|--------------------------|
| **Language** | AssemblyScript | TypeScript/React |
| **Data Model** | GraphQL Schema | TypeScript Interfaces |
| **State** | Blockchain Events | React State + React Query |
| **Operations** | BigInt methods | JavaScript/BigInt |
| **Testing** | Matchstick | Jest/React Testing Library |
| **Deployment** | Multi-chain subgraphs | Vercel/CDN |
| **Performance** | Minimize entity saves | Minimize re-renders |
| **Key Patterns** | getOrCreate, event handlers | Hooks, server components |

---

## Code Comparison: Same Feature, Different Layers

### Backend: Creating a Participant Record

```typescript
// AssemblyScript (backend-developer skill)
export function getOrCreateParticipant(
    campaignId: Bytes,
    participant: Bytes,
    timestamp: BigInt
): CampaignParticipant {
    let id = getParticipantId(campaignId, participant);
    let entity = CampaignParticipant.load(id);

    if (entity !== null) return entity;

    entity = new CampaignParticipant(id);
    entity.campaign = campaignId;
    entity.participant = participant;
    entity.firstClaimTimestamp = timestamp;
    entity.totalClaimed = BI_0;
    entity.claimCount = BI_0;
    entity.save();

    return entity;
}
```

### Frontend: Displaying Participant Data

```typescript
// TypeScript/React (senior-frontend-developer skill)
export function ParticipantCard({ participant }: { participant: CampaignParticipant }) {
    const formattedAmount = formatCurrency(
        parseFloat(formatUnits(BigInt(participant.totalClaimed), 18)),
        { compact: true }
    );

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between">
                <span className="font-mono text-sm">
                    {shortenAddress(participant.participant)}
                </span>
                <span className="text-lg font-bold">
                    {formattedAmount}
                </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                {participant.claimCount} claims
            </p>
        </Card>
    );
}
```

---

## Type Synchronization

### Backend Schema (GraphQL)

```graphql
type CampaignParticipant @entity(immutable: false) {
    id: Bytes!
    campaign: RewardsCampaign!
    participant: Bytes!
    firstClaimTimestamp: BigInt!
    lastClaimTimestamp: BigInt!
    totalClaimed: BigInt!
    claimCount: BigInt!
}
```

### Frontend Types (TypeScript)

```typescript
export interface CampaignParticipant {
    id: string;
    participant: string;
    firstClaimTimestamp: number;
    lastClaimTimestamp: number;
    totalClaimed: string;  // BigInt as string from GraphQL
    claimCount: number;
}
```

**Key differences:**
- Backend: `Bytes!` → Frontend: `string`
- Backend: `BigInt!` → Frontend: `string` (for large numbers) or `number` (for counts)
- Backend: entity relationships → Frontend: nested objects

---

## Performance Optimizations

### Backend Optimizations

```typescript
// ✅ Single save per entity
participant.totalClaimed = participant.totalClaimed.plus(amount);
participant.claimCount = participant.claimCount.plus(BI_1);
participant.save();  // Only once

// ✅ Conditional snapshots
if (shouldTakeSnapshot(timestamp)) {
    takeCampaignSnapshot(...);
}

// ✅ Derived fields (no manual maintenance)
type Campaign @entity {
    snapshots: [Snapshot!]! @derivedFrom(field: "campaign")
}
```

### Frontend Optimizations

```typescript
// ✅ Memoized expensive computations
const summary = useMemo(() => {
    return calculateSummary(performance);
}, [performance]);

// ✅ React Query caching
const { data } = useQuery({
    queryKey: ['performance', campaignId],
    queryFn: fetchPerformance,
    staleTime: 5 * 60 * 1000,  // 5 minutes
});

// ✅ Code splitting
const HeavyChart = dynamic(() => import('./HeavyChart'), {
    loading: () => <ChartSkeleton />
});
```

---

## Error Handling

### Backend Error Handling

```typescript
export function handleClaimReward(event: ClaimReward): void {
    // Check if campaign exists
    let campaign = Campaign.load(event.params.campaignId);
    if (campaign === null) {
        log.warning("Campaign not found: {}, skipping", [
            event.params.campaignId.toHex()
        ]);
        return;  // Gracefully skip this event
    }

    // Try contract call with fallback
    let symbolResult = Erc20.bind(token).try_symbol();
    let symbol = symbolResult.reverted ? "UNKNOWN" : symbolResult.value;
}
```

### Frontend Error Handling

```typescript
export function PerformanceDashboard({ campaignId }) {
    const { data, error, refetch } = useCampaignPerformance({ campaignId });

    // Error state
    if (error) {
        return (
            <ErrorState
                title="Failed to load performance data"
                message={error.message}
                onRetry={refetch}
            />
        );
    }

    // Empty state
    if (!data || data.snapshots.length === 0) {
        return <EmptyState message="No performance data yet" />;
    }

    return <Dashboard data={data} />;
}
```

---

## Testing

### Backend Testing (Matchstick)

```typescript
test("handleClaimReward updates participant metrics", () => {
    let event = createClaimRewardEvent(campaignId, receiver, amount);

    handleClaimReward(event);

    assert.entityCount("CampaignParticipant", 1);
    assert.fieldEquals(
        "CampaignParticipant",
        participantId.toHex(),
        "totalClaimed",
        "1000"
    );
});
```

### Frontend Testing (Jest + React Testing Library)

```typescript
test("renders participant data correctly", () => {
    const participant = {
        participant: "0x1234...5678",
        totalClaimed: "1000000000000000000",
        claimCount: 5,
    };

    render(<ParticipantCard participant={participant} />);

    expect(screen.getByText("0x1234...5678")).toBeInTheDocument();
    expect(screen.getByText("1.00")).toBeInTheDocument();
    expect(screen.getByText("5 claims")).toBeInTheDocument();
});
```

---

## Deployment

### Backend Deployment

```bash
# Deploy subgraph to multiple chains
cd subgraphs/metrom

# Mainnet
npm run deploy:mainnet

# Arbitrum
npm run deploy:arbitrum

# Base
npm run deploy:base
```

### Frontend Deployment

```bash
# Build and deploy Next.js app
cd packages/frontend

# Build
npm run build

# Deploy to Vercel
vercel deploy --prod
```

---

## Real-World Usage

### 1. User Claims Reward

```
User clicks "Claim" button
    ↓
Frontend sends transaction
    ↓
Smart contract emits ClaimReward event
    ↓
Subgraph indexes event (backend skill)
    ↓
Creates/updates CampaignParticipant entity
    ↓
Takes hourly snapshot
    ↓
Updates daily metrics
    ↓
Frontend refetches data (React Query)
    ↓
UI updates with new metrics
```

### 2. User Views Dashboard

```
User navigates to /campaigns/[id]/performance
    ↓
Server Component renders initial page (Next.js)
    ↓
Client Component fetches data (React Query)
    ↓
GraphQL query to The Graph
    ↓
Returns indexed data from subgraph
    ↓
Frontend transforms and displays:
    - Performance metrics (cards)
    - Hourly chart (Recharts)
    - Daily trends (Recharts)
    - Leaderboard (table)
```

---

## Benefits of Both Skills Working Together

1. **Type Safety End-to-End**
   - Backend: GraphQL schema enforces types
   - Frontend: TypeScript interfaces match schema

2. **Performance Optimization**
   - Backend: Efficient indexing and storage
   - Frontend: Memoization and caching

3. **Real-Time Updates**
   - Backend: Processes events as they happen
   - Frontend: Polls for updates with React Query

4. **Scalability**
   - Backend: Deployed to multiple chains
   - Frontend: Single app queries all chains

5. **Developer Experience**
   - Consistent patterns across stack
   - Clear separation of concerns
   - Testable at each layer

---

## Summary

The **backend-developer** and **senior-frontend-developer** skills work together to create a complete, production-ready feature:

- ✅ Backend indexes blockchain events in real-time
- ✅ Frontend displays data with interactive visualizations
- ✅ Type-safe throughout the stack
- ✅ Optimized for performance at each layer
- ✅ Accessible and responsive UI
- ✅ Deployable to 20+ chains
- ✅ Ready for production use

Both skills leverage your Metrom codebase patterns and best practices!
