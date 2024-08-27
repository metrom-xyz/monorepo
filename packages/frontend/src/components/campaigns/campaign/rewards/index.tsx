"use client";

import { Typography } from "@/src/ui/typography";
import { type Rewards } from "@metrom-xyz/sdk";
import dayjs from "dayjs";
import { RemoteLogo } from "@/src/ui/remote-logo";
import { useChainId } from "wagmi";
import numeral from "numeral";
import { Skeleton } from "@/src/ui/skeleton";

import styles from "./styles.module.css";

interface RewardsProps {
    from: number;
    to: number;
    rewards: Rewards;
}

export function Rewards({ from, to, rewards }: RewardsProps) {
    const chainId = useChainId();
    const daysDuration = dayjs
        .unix(to)
        .diff(dayjs.unix(from), "seconds", false);
    const perDayUsdValue =
        rewards.usdValue && daysDuration > 0
            ? rewards.usdValue / daysDuration
            : 0;

    return (
        <div className={styles.root}>
            <div className={styles.tokenIcons}>
                {rewards.map((reward, i) => {
                    return (
                        <div
                            key={reward.address}
                            className={styles.tokenIcon}
                            style={{ left: i * 10 }}
                        >
                            <RemoteLogo
                                chain={chainId}
                                address={reward.address}
                                defaultText={reward.symbol}
                            />
                        </div>
                    );
                })}
            </div>
            <Typography weight="medium">
                ${numeral(perDayUsdValue).format("0.0[0]")}
            </Typography>
        </div>
    );
}

export function SkeletonRewards() {
    return (
        <div className={styles.root}>
            <div className={styles.tokenIcons}>
                {new Array(5).fill(null).map((_, i) => {
                    return (
                        <div
                            key={i}
                            className={styles.tokenIcon}
                            style={{ left: i * 10 }}
                        >
                            <RemoteLogo loading />
                        </div>
                    );
                })}
            </div>
            <Skeleton width={40} />
        </div>
    );
}
