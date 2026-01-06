# Metrom Frontend Patterns & Examples

This document contains detailed patterns and real-world examples specific to the Metrom DeFi frontend codebase.

---

## 1. Campaign Components

### Campaign Card Pattern

Campaign cards are the primary way users discover campaigns. Follow this structure:

```typescript
'use client';

import type { Campaign } from '@metrom-xyz/sdk';
import { Card, TokenSymbol, Badge } from '@metrom-xyz/ui';
import { formatTVL, formatTimeRemaining } from '@/lib/utils';
import Link from 'next/link';

interface CampaignCardProps {
  campaign: Campaign;
  locale: string;
}

export function CampaignCard({ campaign, locale }: CampaignCardProps) {
  const status = getCampaignStatus(campaign);

  return (
    <Link href={`/${locale}/campaigns/${campaign.chainType}/${campaign.chain}/${campaign.id}`}>
      <Card className="hover:shadow-lg transition-shadow">
        {/* Header: Project + Status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TokenSymbol symbol={campaign.pool.token0.symbol} size="md" />
            <TokenSymbol symbol={campaign.pool.token1.symbol} size="md" />
            <span className="font-semibold">{campaign.pool.name}</span>
          </div>
          <Badge variant={status}>{status}</Badge>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">TVL</p>
            <p className="text-lg font-bold">{formatTVL(campaign.tvl)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Rewards</p>
            <p className="text-lg font-bold">
              {campaign.rewards.map(r => (
                <span key={r.token.address}>
                  {r.amount} {r.token.symbol}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* Footer: Time remaining */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {formatTimeRemaining(campaign.endTime)}
          </p>
        </div>
      </Card>
    </Link>
  );
}

function getCampaignStatus(campaign: Campaign): 'active' | 'paused' | 'completed' {
  if (campaign.endTime < Date.now()) return 'completed';
  if (campaign.isPaused) return 'paused';
  return 'active';
}
```

### Campaign Filter Pattern

```typescript
'use client';

import { useState, useMemo } from 'react';
import type { Campaign } from '@metrom-xyz/sdk';
import { Select, Input, Button } from '@metrom-xyz/ui';

interface CampaignFiltersProps {
  campaigns: Campaign[];
  onFilteredChange: (filtered: Campaign[]) => void;
}

export function CampaignFilters({ campaigns, onFilteredChange }: CampaignFiltersProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'tvl' | 'rewards' | 'endTime'>('tvl');

  const filtered = useMemo(() => {
    let result = [...campaigns];

    // Search filter
    if (search) {
      result = result.filter(c =>
        c.pool.name.toLowerCase().includes(search.toLowerCase()) ||
        c.pool.token0.symbol.toLowerCase().includes(search.toLowerCase()) ||
        c.pool.token1.symbol.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Status filter
    if (status !== 'all') {
      result = result.filter(c => {
        if (status === 'active') return c.endTime > Date.now() && !c.isPaused;
        if (status === 'completed') return c.endTime <= Date.now();
        return true;
      });
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'tvl') return b.tvl - a.tvl;
      if (sortBy === 'rewards') return b.totalRewardValue - a.totalRewardValue;
      if (sortBy === 'endTime') return a.endTime - b.endTime;
      return 0;
    });

    return result;
  }, [campaigns, search, status, sortBy]);

  useEffect(() => {
    onFilteredChange(filtered);
  }, [filtered, onFilteredChange]);

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <Input
        placeholder="Search campaigns..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1"
      />

      <Select value={status} onValueChange={setStatus}>
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </Select>

      <Select value={sortBy} onValueChange={setSortBy}>
        <option value="tvl">Sort by TVL</option>
        <option value="rewards">Sort by Rewards</option>
        <option value="endTime">Sort by End Date</option>
      </Select>
    </div>
  );
}
```

---

## 2. Web3 Interaction Patterns

### Wallet Connection with Error Handling

```typescript
'use client';

import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { Button } from '@metrom-xyz/ui';
import { useTranslations } from 'next-intl';
import { chains } from '@metrom-xyz/chains';

export function WalletConnect() {
  const t = useTranslations('wallet');
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const currentChain = chains[chainId];
  const isUnsupportedChain = !currentChain;

  if (isConnecting) {
    return <Button disabled>{t('connecting')}</Button>;
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        {isUnsupportedChain ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-red-600 dark:text-red-400">
              {t('unsupportedChain')}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => switchChain({ chainId: 1 })} // Default to Ethereum
            >
              {t('switchNetwork')}
            </Button>
          </div>
        ) : (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {currentChain.name}
          </span>
        )}

        <Button variant="secondary" onClick={() => disconnect()}>
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {connectors.map(connector => (
        <Button
          key={connector.id}
          onClick={() => connect({ connector })}
          disabled={!connector.ready}
        >
          {t('connectWith', { wallet: connector.name })}
        </Button>
      ))}

      {connectError && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {connectError.message}
        </p>
      )}
    </div>
  );
}
```

