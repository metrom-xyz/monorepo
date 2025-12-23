import { useAccount } from "@/src/hooks/useAccount";
import { Pointer, Skeleton, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { SupportedChain } from "@metrom-xyz/contracts";
import { shortenAddress } from "@/src/utils/address";
import { type PersonalRank } from "..";
import { RewardsBreakdown } from "../rewards-breakdown";
import { formatPercentage } from "@/src/utils/format";
import { PointsBreakdown } from "../points-breakdown";
import type { Rank } from "@/src/types/campaign";
import { useWindowSize } from "react-use";
import { useAppKit } from "@reown/appkit/react";
import { type Restrictions, RestrictionType } from "@metrom-xyz/sdk";
import { useMemo } from "react";
import type { Address } from "viem";
import { ConnectButton } from "../../connect-button";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";

import styles from "./styles.module.css";

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

    const restricted = useMemo(() => {
        if (!connectedAddress || !restrictions) return false;

        return restrictions.list.includes(
            connectedAddress.toLowerCase() as Address,
        );
    }, [connectedAddress, restrictions]);

    const blacklist = restrictions?.type === RestrictionType.Blacklist;
    const whitelist = restrictions?.type === RestrictionType.Whitelist;

    async function handleOnConnect() {
        await open();
    }

    if (loading)
        return (
            <div className={styles.root}>
                <div className={styles.row}>
                    <Skeleton width={80} />
                    <Skeleton width={120} />
                    <Skeleton width={120} />
                </div>
            </div>
        );

    if (connectedAccountRank && connectedAccountRank.position <= 5) return null;

    if (!connectedAddress)
        return (
            <div className={styles.root}>
                <ConnectButton
                    customComponent={
                        <div
                            onClick={handleOnConnect}
                            className={styles.connectWallet}
                        >
                            <Typography weight="semibold">
                                {t("connect")}
                            </Typography>
                            <ArrowRightIcon className={styles.arrowIcon} />
                        </div>
                    }
                />
            </div>
        );

    if (restricted && blacklist)
        return (
            <div className={styles.root}>
                <div className={styles.restricted}>
                    <div className={styles.text}>
                        <Typography weight="medium" variant="tertiary">
                            #
                        </Typography>
                        <Typography weight="medium">
                            {t("notEligible")}
                        </Typography>
                    </div>
                    <Pointer
                        size="sm"
                        uppercase
                        anchor={width < 640 ? "top" : "left"}
                        color="red"
                        text={t("blocked")}
                    />
                </div>
            </div>
        );

    if (restricted && whitelist)
        return (
            <div className={styles.root}>
                <div className={styles.restricted}>
                    <div className={styles.text}>
                        <Typography weight="medium" variant="tertiary">
                            #
                        </Typography>
                        <Typography weight="medium">{t("eligible")}</Typography>
                    </div>
                    <Pointer
                        size="sm"
                        uppercase
                        anchor={width < 640 ? "top" : "left"}
                        color="green"
                        text={t("allowed")}
                    />
                </div>
            </div>
        );

    return (
        <div className={styles.root}>
            {restricted && restrictions?.type === RestrictionType.Blacklist ? (
                <Typography weight="medium" variant="tertiary">
                    {t("notEligible")}
                </Typography>
            ) : !connectedAccountRank ? (
                <Typography weight="medium" variant="tertiary">
                    {messages?.noRewards ? messages.noRewards : t("noRewards")}
                </Typography>
            ) : (
                <div className={styles.row}>
                    <div>
                        <Typography
                            size="lg"
                            weight="medium"
                            variant="tertiary"
                        >
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
    );
}
