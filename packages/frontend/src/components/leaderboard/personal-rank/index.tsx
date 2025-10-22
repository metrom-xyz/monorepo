import { useAccount } from "@/src/hooks/useAccount";
import { Card, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { SupportedChain } from "@metrom-xyz/contracts";
import { shortenAddress } from "@/src/utils/address";
import { SkeletonRow, type PersonalRank } from "..";
import { RewardsBreakdown } from "../rewards-breakdown";
import { formatPercentage } from "@/src/utils/format";
import { PointsBreakdown } from "../points-breakdown";
import type { Rank } from "@/src/types/campaign";
import { useWindowSize } from "react-use";
import { useAppKit } from "@reown/appkit/react";
import { type Restrictions, RestrictionType } from "@metrom-xyz/sdk";
import { useMemo } from "react";
import type { Address } from "viem";

import styles from "./styles.module.css";
import { ConnectButton } from "../../connect-button";

export interface PersonalRankProps {
    chain?: SupportedChain;
    loading: boolean;
    restrictions?: Restrictions;
    connectedAccountRank?: Rank;
    messages?: {
        noRewards?: string;
    };
}

export function PersonalRank({
    chain,
    loading,
    restrictions,
    connectedAccountRank,
    messages,
}: PersonalRankProps) {
    const t = useTranslations(
        "campaignDetails.leaderboard.connectedAccountRank",
    );

    const { width } = useWindowSize();
    const { address: connectedAddress } = useAccount();
    const { open } = useAppKit();

    const blacklisted = useMemo(() => {
        if (
            !connectedAddress ||
            !restrictions ||
            restrictions.type === RestrictionType.Whitelist
        )
            return false;

        return restrictions.list.includes(
            connectedAddress.toLowerCase() as Address,
        );
    }, [connectedAddress, restrictions]);

    async function handleOnConnect() {
        await open();
    }

    return (
        <Card className={styles.root}>
            <div className={styles.header}>
                <Typography uppercase weight="medium" variant="tertiary"size="sm">
                    {t("yourRank")}
                </Typography>
                <Typography uppercase weight="medium" variant="tertiary"size="sm">
                    {t("account")}
                </Typography>
                <Typography uppercase weight="medium" variant="tertiary"size="sm">
                    {t("rewardsDistributed")}
                </Typography>
            </div>
            <div className={styles.rowWrapper}>
                {loading ? (
                    <SkeletonRow size="lg" />
                ) : !connectedAddress ? (
                    <ConnectButton
                        customComponent={
                            <button
                                onClick={handleOnConnect}
                                className={styles.connectWallet}
                            >
                                <Typography weight="medium" size="sm">
                                    {t("connect")}
                                </Typography>
                            </button>
                        }
                    />
                ) : blacklisted ? (
                    <Typography weight="medium" variant="tertiary">
                        {t("blacklisted")}
                    </Typography>
                ) : !connectedAccountRank ? (
                    <Typography weight="medium" variant="tertiary">
                        {messages?.noRewards
                            ? messages.noRewards
                            : t("noRewards")}
                    </Typography>
                ) : (
                    <div className={styles.row}>
                        <div>
                            <Typography size="lg" weight="medium" variant="tertiary">
                                # {connectedAccountRank.position}
                            </Typography>
                            <Typography size="lg" weight="medium">
                                {formatPercentage({
                                    percentage: connectedAccountRank.weight,
                                })}
                            </Typography>
                        </div>
                        <Typography size="lg" weight="medium">
                            {shortenAddress(connectedAddress, width > 640)}
                        </Typography>
                        {connectedAccountRank.distributed instanceof Array ? (
                            <RewardsBreakdown
                                chain={chain}
                                distributed={connectedAccountRank.distributed}
                                usdValue={connectedAccountRank.usdValue}
                            />
                        ) : (
                            <PointsBreakdown
                                distributed={connectedAccountRank.distributed}
                            />
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
}