### Transaction Pattern with Loading States

```typescript
'use client';

import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Button } from '@metrom-xyz/ui';
import { toast } from 'sonner';

interface ClaimButtonProps {
  campaignId: string;
  amount: bigint;
}

export function ClaimButton({ campaignId, amount }: ClaimButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { writeContract, data: hash, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleClaim = async () => {
    setIsSubmitting(true);

    try {
      await writeContract({
        address: METROM_CONTRACT_ADDRESS,
        abi: METROM_ABI,
        functionName: 'claim',
        args: [campaignId, amount],
      });

      toast.success('Claim submitted! Waiting for confirmation...');
    } catch (err) {
      toast.error('Failed to submit claim');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success('Claim successful!');
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  return (
    <Button
      onClick={handleClaim}
      disabled={isSubmitting || isConfirming}
      isLoading={isSubmitting || isConfirming}
    >
      {isConfirming ? 'Confirming...' : 'Claim Rewards'}
    </Button>
  );
}
```

---

## 3. Data Fetching Patterns

### Using Metrom React Hooks

```typescript
'use client';

import { useCampaigns, useLeaderboard } from '@metrom-xyz/react';
import { useChainId } from 'wagmi';
import { CampaignCard } from '@/components/CampaignCard';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { ErrorState } from '@/components/ErrorState';

export function ActiveCampaigns() {
  const chainId = useChainId();

  const {
    data: campaigns,
    isLoading,
    error,
    refetch
  } = useCampaigns({
    chainId,
    status: 'active',
    limit: 50
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <LoadingSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load campaigns"
        message={error.message}
        onRetry={refetch}
      />
    );
  }

  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          No active campaigns found
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {campaigns.map(campaign => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
}
```

### Custom API Client Usage

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { useMetromClient } from '@metrom-xyz/react';
import type { Campaign } from '@metrom-xyz/sdk';

export function useCampaignDetails(campaignId: string) {
  const client = useMetromClient();

  return useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: async () => {
      const campaign = await client.getCampaign(campaignId);
      return campaign;
    },
    enabled: !!campaignId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
  });
}
```

---

## 4. Form Patterns

### Campaign Creation Form

```typescript
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Select, DatePicker } from '@metrom-xyz/ui';
import { toast } from 'sonner';

const campaignSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  poolAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid address'),
  rewardToken: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid address'),
  rewardAmount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Must be a positive number'
  }),
  startTime: z.date().min(new Date(), 'Start time must be in the future'),
  endTime: z.date(),
}).refine((data) => data.endTime > data.startTime, {
  message: 'End time must be after start time',
  path: ['endTime'],
});

type CampaignFormData = z.infer<typeof campaignSchema>;

export function CreateCampaignForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
  });

  const onSubmit = async (data: CampaignFormData) => {
    setIsSubmitting(true);

    try {
      // Call API to create campaign
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create campaign');

      toast.success('Campaign created successfully!');

      // Redirect or reset form
    } catch (error) {
      toast.error('Failed to create campaign');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Campaign Name
        </label>
        <Input
          id="name"
          {...register('name')}
          placeholder="Enter campaign name"
          error={errors.name?.message}
        />
      </div>

      <div>
        <label htmlFor="poolAddress" className="block text-sm font-medium mb-2">
          Pool Address
        </label>
        <Input
          id="poolAddress"
          {...register('poolAddress')}
          placeholder="0x..."
          error={errors.poolAddress?.message}
        />
      </div>

      <div>
        <label htmlFor="rewardToken" className="block text-sm font-medium mb-2">
          Reward Token
        </label>
        <Input
          id="rewardToken"
          {...register('rewardToken')}
          placeholder="0x..."
          error={errors.rewardToken?.message}
        />
      </div>

      <div>
        <label htmlFor="rewardAmount" className="block text-sm font-medium mb-2">
          Reward Amount
        </label>
        <Input
          id="rewardAmount"
          {...register('rewardAmount')}
          type="number"
          step="0.000001"
          placeholder="0.0"
          error={errors.rewardAmount?.message}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium mb-2">
            Start Time
          </label>
          <DatePicker
            id="startTime"
            selected={watch('startTime')}
            onChange={(date) => setValue('startTime', date)}
            showTimeSelect
            error={errors.startTime?.message}
          />
        </div>

        <div>
          <label htmlFor="endTime" className="block text-sm font-medium mb-2">
            End Time
          </label>
          <DatePicker
            id="endTime"
            selected={watch('endTime')}
            onChange={(date) => setValue('endTime', date)}
            showTimeSelect
            error={errors.endTime?.message}
          />
        </div>
      </div>

      <Button
        type="submit"
        isLoading={isSubmitting}
        disabled={isSubmitting}
        className="w-full"
      >
        Create Campaign
      </Button>
    </form>
  );
}
```

---

## 5. Chart & Visualization Patterns

### KPI Chart with Recharts

```typescript
'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import dayjs from 'dayjs';
import numeral from 'numeral';

