import { useEffect, useRef, useState } from "react";
import type { HookBaseParams } from "@/src/types/hooks";
import { useSolanaClient } from "@solana/react-hooks";

const BLOCK_WATCH_TIME_MS = 10000;

export function useWatchBlockNumberSvm({
    enabled = true,
}: HookBaseParams = {}) {
    const client = useSolanaClient();
    const clientRef = useRef(client);

    const [blockNumber, setBlockNumber] = useState<bigint | undefined>();

    useEffect(() => {
        if (!enabled) return;

        const fetchBlock = async () => {
            const slot = await clientRef.current.runtime.rpc
                .getBlockHeight({ commitment: "confirmed" })
                .send();
            setBlockNumber(slot);
        };

        fetchBlock();

        const interval = setInterval(() => {
            fetchBlock();
        }, BLOCK_WATCH_TIME_MS);

        return () => {
            clearInterval(interval);
        };
    }, [enabled]);

    return blockNumber;
}
