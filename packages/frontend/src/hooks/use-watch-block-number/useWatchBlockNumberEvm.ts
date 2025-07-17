import { useEffect, useState } from "react";
import { getBlockNumber } from "@wagmi/core";
import { useConfig } from "wagmi";
import type { HookBaseParams } from "@/src/types/hooks";

const BLOCk_WATCH_TIME_MS = 5000;

export function useWatchBlockNumberEvm({
    enabled = true,
}: HookBaseParams = {}) {
    const config = useConfig();

    const [blockNumber, setBlockNumber] = useState<bigint | undefined>();

    useEffect(() => {
        if (!enabled) return;

        const fetchBlock = async () => {
            const blockNumber = await getBlockNumber(config, {
                cacheTime: BLOCk_WATCH_TIME_MS,
            });

            setBlockNumber(blockNumber);
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
