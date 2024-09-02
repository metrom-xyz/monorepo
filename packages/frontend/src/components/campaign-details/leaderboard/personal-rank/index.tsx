import { useAccount } from "wagmi";
import { useMemo, useRef, useState } from "react";
import { Typography } from "@/src/ui/typography";
import { useTranslations } from "next-intl";
import type { AggregatedEnrichedDistributionData } from "@/src/hooks/useWatchDistributionData";
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
    distributionData?: AggregatedEnrichedDistributionData[];
}

export function PersonalRank({
    chain,
    loading,
    distributionData,
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

    const personalRank = useMemo(() => {
        if (!connectedAddress || !distributionData) return undefined;

        const position = distributionData.findIndex(
            (data) =>
                data.account.toLowerCase() === connectedAddress.toLowerCase(),
        );

        if (position === -1) {
            return undefined;
        }

        return {
            ...distributionData[position],
            position,
        };
    }, [connectedAddress, distributionData]);

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
                    {t("address")}
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
            ) : !personalRank ? (
                <Typography weight="medium" light>
                    {t("noRewards")}
                </Typography>
            ) : (
                <div className={styles.row}>
                    <div>
                        <Typography weight="medium" light>
                            # {personalRank.position}
                        </Typography>
                        <Typography weight="medium">
                            {numeral(personalRank.rank).format("0.[00]a")}%
                        </Typography>
                    </div>
                    <Typography weight="medium">
                        {shortenAddress(personalRank.account)}
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
                            {personalRank.details.map((enrichedData) => (
                                <div
                                    key={enrichedData.token.address}
                                    className={styles.rewardsPopoverRow}
                                >
                                    <div>
                                        <RemoteLogo
                                            chain={chain}
                                            size="sm"
                                            address={enrichedData.token.address}
                                            defaultText={
                                                enrichedData.token.symbol
                                            }
                                        />
                                        <Typography weight="medium">
                                            {enrichedData.token.symbol}
                                        </Typography>
                                    </div>
                                    <div>
                                        <Typography weight="medium">
                                            {numeral(
                                                enrichedData.amount,
                                            ).format("(0.0[0] a)")}
                                        </Typography>
                                        <Typography weight="medium">
                                            {enrichedData.usdValue
                                                ? numeral(
                                                      enrichedData.usdValue,
                                                  ).format("($ 0.00 a)")
                                                : "-"}
                                        </Typography>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Popover>
                    <div
                        ref={setRewardedAmountWrapper}
                        onMouseOver={handleRewardedAmountPopoverOpen}
                        onMouseLeave={handleRewardedAmountPopoverClose}
                    >
                        <Typography weight="medium">
                            {numeral(personalRank.amount).format("(0.0[0] a)")}
                        </Typography>
                        <Typography weight="medium" light>
                            {personalRank.usdValue
                                ? numeral(personalRank.usdValue).format(
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
