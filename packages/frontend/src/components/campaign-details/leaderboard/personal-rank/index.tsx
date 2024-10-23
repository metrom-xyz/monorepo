import { useAccount } from "wagmi";
import { Typography, Button } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { SupportedChain } from "@metrom-xyz/contracts";
import { shortenAddress } from "@/src/utils/address";
import { WalletIcon } from "@/src/assets/wallet-icon";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { SkeletonRow, type PersonalRank } from "..";
import { RewardsBreakdown } from "../rewards-breakdown";
import { formatPercentage } from "@/src/utils/format";

import styles from "./styles.module.css";

interface PersonalRankProps {
    chain?: SupportedChain;
    loading: boolean;
    personalRank?: PersonalRank;
}

export function PersonalRank({
    chain,
    loading,
    personalRank,
}: PersonalRankProps) {
    const t = useTranslations("campaignDetails.leaderboard.personalRank");

    const {
        address: connectedAddress,
        isConnecting: accountConnecting,
        isReconnecting: accountReconnecting,
    } = useAccount();
    const { openConnectModal } = useConnectModal();

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
                            {formatPercentage(personalRank.percentage)}
                        </Typography>
                    </div>
                    <Typography weight="medium">
                        {shortenAddress(connectedAddress)}
                    </Typography>
                    <RewardsBreakdown
                        chain={chain}
                        accrued={personalRank.accrued}
                        usdValue={personalRank.usdValue}
                    />
                </div>
            )}
        </div>
    );
}
