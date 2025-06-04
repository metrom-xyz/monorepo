import { useEffect, useMemo, useState } from "react";
import type { HookBaseParams } from "../types/hooks";
import {
    DistributablesType,
    SERVICE_URLS,
    type Erc20Token,
    type OnChainAmount,
} from "@metrom-xyz/sdk";
import { ENVIRONMENT } from "../commons/env";
import { useChainId } from "wagmi";
import type { Dayjs } from "dayjs";
import { useCampaign } from "./useCampaign";
import { type Address, formatUnits } from "viem";

interface UseDistributionsParams extends HookBaseParams {
    campaignId?: Address;
    from?: Dayjs;
    to?: Dayjs;
}

interface Weight {
    amount: OnChainAmount;
    amountChange: OnChainAmount;
    percentage: OnChainAmount;
}

export interface ProcessedDistribution {
    timestamp: number;
    tokens: Record<string, OnChainAmount>;
    weights: Record<string, Record<string, Weight>>;
}

interface UseDistributionsReturnValue {
    distributions: ProcessedDistribution[];
    loadingHashes: boolean;
    loadingDistributions: boolean;
    processing: boolean;
}

interface Hash {
    hash: string;
    timestamp: number;
}

interface Leaf {
    account: string;
    tokenAddress: Address;
    amount: string;
}

interface DataHashesResponse {
    dataHashes: Hash[];
}

interface DistributionsResponse {
    timestamp: number;
    leaves: Leaf[];
}

type Distribution = {
    timestamp: number;
    leaves: Leaf[];
};

type TokenMap = Record<string, Record<string, bigint>>;

function buildTokenMap(leaves: Leaf[]): TokenMap {
    const map: TokenMap = {};
    for (const { account, tokenAddress: token, amount } of leaves) {
        if (!map[token]) map[token] = {};
        if (!map[token][account]) map[token][account] = 0n;
        map[token][account] += BigInt(amount);
    }
    return map;
}

export function useDistributions({
    campaignId,
    from,
    to,
    enabled,
}: UseDistributionsParams): UseDistributionsReturnValue {
    const [hashes, setHashes] = useState<Hash[]>();
    const [loadingHashes, setLoadingHashes] = useState(false);
    const [loadingDistributions, setLoadingDistributions] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [distributions, setDistributions] =
        useState<DistributionsResponse[]>();

    const chainId = useChainId();
    const { campaign } = useCampaign({ id: campaignId, chainId });

    useEffect(() => {
        const fetchHashes = async () => {
            if (!campaignId || !from || !to || !enabled) return;

            setDistributions([]);
            setLoadingHashes(true);

            try {
                const response = await fetch(
                    `${SERVICE_URLS[ENVIRONMENT].metrom}/v1/data-hashes/${chainId}/${campaignId}?from=${from.unix()}&to=${to.unix()}`,
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

                setHashes(data.dataHashes);
            } catch (error) {
                console.error(`Could not fetch hashes from backend`, error);
            } finally {
                setLoadingHashes(false);
            }
        };

        fetchHashes();
    }, [from, to, chainId, campaignId, enabled]);

    useEffect(() => {
        const fetchDistributions = async () => {
            if (!hashes) return;

            setLoadingDistributions(true);

            try {
                const distributions = [];

                for (const { hash } of hashes) {
                    const response = await fetch(
                        `${SERVICE_URLS[ENVIRONMENT].dataManager}/data?hash=${hash.replace("0x", "")}`,
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
                }

                // TODO: do we still need this?
                // const distributions = await Promise.all(
                //     hashes.map(
                //         async ({ hash }): Promise<DistributionsResponse> => {
                //             const response = await fetch(
                //                 `${SERVICE_URLS[ENVIRONMENT].dataManager}/data?hash=${hash.replace("0x", "")}`,
                //                 {
                //                     method: "GET",
                //                     headers: {
                //                         "Content-Type": "application/json",
                //                     },
                //                 },
                //             );

                //             return (await await response.json()) as DistributionsResponse;
                //         },
                //     ),
                // );

                distributions.sort((a, b) => a.timestamp - b.timestamp);
                setDistributions(distributions);
            } catch (error) {
                console.error(
                    `Could not fetch distributions from data manager`,
                    error,
                );
            } finally {
                setLoadingDistributions(false);
            }
        };

        fetchDistributions();
    }, [hashes]);

    const processed = useMemo(() => {
        if (!distributions || !campaign) return [];

        setProcessing(true);

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
                const decimals =
                    tokensRegistry[token as Address]?.decimals ?? 18;
                const totalFormatted = Number(formatUnits(totalRaw, decimals));
                tokens[token] = { raw: totalRaw, formatted: totalFormatted };
            }

            for (const {
                account,
                tokenAddress: token,
                amount,
            } of distro.leaves) {
                const delta = BigInt(amount);
                const total = tokenTotals[token];
                const decimals = tokensRegistry[token]?.decimals ?? 18;

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

        setProcessing(false);
        return processed;
    }, [distributions, campaign]);

    return {
        distributions: processed,
        loadingHashes,
        loadingDistributions,
        processing,
    };
}
