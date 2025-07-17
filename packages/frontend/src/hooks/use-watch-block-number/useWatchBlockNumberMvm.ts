import { useEffect, useState } from "react";
import type { HookBaseParams } from "@/src/types/hooks";
import { aptosClient } from "@/src/components/client-providers";

interface BlockMetadataTransactionsQueryResult {
    metadata: [{ block: number }];
}

const BLOCk_WATCH_TIME_MS = 15000;

export function useWatchBlockNumberMvm({
    enabled = true,
}: HookBaseParams = {}) {
    const [blockNumber, setBlockNumber] = useState<number | undefined>();

    useEffect(() => {
        if (!enabled) return;

        const fetchBlock = async () => {
            const { metadata } =
                await aptosClient.queryIndexer<BlockMetadataTransactionsQueryResult>(
                    {
                        query: {
                            query: `query block {
                                metadata: block_metadata_transactions(
                                    order_by: {block_height: desc}
                                    limit: 1
                                ) {
                                    block: block_height
                                }
                            }`,
                        },
                    },
                );

            setBlockNumber(metadata[0].block);
        };

        fetchBlock();

        const interval = setInterval(() => {
            fetchBlock();
        }, BLOCk_WATCH_TIME_MS);

        return () => {
            clearInterval(interval);
        };
    }, [enabled]);

    return blockNumber;
}
