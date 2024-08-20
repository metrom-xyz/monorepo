"use client";

import { Typography } from "@/src/ui/typography";
import styles from "./styles.module.css";
import { formatDecimals, type Rewards } from "@metrom-xyz/sdk";
import dayjs from "dayjs";
import { RemoteLogo } from "@/src/ui/remote-logo";
import { useChainId } from "wagmi";

interface RewardsProps {
    from: number;
    to: number;
    rewards: Rewards;
}

export function Rewards({ from, to, rewards }: RewardsProps) {
    const chainId = useChainId();
    const perDayUsdValue = rewards.valueUsd
        ? rewards.valueUsd /
          dayjs.unix(to).diff(dayjs.unix(from), "days", false)
        : 0;

    return (
        <div className={styles.root}>
            {rewards.map((reward) => {
                return (
                    <RemoteLogo
                        key={reward.address}
                        chain={chainId}
                        address={reward.address}
                        defaultText={reward.symbol}
                    />
                );
            })}
            <Typography>${perDayUsdValue}</Typography>
        </div>
    );
}
