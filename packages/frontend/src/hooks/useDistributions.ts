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
    percentage: OnChainAmount;
}

export interface ProcessedDistribution {
    timestamp: number;
    tokens: Record<string, OnChainAmount>;
    weights: Record<string, Record<string, Weight>>;
}

interface UseDistributionsReturnValue {
    distributions: ProcessedDistribution[];
    loading: boolean;
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
}: UseDistributionsParams): UseDistributionsReturnValue {
    const [hashes, setHashes] = useState<Hash[]>();
    const [loading, setLoading] = useState(false);
    const [distributions, setDistributions] =
        useState<DistributionsResponse[]>();

    const chainId = useChainId();
    const { campaign } = useCampaign({ id: campaignId, chainId });

    // TODO: enable once the data manager API has been deployed
    useEffect(() => {
        const fetchHashes = async () => {
            if (!campaignId || !from || !to) return;

            setLoading(true);

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
                setLoading(false);
            }
        };

        fetchHashes();
    }, [from, to, chainId, campaignId]);

    useEffect(() => {
        const fetchDistributions = async () => {
            if (!hashes) return;

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
                setLoading(false);
            }
        };

        fetchDistributions();
    }, [hashes]);

    const processed = useMemo(() => {
        if (!distributions || !campaign) return [];

        const tokensRegistry: Record<Address, Erc20Token> = {};
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

        return deltas.map((dist) => {
            const tokens: ProcessedDistribution["tokens"] = {};
            const weights: ProcessedDistribution["weights"] = {};

            const tokenTotals: Record<string, bigint> = {};

            for (const { tokenAddress: token, amount } of dist.leaves) {
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
            } of dist.leaves) {
                const delta = BigInt(amount);
                const total = tokenTotals[token];
                const decimals = tokensRegistry[token]?.decimals ?? 18;

                const formattedAmount = Number(formatUnits(delta, decimals));
                const rawPercentage =
                    total === 0n ? 0n : (delta * 1_000_000n) / total;
                const formattedPercentage = Number(rawPercentage) / 10_000;

                if (!weights[token]) weights[token] = {};
                weights[token][account] = {
                    amount: { raw: delta, formatted: formattedAmount },
                    percentage: {
                        raw: rawPercentage,
                        formatted: formattedPercentage,
                    },
                };
            }

            setLoading(false);

            return {
                timestamp: dist.timestamp,
                tokens,
                weights,
            };
        });
    }, [distributions, campaign]);

    // const processed: ProcessedDistribution[] = useMemo(() => {
    //     if (!distributions || !campaign) return [];

    //     // Initialize the tokens registry from the campaigns distributables
    // const tokensRegistry: Record<Address, Erc20Token> = {};
    // if (campaign.isDistributing(DistributablesType.Tokens)) {
    //     for (const { token } of campaign.distributables.list) {
    //         tokensRegistry[token.address] = token;
    //     }
    // }

    //     const processedDistributions: ProcessedDistribution[] = [];

    //     const overallTokensDelta: ProcessedDistribution["tokens"] = {};
    //     for (let i = 0; i < distributions.length; i++) {
    //         const distro = distributions[i];
    //         const previous = processedDistributions[i - 1];

    //         // Total of token distributed in a distro, aggregated by token address
    //         const tokens: ProcessedDistribution["tokens"] = {};
    //         // Account token weigths
    //         const weights: ProcessedDistribution["weights"] = {};

    //         for (const { amount, account, tokenAddress } of distro.leaves) {
    //             const erc20Token = tokensRegistry[tokenAddress];

    //             if (!tokens[tokenAddress])
    //                 tokens[tokenAddress] = { raw: 0n, formatted: 0 };

    //             tokens[tokenAddress].raw += BigInt(amount);
    //             tokens[tokenAddress].formatted += Number(
    //                 formatUnits(BigInt(amount), erc20Token.decimals),
    //             );

    //             if (!weights[tokenAddress]) weights[tokenAddress] = {};

    //             if (!weights[tokenAddress][account])
    //                 weights[tokenAddress][account] = {
    //                     amount: { raw: 0n, formatted: 0 },
    //                     percentage: { raw: 0n, formatted: 0 },
    //                 };

    //             weights[tokenAddress][account].amount.raw += BigInt(amount);
    //             weights[tokenAddress][account].amount.formatted += Number(
    //                 formatUnits(BigInt(amount), erc20Token.decimals),
    //             );
    //         }

    //         if (previous) {
    //             for (const [address, amount] of Object.entries(
    //                 previous.tokens,
    //             )) {
    //                 const rawDelta =
    //                     tokens[address].raw > amount.raw
    //                         ? tokens[address].raw - amount.raw
    //                         : amount.raw - tokens[address].raw;

    //                 const formattedDelta = Math.abs(
    //                     tokens[address].formatted - amount.formatted,
    //                 );

    //                 tokens[address].raw = rawDelta;
    //                 tokens[address].formatted = formattedDelta;

    //                 if (overallTokensDelta[address]) {
    //                     tokens[address].raw =
    //                         rawDelta - overallTokensDelta[address].raw;
    //                     tokens[address].formatted =
    //                         formattedDelta -
    //                         overallTokensDelta[address].formatted;
    //                 }

    //                 // Overall delta
    //                 if (!overallTokensDelta[address])
    //                     overallTokensDelta[address] = { raw: 0n, formatted: 0 };

    //                 overallTokensDelta[address].raw += rawDelta;
    //                 overallTokensDelta[address].formatted += formattedDelta;
    //             }

    //             // if (i === distributions.length - 1) {
    //             //     console.log("last", previous);
    //             // }

    //             for (const [tokenAddress, weight] of Object.entries(
    //                 previous.weights,
    //             )) {
    //                 for (const [
    //                     account,
    //                     { amount, percentage },
    //                 ] of Object.entries(weight)) {
    //                     const rawAmountDelta =
    //                         weight[account].amount.raw >
    //                         weights[tokenAddress][account].amount.raw
    //                             ? weight[account].amount.raw -
    //                               weights[tokenAddress][account].amount.raw
    //                             : weights[tokenAddress][account].amount.raw -
    //                               weight[account].amount.raw;

    //                     const formattedAmountDelta = Math.abs(
    //                         weight[account].amount.formatted -
    //                             weights[tokenAddress][account].amount.formatted,
    //                     );

    //                     weights[tokenAddress][account].amount.raw =
    //                         rawAmountDelta;
    //                     weights[tokenAddress][account].amount.formatted =
    //                         formattedAmountDelta;

    //                     const rawPercentage =
    //                         (rawAmountDelta * 1_000_000n) /
    //                         tokens[tokenAddress].raw;
    //                     const formattedPercentage =
    //                         (Number(rawPercentage) / 1_000_000) * 100;

    //                     weights[tokenAddress][account].percentage.raw =
    //                         rawPercentage;
    //                     weights[tokenAddress][account].percentage.formatted =
    //                         formattedPercentage;
    //                 }
    //             }
    //         } else {
    //             for (const [tokenAddress, weight] of Object.entries(weights)) {
    //                 for (const [
    //                     account,
    //                     { amount, percentage },
    //                 ] of Object.entries(weight)) {
    //                     const rawPercentage =
    //                         (amount.raw * 1_000_000n) /
    //                         tokens[tokenAddress].raw;
    //                     const formattedPercentage =
    //                         (Number(rawPercentage) / 1_000_000) * 100;

    //                     weights[tokenAddress][account].percentage.raw =
    //                         rawPercentage;
    //                     weights[tokenAddress][account].percentage.formatted =
    //                         formattedPercentage;
    //                 }
    //             }
    //         }

    //         processedDistributions.push({
    //             timestamp: distro.timestamp,
    //             tokens: { ...tokens },
    //             weights: { ...weights },
    //         });
    //     }

    //     console.log(overallTokensDelta);

    //     // for (const [index, distro] of distributions.entries()) {
    //     //     // Total of token distributed in a distro, aggregated by token address
    //     //     const tokens: ProcessedDistribution["tokens"] = {};
    //     //     // Account token weigths
    //     //     const weights: ProcessedDistribution["weights"] = {};

    //     //     const previous = processed[index - 1];

    //     //     for (const { amount, account, tokenAddress } of distro.leaves) {
    //     //         const erc20Token = tokensRegistry[tokenAddress];

    //     //         if (!tokens[tokenAddress])
    //     //             tokens[tokenAddress] = { raw: 0n, formatted: 0 };

    //     //         tokens[tokenAddress].raw += BigInt(amount);
    //     //         tokens[tokenAddress].formatted += Number(
    //     //             formatUnits(BigInt(amount), erc20Token.decimals),
    //     //         );

    //     //         if (!weights[tokenAddress]) weights[tokenAddress] = {};

    //     //         if (!weights[tokenAddress][account])
    //     //             weights[tokenAddress][account] = {
    //     //                 amount: { raw: 0n, formatted: 0 },
    //     //                 percentage: { raw: 0n, formatted: 0 },
    //     //             };

    //     //         weights[tokenAddress][account].amount.raw += BigInt(amount);
    //     //         weights[tokenAddress][account].amount.formatted += Number(
    //     //             formatUnits(BigInt(amount), erc20Token.decimals),
    //     //         );
    //     //     }

    //     //     if (previous) {
    //     //         console.log("previous", previous);
    //     //         console.log("current", previous);

    //     //         for (const [address, amount] of Object.entries(
    //     //             previous.tokens,
    //     //         )) {
    //     //             const rawDelta =
    //     //                 tokens[address].raw > amount.raw
    //     //                     ? tokens[address].raw - amount.raw
    //     //                     : amount.raw - tokens[address].raw;

    //     //             const formattedDelta = Math.abs(
    //     //                 tokens[address].formatted - amount.formatted,
    //     //             );

    //     //             tokens[address].raw = rawDelta;
    //     //             tokens[address].formatted = formattedDelta;
    //     //         }

    //     //         for (const [tokenAddress, weight] of Object.entries(
    //     //             previous.weights,
    //     //         )) {
    //     //             for (const [
    //     //                 account,
    //     //                 { amount, percentage },
    //     //             ] of Object.entries(weight)) {
    //     //                 const rawDelta =
    //     //                     weight[account].amount.raw > amount.raw
    //     //                         ? weight[account].amount.raw - amount.raw
    //     //                         : amount.raw - weight[account].amount.raw;

    //     //                 const formattedDelta = Math.abs(
    //     //                     weight[account].amount.formatted - amount.formatted,
    //     //                 );

    //     //                 weights[tokenAddress][account].amount.raw = rawDelta;
    //     //                 weights[tokenAddress][account].amount.formatted =
    //     //                     formattedDelta;

    //     //                 console.log(
    //     //                     "delta",
    //     //                     formattedDelta,
    //     //                     weight[account].amount.formatted,
    //     //                     amount.formatted,
    //     //                 );
    //     //             }
    //     //         }
    //     //     }

    //     //     // console.log("total per distro", tokens);

    //     //     // Store initial values
    //     //     // if (index === 0) {
    //     //     //     processed.push({
    //     //     //         timestamp: distro.timestamp,
    //     //     //         tokens,
    //     //     //         weights,
    //     //     //     });
    //     //     //     continue;
    //     //     // }

    //     //     // Get deltas for each token amounts
    //     //     // const previous = processed[index - 1];

    //     //     // if (previous) {
    //     //     //     for (const [token, amount] of Object.entries(previous.tokens)) {
    //     //     //         const rawDelta =
    //     //     //             tokens[token].raw > amount.raw
    //     //     //                 ? tokens[token].raw - amount.raw
    //     //     //                 : amount.raw - tokens[token].raw;

    //     //     //         const formattedDelta = Math.abs(
    //     //     //             tokens[token].formatted - amount.formatted,
    //     //     //         );

    //     //     //         tokens[token] = {
    //     //     //             raw: rawDelta,
    //     //     //             formatted: formattedDelta,
    //     //     //         };
    //     //     //     }

    //     //     //     for (const [token, weight] of Object.entries(
    //     //     //         previous.weights,
    //     //     //     )) {
    //     //     //         for (const [account, { amount }] of Object.entries(
    //     //     //             weight,
    //     //     //         )) {
    //     //     //             const rawDelta =
    //     //     //                 weight[account].amount.raw > amount.raw
    //     //     //                     ? weight[account].amount.raw - amount.raw
    //     //     //                     : amount.raw - weight[account].amount.raw;

    //     //     //             const formattedDelta = Math.abs(
    //     //     //                 weight[account].amount.formatted - amount.formatted,
    //     //     //             );

    //     //     //             weights[token][account].amount.raw = rawDelta;
    //     //     //             weights[token][account].amount.formatted =
    //     //     //                 formattedDelta;
    //     //     //         }
    //     //     //     }
    //     //     // }

    //     //     // Go through the weights to calculate the % weights relative to the total
    //     //     // distributed in the current distribution
    //     //     // for (const [token, weight] of Object.entries(weights)) {
    //     //     //     for (const [account, { amount }] of Object.entries(weight)) {
    //     //     //         const raw = (amount.raw * 1_000_000n) / tokens[token].raw;
    //     //     //         const formatted = (Number(raw) / 1_000_000) * 100;

    //     //     //         weights[token][account].percentage.raw = raw;
    //     //     //         weights[token][account].percentage.formatted = formatted;

    //     //     //         weights[token][account].amount.raw =
    //     //     //             (weights[token][account].amount.raw * raw) / 1_000_000n;
    //     //     //         weights[token][account].amount.formatted =
    //     //     //             (weights[token][account].amount.formatted * formatted) /
    //     //     //             100;
    //     //     //     }
    //     //     // }

    //     //     processed.push({ timestamp: distro.timestamp, tokens, weights });
    //     // }

    //     setLoading(false);

    //     console.log("processed", processedDistributions);

    //     return processedDistributions;
    // }, [distributions]);

    return { distributions: processed, loading };
}
