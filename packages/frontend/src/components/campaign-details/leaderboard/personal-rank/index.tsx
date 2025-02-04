import { useAccount } from "wagmi";
import { Card, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { SupportedChain } from "@metrom-xyz/contracts";
import { shortenAddress } from "@/src/utils/address";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { SkeletonRow, type PersonalRank } from "..";
import { RewardsBreakdown } from "../rewards-breakdown";
import { formatPercentage } from "@/src/utils/format";
import type { Rank } from "@/src/hooks/useLeaderboard";
import { PointsBreakdown } from "../points-breakdown";

import styles from "./styles.module.css";

interface PersonalRankProps {
    chain?: SupportedChain;
    loading: boolean;
    connectedAccountRank?: Rank;
}

export function PersonalRank({
    chain,
    loading,
    connectedAccountRank,
}: PersonalRankProps) {
    const t = useTranslations(
        "campaignDetails.leaderboard.connectedAccountRank",
    );

    const {
        address: connectedAddress,
        isConnecting: accountConnecting,
        isReconnecting: accountReconnecting,
    } = useAccount();
    const { openConnectModal } = useConnectModal();

    return (
        <Card className={styles.root}>
            <div className={styles.header}>
                <Typography uppercase weight="medium" light size="sm">
                    {t("yourRank")}
                </Typography>
                <Typography uppercase weight="medium" light size="sm">
                    {t("account")}
                </Typography>
                <Typography uppercase weight="medium" light size="sm">
                    {t("rewardsDistributed")}
                </Typography>
            </div>
            <div className={styles.rowWrapper}>
                {loading || accountConnecting || accountReconnecting ? (
                    <SkeletonRow size="lg" />
                ) : !connectedAddress ? (
                    <button
                        onClick={openConnectModal}
                        className={styles.connectWallet}
                    >
                        <Typography weight="medium" size="sm">
                            {t("connect")}
                        </Typography>
                    </button>
                ) : !connectedAccountRank ? (
                    <Typography weight="medium" light>
                        {t("noRewards")}
                    </Typography>
                ) : (
                    <div className={styles.row}>
                        <div>
                            <Typography size="lg" weight="medium" light>
                                # {connectedAccountRank.position}
                            </Typography>
                            <Typography size="lg" weight="medium">
                                {formatPercentage({
                                    percentage: connectedAccountRank.weight,
                                })}
                            </Typography>
                        </div>
                        <Typography size="lg" weight="medium">
                            {shortenAddress(connectedAddress)}
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
