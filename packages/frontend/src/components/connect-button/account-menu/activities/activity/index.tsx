import { TargetType, type Activity } from "@metrom-xyz/sdk";
import { useTranslations } from "next-intl";
import { Typography, Skeleton } from "@metrom-xyz/ui";
import { Link } from "@/src/i18n/routing";
import { formatAmount } from "@/src/utils/format";
import { trackFathomEvent } from "@/src/utils/fathom";
import { RemoteLogo } from "@/src/components/remote-logo";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { getTxExplorerLink } from "@/src/utils/explorer";
import { useCampaign } from "@/src/hooks/useCampaign";
import { PoolRemoteLogo } from "@/src/components/pool-remote-logo";
import { ProtocolType } from "@metrom-xyz/chains";
import { useProtocolsInChain } from "@/src/hooks/useProtocolsInChain";
import { CHAIN_TYPE } from "@/src/commons";
import { useMemo } from "react";
import { ProtocolLogo } from "@/src/components/protocol-logo";
import classNames from "classnames";
import { Action } from "@/src/components/campaigns/campaign/action";

import styles from "./styles.module.css";

interface ActivityProps extends Activity {
    chainId: number;
}

export function Activity({ chainId, transaction, payload }: ActivityProps) {
    const t = useTranslations("accountMenu.activities");

    const { campaign, loading } = useCampaign({
        chainId,
        chainType: CHAIN_TYPE,
        id: payload.type === "create-campaign" ? payload.id : undefined,
    });

    const dexes = useProtocolsInChain({
        chainId: chainId,
        type: ProtocolType.Dex,
    });
    const liquityV2s = useProtocolsInChain({
        chainId: chainId,
        type: ProtocolType.LiquityV2,
    });
    const aaveV3s = useProtocolsInChain({
        chainId: chainId,
        type: ProtocolType.AaveV3,
    });

    const explorerLink = getTxExplorerLink(transaction.id, chainId);

    const title =
        payload.type === "create-campaign"
            ? t("campaignCreated")
            : t("claimed");

    const campaignTargetProtocol = useMemo(() => {
        if (!campaign) return undefined;

        const protocols = [...dexes, ...liquityV2s, ...aaveV3s];
        return protocols.find(({ slug }) => {
            if (campaign?.isTargeting(TargetType.AmmPoolLiquidity))
                return slug === campaign.target.pool.dex.slug;
            if (
                campaign?.isTargeting(TargetType.LiquityV2Debt) ||
                campaign?.isTargeting(TargetType.LiquityV2StabilityPool) ||
                campaign?.isTargeting(TargetType.AaveV3Borrow) ||
                campaign?.isTargeting(TargetType.AaveV3Supply) ||
                campaign?.isTargeting(TargetType.AaveV3NetSupply)
            )
                return slug === campaign.target.brand.slug;
        });
    }, [campaign, dexes, liquityV2s, aaveV3s]);

    function handleActivityOnClick() {
        trackFathomEvent("CLICK_ACTIVITY");
    }

    const createCampaign = payload.type === "create-campaign";

    return (
        <div
            className={classNames(styles.root, {
                [styles.createCampaign]: createCampaign,
            })}
        >
            <div className={styles.leftContent}>
                <Typography weight="medium" size="sm">
                    {title}
                </Typography>
                <ArrowRightIcon className={styles.arrow} />
            </div>
            <div className={styles.rightContent}>
                {createCampaign ? (
                    <>
                        {!loading && campaign ? (
                            <Link
                                href={`/campaigns/${campaign.chainType}/${chainId}/${payload.id}`}
                                onClick={handleActivityOnClick}
                            >
                                <div className={styles.details}>
                                    <ProtocolLogo
                                        size="xs"
                                        protocol={campaignTargetProtocol}
                                    />
                                    <Action
                                        campaign={campaign}
                                        nameSize="sm"
                                        logoSize="xs"
                                        hideChips
                                        className={styles.action}
                                    />
                                </div>
                            </Link>
                        ) : (
                            <div
                                className={classNames(
                                    styles.details,
                                    styles.loading,
                                )}
                            >
                                <Skeleton
                                    width={16}
                                    circular
                                    className={styles.skeleton}
                                />
                                <PoolRemoteLogo
                                    size="xs"
                                    tokens={[
                                        { address: "0x1" },
                                        { address: "0x2" },
                                    ]}
                                    loading
                                    className={{ root: styles.skeleton }}
                                />
                                <Skeleton
                                    size="sm"
                                    width={90}
                                    className={styles.skeleton}
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <div className={styles.details}>
                        <RemoteLogo
                            size="xs"
                            chain={chainId}
                            address={payload.token.address}
                            defaultText={payload.token.symbol}
                        />
                        <Typography size="xs" weight="medium">
                            {payload.token.symbol}
                        </Typography>
                        <Typography size="xs" weight="medium">
                            {formatAmount({
                                amount: payload.amount.formatted,
                            })}
                        </Typography>
                    </div>
                )}
                {explorerLink && (
                    <a
                        href={explorerLink}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <ArrowRightIcon className={styles.externalLinkIcon} />
                    </a>
                )}
            </div>
        </div>
    );
}

export function SkeletonActivity() {
    return <div className={classNames(styles.root, styles.loading)}></div>;
}
