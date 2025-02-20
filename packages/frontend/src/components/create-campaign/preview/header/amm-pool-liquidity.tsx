import { formatPercentage } from "@/src/utils/format";
import { PoolRemoteLogo, Typography } from "@metrom-xyz/ui";
import {
    ProtocolType,
    type AmmPoolLiquidityCampaignPreviewPayload,
} from "@/src/types/common";
import { useChainId } from "wagmi";
import { useProtocolsInChain } from "@/src/hooks/useProtocolsInChain";
import { useMemo } from "react";

import styles from "./styles.module.css";

interface AmmPoolLiquidityProps {
    payload: AmmPoolLiquidityCampaignPreviewPayload;
}

export function AmmPoolLiquidity({ payload }: AmmPoolLiquidityProps) {
    const chainId = useChainId();
    const availableDexes = useProtocolsInChain(chainId, ProtocolType.Dex);

    const selectedDex = useMemo(() => {
        return availableDexes.find(
            ({ slug }) => slug === payload.pool.dex.slug,
        );
    }, [availableDexes, payload]);

    return (
        <div className={styles.titleContainer}>
            <PoolRemoteLogo
                chain={chainId}
                size="xl"
                tokens={payload.pool.tokens.map((token) => ({
                    address: token.address,
                    defaultText: token.symbol,
                }))}
            />
            <Typography size="xl4" weight="medium" noWrap truncate>
                {selectedDex?.name}{" "}
                {payload.pool.tokens.map((token) => token.symbol).join(" / ")}
            </Typography>
            {payload.pool.fee && (
                <Typography size="lg" weight="medium" light>
                    {formatPercentage({
                        percentage: payload.pool.fee,
                        keepDust: true,
                    })}
                </Typography>
            )}
        </div>
    );
}
