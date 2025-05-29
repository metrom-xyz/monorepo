import { useEffect, useMemo, useState } from "react";
import type { HookBaseParams } from "../types/hooks";
import { SERVICE_URLS } from "@metrom-xyz/sdk";
import { ENVIRONMENT } from "../commons/env";
import { formatUnits } from "viem";
import { useChainId } from "wagmi";
import type { Dayjs } from "dayjs";

interface UseDistributionsParams extends HookBaseParams {
    campaignId?: string;
    from?: Dayjs;
    to?: Dayjs;
}

type Deltas = Record<string, Record<string, bigint>>;

interface ProcessedDistribution {
    timestamp: number;
    deltas: Deltas;
}

interface UseDistributionsReturnValue {
    distributions: ProcessedDistribution[];
}

interface Hash {
    hash: string;
    timestamp: number;
}

interface Leaf {
    account: string;
    tokenAddress: string;
    amount: string;
}

interface DataHashesResponse {
    dataHashes: Hash[];
}

interface DistributionsResponse {
    timestamp: number;
    leaves: Leaf[];
}

export function useDistributions({
    campaignId,
    from,
    to,
}: UseDistributionsParams): UseDistributionsReturnValue {
    const [hashes, setHashes] = useState<Hash[]>();
    const [distributions, setDistributions] =
        useState<DistributionsResponse[]>();

    const chainId = useChainId();

    // TODO: enable once the data manager API has been deployed
    // useEffect(() => {
    //     const fetchHashes = async () => {
    //         if (!campaignId || !from || !to) return;

    //         try {
    //             const response = await fetch(
    //                 `${SERVICE_URLS[ENVIRONMENT].metrom}/data-hashes/${chainId}/${campaignId}?from${from.unix()}&to=${to.unix()}`,
    //                 {
    //                     method: "GET",
    //                     headers: {
    //                         "Content-Type": "application/json",
    //                     },
    //                 },
    //             );

    //             if (!response.ok) throw new Error(await response.text());

    //             const data = (await response.json()) as DataHashesResponse;
    //             data.dataHashes.sort((a, b) => b.timestamp - a.timestamp);

    //             setHashes(data.dataHashes);
    //         } catch (error) {
    //             console.error(`Could not fetch hashes from backend`, error);
    //         }
    //     };

    //     fetchHashes();
    // }, [from, to, chainId, campaignId]);

    useEffect(() => {
        // FIXME: remove mocked data
        const hashes = [
            {
                timestamp: "1748530806",
                hash: "0xabd1316b823820bb3470d00f048553db670072d839aea3f109b911d8d2c3b0d8",
            },
            {
                timestamp: "1748530806",
                hash: "0xb320c909ea9c73854368c82cbe70ed8aa3f3e1738681735f8f35001700c56736",
            },
        ];
        const fetchDistributions = async () => {
            if (!hashes) return;

            try {
                const distributions = await Promise.all(
                    hashes.map(
                        async ({ hash }): Promise<DistributionsResponse> => {
                            const response = await fetch(
                                `${SERVICE_URLS[ENVIRONMENT].dataManager}/data?hash=${hash.replace("0x", "")}`,
                                {
                                    method: "GET",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                },
                            );

                            return (await await response.json()) as DistributionsResponse;
                        },
                    ),
                );

                distributions.sort((a, b) => b.timestamp - a.timestamp);
                setDistributions(distributions);
            } catch (error) {
                console.error(
                    `Could not fetch distributions from data manager`,
                    error,
                );
            }
        };

        fetchDistributions();
    }, [hashes]);

    const processedDistributions: ProcessedDistribution[] = useMemo(() => {
        if (!distributions) return [];

        let initial: Deltas | undefined;

        return distributions.map(({ timestamp, leaves }) => {
            // Initialize initial positions
            if (!initial) {
                initial = leaves.reduce((prev, leaf) => {
                    if (!prev[leaf.account]) prev[leaf.account] = {};

                    if (!prev[leaf.account][leaf.tokenAddress])
                        prev[leaf.account][leaf.tokenAddress] = BigInt(
                            leaf.amount,
                        );
                    else
                        prev[leaf.account][leaf.tokenAddress] += BigInt(
                            leaf.amount,
                        );

                    return prev;
                }, {} as Deltas);

                return {
                    timestamp,
                    deltas: initial,
                };
            } else {
                const deltas: Deltas = {};

                for (const {
                    account,
                    tokenAddress,
                    amount: rawAmount,
                } of leaves) {
                    const amount = BigInt(rawAmount);
                    const previous = initial[account]?.[tokenAddress] ?? 0n;
                    const delta = amount - previous;

                    if (!deltas[account]) deltas[account] = {};
                    deltas[account][tokenAddress] = delta < 0n ? 0n : delta;

                    if (!initial[account]) initial[account] = {};

                    // Update initial position since we use that as the previous value
                    // for the next iterations
                    initial[account][tokenAddress] = amount;
                }

                return {
                    timestamp,
                    deltas,
                };
            }
        });
    }, [distributions]);

    console.log(
        "processed distributions",
        JSON.stringify(
            processedDistributions,
            (_key: string, value: any) =>
                typeof value === "bigint" ? formatUnits(value, 18) : value,
            4,
        ),
    );

    return { distributions: processedDistributions };
}
