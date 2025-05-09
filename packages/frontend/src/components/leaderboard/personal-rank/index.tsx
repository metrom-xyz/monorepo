import { useAccount } from "wagmi";
import { Card, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { SupportedChain } from "@metrom-xyz/contracts";
import { shortenAddress } from "@/src/utils/address";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { SkeletonRow, type PersonalRank } from "..";
import { RewardsBreakdown } from "../rewards-breakdown";
import { formatPercentage } from "@/src/utils/format";
import { PointsBreakdown } from "../points-breakdown";
import type { Rank } from "@/src/types/campaign";
import { useWindowSize } from "react-use";

import styles from "./styles.module.css";

export interface PersonalRankProps {
    chain?: SupportedChain;
    loading: boolean;
    connectedAccountRank?: Rank;
    messages?: {
        noRewards?: string;
    };
}

export function PersonalRank({
    chain,
    loading,
    connectedAccountRank,
    messages,
}: PersonalRankProps) {
    const t = useTranslations(
        "campaignDetails.leaderboard.connectedAccountRank",
    );

    const { width } = useWindowSize();
    const { address: connectedAddress } = useAccount();
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
                {loading ? (
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
                        {messages?.noRewards
                            ? messages.noRewards
                            : t("noRewards")}
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
