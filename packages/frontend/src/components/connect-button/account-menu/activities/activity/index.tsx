import { ClaimReward } from "@/src/assets/claim-reward";
import { NewCampaignIcon } from "@/src/assets/new-campaign-icon";
import { TargetType, type Activity } from "@metrom-xyz/sdk";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { Typography, Skeleton } from "@metrom-xyz/ui";
import { Link } from "@/src/i18n/routing";
import { formatAmount } from "@/src/utils/format";
import { trackFathomEvent } from "@/src/utils/fathom";
import { RemoteLogo } from "@/src/components/remote-logo";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { getTxExplorerLink } from "@/src/utils/dex";
import { useCampaign } from "@/src/hooks/useCampaign";
import { PoolRemoteLogo } from "@/src/components/pool-remote-logo";
import { useProtocolsInChain } from "@/src/hooks/useProtocolsInChain";
import { ProtocolType } from "@/src/types/protocol";

import styles from "./styles.module.css";
import classNames from "classnames";

interface ActivityProps extends Activity {
    chainId: number;
}

export function Activity({ chainId, transaction, payload }: ActivityProps) {
    const t = useTranslations("accountMenu.activities");

    const dexes = useProtocolsInChain(chainId, ProtocolType.Dex);
    const { campaign, loading } = useCampaign({
        chainId,
        id: payload.type === "create-campaign" ? payload.id : undefined,
    });

    const time = dayjs.unix(transaction.timestamp).to(dayjs(), true);
    const timeAgo = t("timeAgo", { time });
    const explorerLink = getTxExplorerLink(transaction.hash, chainId);

    const { Icon, title } =
        payload.type === "create-campaign"
            ? {
                  Icon: NewCampaignIcon,
                  title: t("createCampaign"),
              }
            : {
                  Icon: ClaimReward,
                  title: t("claimReward"),
              };

    const dex = campaign?.isTargeting(TargetType.AmmPoolLiquidity)
        ? dexes.find((dex) => {
              // FIXME: better way to handle this
              return dex.slug === campaign.target.pool.dex.slug;
          })
        : undefined;
    const DexLogo = dex?.logo;

    function handleActivityOnClick() {
        trackFathomEvent("CLICK_ACTIVITY");
    }

    return (
        <div className={styles.root}>
            <div className={styles.wrapper}>
                <div className={styles.iconWrapper}>
                    <Icon className={styles.icon} />
                </div>
                <div className={styles.bodyWrapper}>
                    <div className={styles.titleWrapper}>
                        <div className={styles.title}>
                            <Typography
                                light
                                weight="medium"
                                uppercase
                                size="sm"
                            >
                                {title}
                            </Typography>
                            {explorerLink && (
                                <a
                                    href={explorerLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <ArrowRightIcon
                                        className={styles.externalLinkIcon}
                                    />
                                </a>
                            )}
                        </div>
                        <Typography light truncate weight="medium" size="sm">
                            {timeAgo}
                        </Typography>
                    </div>
                    {payload.type === "create-campaign" ? (
                        <>
                            {!loading && campaign ? (
                                <Link
                                    href={`/campaigns/${chainId}/${payload.id}`}
                                    onClick={handleActivityOnClick}
                                >
                                    <div className={styles.campaignNameWrapper}>
                                        {DexLogo && (
                                            <DexLogo
                                                className={styles.dexIcon}
                                            />
                                        )}
                                        {campaign.target.type ===
                                            "amm-pool-liquidity" && (
                                            <PoolRemoteLogo
                                                size="sm"
                                                chain={campaign.chainId}
                                                tokens={campaign.target.pool.tokens.map(
                                                    (token) => ({
                                                        address: token.address,
                                                        defaultText:
                                                            token.symbol,
                                                    }),
                                                )}
                                            />
                                        )}
                                        <Typography
                                            weight="medium"
                                            truncate
                                            className={styles.seeCampaignLink}
                                        >
                                            {campaign.name}
                                        </Typography>
                                    </div>
                                </Link>
                            ) : (
                                <div className={styles.campaignNameWrapper}>
                                    <Skeleton
                                        width={16}
                                        circular
                                        className={styles.skeleton}
                                    />
                                    <PoolRemoteLogo
                                        size="sm"
                                        tokens={[
                                            { address: "0x1" },
                                            { address: "0x2" },
                                        ]}
                                        loading
                                        className={{ root: styles.skeleton }}
                                    />
                                    <Skeleton
                                        width={90}
                                        className={styles.skeleton}
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className={styles.claimRewardWrapper}>
                            <RemoteLogo
                                size="sm"
                                chain={chainId}
                                address={payload.token.address}
                                defaultText={payload.token.symbol}
                            />
                            <Typography noWrap>
                                {payload.token.symbol}
                            </Typography>
                            <Typography>
                                {formatAmount({
                                    amount: payload.amount.formatted,
                                })}
                            </Typography>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export function SkeletonActivity() {
    return (
        <div className={styles.root}>
            <div className={styles.wrapper}>
                <div
                    className={classNames(styles.iconWrapper, styles.loading)}
                />
                <div className={styles.bodyWrapper}>
                    <Skeleton
                        width={60}
                        size="sm"
                        className={styles.skeleton}
                    />
                    <Skeleton width={140} className={styles.skeleton} />
                </div>
            </div>
            <Skeleton width={50} className={styles.skeleton} />
        </div>
    );
}
