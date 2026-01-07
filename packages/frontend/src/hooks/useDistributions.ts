import { useMemo, useState } from "react";
import type { HookBaseParams } from "../types/hooks";
import {
    ChainType,
    DistributablesType,
    SERVICE_URLS,
    type Erc20Token,
} from "@metrom-xyz/sdk";
import { ENVIRONMENT } from "../commons/env";
import { useCampaign } from "./useCampaign";
import { type Address, type Hex, formatUnits } from "viem";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type {
    DataHashesResponse,
    Distribution,
    DistributionsResponse,
    DataHash,
    Leaf,
    ProcessedDistribution,
    TokenMap,
} from "../types/distributions";

export interface UseDistributionsParams extends HookBaseParams {
    chainId?: SupportedChain;
    chainType?: ChainType;
    campaignId?: Address;
    from?: number;
    to?: number;
}

export interface UseDistributionsReturnValue {
    distributions: ProcessedDistribution[];
    loading: boolean;
    progress: {
        total?: number;
        completed: number;
    };
    fetchDistributions: () => void;
}

const HASHES_CHUNK_SIZE = 50;

export function useDistributions({
    chainId,
    chainType,
    campaignId,
    from,
    to,
}: UseDistributionsParams): UseDistributionsReturnValue {
    const [completed, setCompleted] = useState(0);

    const { campaign } = useCampaign({ id: campaignId, chainId, chainType });

    const {
        data: hashes,
        isLoading: loadingHashes,
        isRefetching: refetchingHashes,
        refetch: fetchHashes,
    } = useQuery({
        queryKey: ["hashes", chainId, chainType, campaignId, from, to],
        placeholderData: keepPreviousData,
        queryFn: async ({ queryKey }) => {
            const [, chainId, chainType, campaignId, from, to] = queryKey as [
                string,
                SupportedChain | undefined,
                ChainType | undefined,
                Hex | undefined,
                number | undefined,
                number | undefined,
            ];

            if (!chainId || !chainType || !campaignId || !from || !to)
                return null;

            try {
                const response = await fetch(
                    `${SERVICE_URLS[ENVIRONMENT].metrom}/v2/data-hashes/${chainType}/${chainId}/${campaignId}?from=${from}&to=${to}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    },
                );

                if (!response.ok) throw new Error(await response.text());

                const data = (await response.json()) as DataHashesResponse;
                data.dataHashes.sort((a, b) => a.timestamp - b.timestamp);

                return data.dataHashes;
            } catch (error) {
                console.error(`Could not fetch hashes from backend`, error);
            }
        },
        refetchOnWindowFocus: false,
        staleTime: 60000,
        enabled: false,
    });

    const {
        data: distributions,
        isLoading: loadingDistributions,
        isRefetching: refetchingDistributions,
    } = useQuery({
        queryKey: ["distributions-data", hashes],
        queryFn: async ({ queryKey }) => {
            const [, hashes] = queryKey as [string, DataHash[] | undefined];

            setCompleted(0);

            if (!hashes) return null;

            try {
                const distributions: DistributionsResponse[] = [];

                const hashesChunks: DataHash[][] = [];
                for (let i = 0; i < hashes.length; i += HASHES_CHUNK_SIZE) {
                    hashesChunks.push(hashes.slice(i, i + HASHES_CHUNK_SIZE));
                }

                for (const chunk of hashesChunks) {
                    await Promise.all(
                        chunk.map(async (dataHash) => {
                            const response = await fetch(
                                `${SERVICE_URLS[ENVIRONMENT].dataManager}/data?hash=${dataHash.hash.replace("0x", "")}`,
                                {
                                    method: "GET",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                },
                            );

                            const data =
                                (await response.json()) as DistributionsResponse;
                            distributions.push(data);
                        }),
                    );

                    setCompleted((prev) => prev + chunk.length);
                    if (chunk.length === HASHES_CHUNK_SIZE)
                        await new Promise((resolve) =>
                            setTimeout(resolve, 500),
                        );
                }

                return distributions.sort((a, b) => a.timestamp - b.timestamp);
            } catch (error) {
                console.error(
                    `Could not fetch distributions from data manager`,
                    error,
                );
            }
        },
        refetchOnWindowFocus: false,
        staleTime: 60000,
        enabled: !!hashes,
    });

    const processed = useMemo(() => {
        if (!distributions || !campaign) return [];

        const tokensRegistry: Record<Address, Erc20Token> = {};
        // TODO: for points campaigns?
        if (campaign.isDistributing(DistributablesType.Tokens)) {
            for (const { token } of campaign.distributables.list) {
                tokensRegistry[token.address] = token;
            }
        }

        const deltas: Distribution[] = [];
        const overallDeltaMap: TokenMap = {};

        for (const dist of distributions) {
            const tokensMap = buildTokenMap(dist.leaves);
            const deltaMap: TokenMap = {};

            for (const [token, accounts] of Object.entries(tokensMap)) {
                if (!deltaMap[token]) deltaMap[token] = {};
                for (const [account, currentAmount] of Object.entries(
                    accounts,
                )) {
                    const prevAmount = overallDeltaMap[token]?.[account] || 0n;
                    deltaMap[token][account] = currentAmount - prevAmount;
                }
            }

            for (const [token, accounts] of Object.entries(tokensMap)) {
                if (!overallDeltaMap[token]) overallDeltaMap[token] = {};
                for (const [account, currentAmount] of Object.entries(
                    accounts,
                )) {
                    overallDeltaMap[token][account] = currentAmount;
                }
            }

            deltas.push({
                timestamp: dist.timestamp,
                leaves: Object.entries(deltaMap).flatMap(
                    ([tokenAddress, accounts]) =>
                        Object.entries(accounts).map(
                            ([account, deltaAmount]) => ({
                                account,
                                tokenAddress: tokenAddress as Address,
                                amount: deltaAmount.toString(),
                            }),
                        ),
                ),
            });
        }

        const processed = deltas.map((distro, index) => {
            const tokens: ProcessedDistribution["tokens"] = {};
            const weights: ProcessedDistribution["weights"] = {};

            const tokenTotals: Record<string, bigint> = {};

            for (const { tokenAddress: token, amount } of distro.leaves) {
                const delta = BigInt(amount);
                if (!tokenTotals[token]) tokenTotals[token] = 0n;
                tokenTotals[token] += delta;
            }

            for (const [token, totalRaw] of Object.entries(tokenTotals)) {
                if (!tokensRegistry[token as Address]) {
                    console.error(`Could not get token ${token} from registry`);
                    throw new Error(`Token ${token} missing from registry`);
                }

                const decimals = tokensRegistry[token as Address].decimals;
                const totalFormatted = Number(formatUnits(totalRaw, decimals));
                tokens[token] = {
                    amount: { raw: totalRaw, formatted: totalFormatted },
                    token: tokensRegistry[token as Address],
                };
            }

            for (const {
                account,
                tokenAddress: token,
                amount,
            } of distro.leaves) {
                if (!tokensRegistry[token]) {
                    console.error(`Could not get token ${token} from registry`);
                    throw new Error(`Token ${token} missing from registry`);
                }

                const delta = BigInt(amount);
                const total = tokenTotals[token];
                const decimals = tokensRegistry[token].decimals;

                const formattedAmount = Number(formatUnits(delta, decimals));
                const rawPercentage =
                    total === 0n ? 0n : (delta * 1_000_000n) / total;
                const formattedPercentage = Number(rawPercentage) / 10_000;

                if (!weights[token]) weights[token] = {};

                // Calculate the amount difference between the current and latest
                // delta (for the same token and account).
                const prevDelta = deltas[index - 1]
                    ? (deltas[index - 1].leaves.find(
                          (leaf) =>
                              leaf.account === account &&
                              leaf.tokenAddress === token,
                      )?.amount ?? delta)
                    : delta;

                const rawAmountChange = delta - BigInt(prevDelta);
                const formattedAmountChange = Number(
                    formatUnits(rawAmountChange, decimals),
                );

                weights[token][account] = {
                    amount: { raw: delta, formatted: formattedAmount },
                    amountChange: {
                        raw: rawAmountChange,
                        formatted: formattedAmountChange,
                    },
                    percentage: {
                        raw: rawPercentage,
                        formatted: formattedPercentage,
                    },
                };
            }

            return {
                timestamp: distro.timestamp,
                tokens,
                weights,
            };
        });

        return processed;
    }, [distributions, campaign]);

    return {
        distributions: processed,
        loading:
            loadingHashes ||
            refetchingHashes ||
            loadingDistributions ||
            refetchingDistributions,
        progress: {
            total: hashes?.length,
            completed,
        },
        fetchDistributions: fetchHashes,
    };
}

function buildTokenMap(leaves: Leaf[]): TokenMap {
    const map: TokenMap = {};
    for (const { account, tokenAddress: token, amount } of leaves) {
        if (!map[token]) map[token] = {};
        if (!map[token][account]) map[token][account] = 0n;
        map[token][account] += BigInt(amount);
    }
    return map;
}
