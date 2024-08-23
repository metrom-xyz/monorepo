"use client";

import { Typography } from "@/src/ui/typography";
import { type Rewards } from "@metrom-xyz/sdk";
import dayjs from "dayjs";
import { RemoteLogo } from "@/src/ui/remote-logo";
import { useChainId } from "wagmi";

import styles from "./styles.module.css";

interface RewardsProps {
    from: number;
    to: number;
    rewards: Rewards;
}

export function Rewards({ from, to, rewards }: RewardsProps) {
    const chainId = useChainId();
    const daysLeft = dayjs.unix(to).diff(dayjs.unix(from), "days", false);
    const perDayUsdValue =
        rewards.valueUsd && daysLeft > 0 ? rewards.valueUsd / daysLeft : 0;

    return daysLeft > 0 && perDayUsdValue === 0 ? (
        <Typography weight="medium">-</Typography>
    ) : (
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
            {perDayUsdValue > 0 && <Typography>${perDayUsdValue}</Typography>}
        </div>
    );
}
