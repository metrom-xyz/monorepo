"use client";

import { Typography } from "@/src/ui/typography";
import { type Campaign } from "@metrom-xyz/sdk";
import type { AmmInfo } from "@/src/types";
import { PoolRemoteLogo } from "@/src/ui/pool-remote-logo";
import { useChainId } from "wagmi";

import styles from "./styles.module.css";

interface PoolProps {
    campaign: Campaign;
    amms: AmmInfo[];
}

export function Pool({ campaign, amms }: PoolProps) {
    const chainId = useChainId();
    const amm = amms.find((amm) => amm.slug === campaign.pool.amm)?.name || "-";

    return (
        <div className={styles.root}>
            <PoolRemoteLogo
                chain={chainId}
                token0={{
                    address: campaign.pool.token0.address,
                    defaultText: campaign.pool.token0.symbol,
                }}
                token1={{
                    address: campaign.pool.token1.address,
                    defaultText: campaign.pool.token1.symbol,
                }}
            />
            <div className={styles.titleContainer}>
                <Typography variant="lg" weight="medium" noWrap>
                    {amm} {campaign.pool.token0.symbol} /{" "}
                    {campaign.pool.token1.symbol}
                </Typography>
                <Typography variant="sm" weight="medium" light>
                    {campaign.pool.fee}%
                </Typography>
            </div>
        </div>
    );
}
