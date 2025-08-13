import { useEffect, useState } from "react";
import type { HookBaseParams } from "@/src/types/hooks";
import { useClients } from "@aptos-labs/react";

const BLOCk_WATCH_TIME_MS = 15000;

export function useWatchBlockNumberMvm({
    enabled = true,
}: HookBaseParams = {}) {
    const { aptos } = useClients();

    const [blockNumber, setBlockNumber] = useState<bigint | undefined>();

    useEffect(() => {
        if (!enabled) return;

        const fetchBlock = async () => {
            const { block_height } = await aptos.getLedgerInfo();
            setBlockNumber(BigInt(block_height));
        };

        fetchBlock();

        const interval = setInterval(() => {
            fetchBlock();
        }, BLOCk_WATCH_TIME_MS);

        return () => {
            clearInterval(interval);
        };
    }, [aptos, enabled]);

    return blockNumber;
}
