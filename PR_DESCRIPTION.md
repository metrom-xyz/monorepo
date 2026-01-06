# PR: Add Campaign Performance Tracking

## Summary

Adds campaign performance tracking to the Metrom subgraph to enable analytics dashboards and historical performance data.

## What Changed

### Backend (Subgraph)

#### Schema Changes (`subgraphs/metrom/schema.graphql`)
- Added `CampaignSnapshot` entity for hourly performance snapshots
- Added `CampaignParticipant` entity to track individual participant metrics
- Added `CampaignDailyMetrics` entity for daily aggregated statistics
- Updated `RewardsCampaign` to include derived relationships

#### Helper Functions (`subgraphs/metrom/src/commons.ts`)
- Added constants: `SNAPSHOT_INTERVAL`, `DAY_IN_SECONDS`
- Added ID generation functions: `getSnapshotId`, `getParticipantId`, `getDailyMetricsId`
- Added `getOrCreateParticipant` helper
- Added `getOrCreateDailyMetrics` helper

#### Performance Module (`subgraphs/metrom/src/performance.ts`) - NEW FILE
- `updateParticipantMetrics` - Updates participant claim metrics
- `updateDailyMetrics` - Updates daily aggregated metrics
- `shouldTakeSnapshot` - Determines if snapshot should be taken
- `takeCampaignSnapshot` - Creates hourly performance snapshot

## Features Enabled

1. **Hourly Snapshots** - Track campaign metrics every hour for time-series charts
2. **Participant Tracking** - Monitor individual user claims and activity
3. **Daily Metrics** - Aggregate daily statistics for dashboard KPIs
4. **Historical Data** - Enable trend analysis and performance comparison

## Use Cases

- Analytics dashboards showing campaign performance over time
- Leaderboards displaying top participants
- Performance charts (TVL, claims, participants)
- Campaign effectiveness analysis

## Testing

### Manual Testing
- [ ] Build subgraph successfully
- [ ] Deploy to testnet
- [ ] Verify entities created on claim events
- [ ] Query snapshots and metrics via GraphQL

### Automated Testing
- [ ] Add unit tests for helper functions
- [ ] Add tests for entity creation
- [ ] Verify snapshot timing logic

## Breaking Changes

None. This is purely additive - adds new entities without modifying existing ones.

## Deployment Notes

- Requires subgraph redeployment to all chains
- No migration needed (historical data won't be backfilled)
- Snapshots start from deployment time forward

## Performance Considerations

- Snapshots taken every hour (not every event) for efficiency
- Single save per entity to minimize database operations
- Used `@derivedFrom` to avoid manual array maintenance
- Conditional snapshot logic to avoid duplicates

## TODO (Future Work)

- [ ] Add frontend components to display performance data
- [ ] Implement CSV export for analytics
- [ ] Add email alerts for performance milestones
- [ ] Backfill historical snapshots (optional)

## Related Issues

Closes #XXX

## Checklist

- [x] Code follows project patterns
- [x] GraphQL schema uses correct immutability flags
- [x] BigInt operations use methods (not operators)
- [x] Helper functions follow getOrCreate pattern
- [x] No type errors
- [ ] Tests added
- [ ] Documentation updated
- [ ] Deployed to testnet and verified