interface KPIChartProps {
  data: Array<{
    timestamp: number;
    tvl: number;
    volume: number;
  }>;
}

export function KPIChart({ data }: KPIChartProps) {
  const chartData = useMemo(() => {
    return data.map(point => ({
      date: dayjs(point.timestamp).format('MMM D'),
      TVL: point.tvl,
      Volume: point.volume,
    }));
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
        <p className="text-gray-600 dark:text-gray-400">No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={chartData}>
        <CartesianGrid
          strokeDasharray="3 3"
          className="stroke-gray-200 dark:stroke-gray-700"
        />
        <XAxis
          dataKey="date"
          className="text-gray-600 dark:text-gray-400"
        />
        <YAxis
          tickFormatter={(value) => numeral(value).format('$0.0a').toUpperCase()}
          className="text-gray-600 dark:text-gray-400"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
          formatter={(value: number) => numeral(value).format('$0,0.00')}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="TVL"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="Volume"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

---

## 6. List Virtualization Pattern

For long lists (leaderboards, transaction history):

```typescript
'use client';

import { FixedSizeList as List } from 'react-window';
import type { LeaderboardEntry } from '@metrom-xyz/sdk';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

export function VirtualizedLeaderboard({ entries }: LeaderboardProps) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const entry = entries[index];

    return (
      <div
        style={style}
        className="flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center gap-4">
          <span className="font-bold text-gray-400">#{index + 1}</span>
          <span className="font-mono text-sm">
            {entry.address.slice(0, 6)}...{entry.address.slice(-4)}
          </span>
        </div>
        <div className="text-right">
          <p className="font-semibold">{entry.points.toLocaleString()} pts</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {entry.rewards} rewards
          </p>
        </div>
      </div>
    );
  };

  return (
    <List
      height={600}
      itemCount={entries.length}
      itemSize={64}
      width="100%"
    >
      {Row}
    </List>
  );
}
```

---

## 7. Layout Patterns

### Responsive Grid Layout

```typescript
export function CampaignGrid({ campaigns }: { campaigns: Campaign[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {campaigns.map(campaign => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
}
```

### Page Layout with Sidebar

```typescript
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <nav className="space-y-2">
              {/* Navigation items */}
            </nav>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-9">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
```

---

## 8. Animation Patterns

### Subtle Transitions

```typescript
'use client';

import { motion } from 'motion/react';

export function FadeInCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
```

### Staggered List Animation

```typescript
'use client';

import { motion } from 'motion/react';

export function StaggeredList({ items }: { items: any[] }) {
  return (
    <div>
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {/* Item content */}
        </motion.div>
      ))}
    </div>
  );
}
```

---

## 9. Utility Function Patterns

### Currency Formatting

```typescript
// lib/utils/format.ts
import numeral from 'numeral';

export function formatCurrency(
  value: number | string,
  options?: {
    compact?: boolean;
    decimals?: number;
  }
): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) return '$0.00';

  if (options?.compact) {
    return numeral(numValue).format('$0,0.00a').toUpperCase();
  }

  const decimals = options?.decimals ?? 2;
  const format = `$0,0.${'0'.repeat(decimals)}`;

  return numeral(numValue).format(format);
}

// Usage
formatCurrency(1234567.89); // "$1,234,567.89"
formatCurrency(1234567.89, { compact: true }); // "$1.23M"
formatCurrency(0.00123456, { decimals: 6 }); // "$0.001235"
```

### Address Formatting

```typescript
// lib/utils/address.ts
export function shortenAddress(
  address: string,
  chars: number = 4
): string {
  if (!address) return '';
  if (address.length <= chars * 2 + 2) return address;

  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

// Usage
shortenAddress('0x1234567890abcdef1234567890abcdef12345678'); // "0x1234...5678"
```

---

These patterns represent the established conventions in the Metrom codebase. Always check existing implementations before creating new patterns, and maintain consistency across the application.
