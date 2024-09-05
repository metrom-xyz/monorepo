import { useAccount } from "wagmi";
import { useMemo, useRef, useState } from "react";
import { Typography } from "@/src/ui/typography";
import { useTranslations } from "next-intl";
import type { DistributionBreakdown } from "@/src/hooks/useDistributionBreakdown";
import numeral from "numeral";
import { SupportedChain, shortenAddress } from "@metrom-xyz/sdk";
import { Button } from "@/src/ui/button";
import { WalletIcon } from "@/src/assets/wallet-icon";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Popover } from "@/src/ui/popover";
import { SkeletonRow } from "..";

import styles from "./styles.module.css";
import { RemoteLogo } from "@/src/ui/remote-logo";

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
    const [rewardsPopoverOpen, setRewardsPopoverOpen] = useState(false);
    const [rewardedAmountWrapper, setRewardedAmountWrapper] =
        useState<HTMLDivElement | null>(null);
    const rewardsPopoverRef = useRef<HTMLDivElement>(null);

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
                      connectedAddress
                  ],
                  position: personalDistributionIndex + 1,
              };
    }, [connectedAddress, distributionBreakdown]);

    function handleRewardedAmountPopoverOpen() {
        setRewardsPopoverOpen(true);
    }

    function handleRewardedAmountPopoverClose() {
        setRewardsPopoverOpen(false);
    }

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
                    <Popover
                        placement="top"
                        anchor={rewardedAmountWrapper}
                        open={rewardsPopoverOpen}
                        ref={rewardsPopoverRef}
                    >
                        <div className={styles.rewardsPopover}>
                            <Typography
                                uppercase
                                weight="medium"
                                light
                                variant="sm"
                            >
                                {t("rewardsDistributed")}
                            </Typography>
                            {personalDistribution.accrued.map(
                                (accruedReward) => (
                                    <div
                                        key={accruedReward.address}
                                        className={styles.rewardsPopoverRow}
                                    >
                                        <div>
                                            <RemoteLogo
                                                chain={chain}
                                                size="sm"
                                                address={accruedReward.address}
                                                defaultText={
                                                    accruedReward.symbol
                                                }
                                            />
                                            <Typography weight="medium">
                                                {accruedReward.symbol}
                                            </Typography>
                                        </div>
                                        <div>
                                            <Typography weight="medium">
                                                {numeral(
                                                    accruedReward.amount,
                                                ).format("(0.0[0] a)")}
                                            </Typography>
                                            <Typography weight="medium">
                                                {accruedReward.usdValue
                                                    ? numeral(
                                                          accruedReward.usdValue,
                                                      ).format("($ 0.00 a)")
                                                    : "-"}
                                            </Typography>
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    </Popover>
                    <div
                        ref={setRewardedAmountWrapper}
                        onMouseOver={handleRewardedAmountPopoverOpen}
                        onMouseLeave={handleRewardedAmountPopoverClose}
                        className={styles.rankWrapper}
                    >
                        <Typography weight="medium" light>
                            {personalDistribution.usdValue
                                ? numeral(personalDistribution.usdValue).format(
                                      "($ 0.00 a)",
                                  )
                                : "-"}
                        </Typography>
                    </div>
                </div>
            )}
        </div>
    );
}
