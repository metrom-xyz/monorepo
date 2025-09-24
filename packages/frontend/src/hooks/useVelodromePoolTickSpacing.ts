import { useReadContract } from "wagmi";
import type { HookBaseParams } from "../types/hooks";
import { velodromPoolAbi } from "../commons/abi";
import type { AmmPool } from "@metrom-xyz/sdk";

interface UsePoolTickSpacing extends HookBaseParams {
    pool?: AmmPool;
}

export function useVelodromePoolTickSpacing({
    pool,
    enabled,
}: UsePoolTickSpacing) {
    const { data: tickSpacing, isLoading: loading } = useReadContract({
        abi: velodromPoolAbi,
        address: pool?.id,
        chainId: pool?.chainId,
        functionName: "tickSpacing",
        query: { enabled: enabled && !!pool },
    });

    return { tickSpacing, loading };
}
