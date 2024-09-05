import { useAccount } from "wagmi";
import { useMemo } from "react";
import { Typography } from "@/src/ui/typography";
import { useTranslations } from "next-intl";
import type { DistributionBreakdown } from "@/src/hooks/useDistributionBreakdown";
import numeral from "numeral";
import { shortenAddress, SupportedChain } from "@metrom-xyz/sdk";
import { Button } from "@/src/ui/button";
import { WalletIcon } from "@/src/assets/wallet-icon";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { SkeletonRow } from "..";
import type { Address } from "viem";
import { RewardsBreakdown } from "../rewards-breakdown";

import styles from "./styles.module.css";

interface PersonalRankProps {
    chain?: SupportedChain;
    loading: boolean;
    distributionBreakdown?: DistributionBreakdown;
}

export function PersonalRank({
    chain,
    loading,
    distributionBreakdown,
}: PersonalRankProps) {
    const t = useTranslations("campaignDetails.leaderboard.personalRank");

    const {
        address: connectedAddress,
        isConnecting: accountConnecting,
        isReconnecting: accountReconnecting,
    } = useAccount();
    const { openConnectModal } = useConnectModal();

    const personalDistribution = useMemo(() => {
        if (!connectedAddress || !distributionBreakdown) return undefined;

        const personalDistributionIndex = Object.keys(
            distributionBreakdown.sortedDistributionsByAccount,
        ).findIndex((account) => account === connectedAddress.toLowerCase());

        return personalDistributionIndex < 0
            ? null
            : {
                  ...distributionBreakdown.sortedDistributionsByAccount[
                      connectedAddress.toLowerCase() as Address
                  ],
                  position: personalDistributionIndex + 1,
              };
    }, [connectedAddress, distributionBreakdown]);

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <Typography uppercase weight="medium" light variant="sm">
                    {t("yourRank")}
                </Typography>
                <Typography uppercase weight="medium" light variant="sm">
                    {t("account")}
                </Typography>
                <Typography uppercase weight="medium" light variant="sm">
                    {t("rewardsDistributed")}
                </Typography>
            </div>
            {loading || accountConnecting || accountReconnecting ? (
                <SkeletonRow />
            ) : !connectedAddress ? (
                <Button
                    onClick={openConnectModal}
                    size="xsmall"
                    icon={WalletIcon}
                    variant="secondary"
                >
                    {t("connect")}
                </Button>
            ) : !personalDistribution ? (
                <Typography weight="medium" light>
                    {t("noRewards")}
                </Typography>
            ) : (
                <div className={styles.row}>
                    <div>
                        <Typography weight="medium" light>
                            # {personalDistribution.position}
                        </Typography>
                        <Typography weight="medium">
                            {numeral(personalDistribution.percentage).format(
                                "0.[00]a",
                            )}
                            %
                        </Typography>
                    </div>
                    <Typography weight="medium">
                        {shortenAddress(connectedAddress)}
                    </Typography>
                    <RewardsBreakdown
                        chain={chain}
                        accrued={personalDistribution.accrued}
                        usdValue={personalDistribution.usdValue}
                    />
                </div>
            )}
        </div>
    );
}
