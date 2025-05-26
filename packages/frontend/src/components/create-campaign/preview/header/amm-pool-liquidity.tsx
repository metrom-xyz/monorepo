import { formatPercentage } from "@/src/utils/format";
import { Typography } from "@metrom-xyz/ui";
import { type AmmPoolLiquidityCampaignPreviewPayload } from "@/src/types/campaign";
import { useChainId } from "wagmi";
import { ProtocolType } from "@metrom-xyz/chains";
import { useMemo } from "react";
import { PoolRemoteLogo } from "@/src/components/pool-remote-logo";
import { useProtocolsInChain } from "@/src/hooks/useProtocolsInChain";

import styles from "./styles.module.css";

interface AmmPoolLiquidityProps {
    payload: AmmPoolLiquidityCampaignPreviewPayload;
}

export function AmmPoolLiquidity({ payload }: AmmPoolLiquidityProps) {
    const chainId = useChainId();
    const availableDexes = useProtocolsInChain({
        chainId,
        type: ProtocolType.Dex,
        active: true,
    });

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
