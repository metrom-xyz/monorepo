"use client";

import { Card, Typography } from "@metrom-xyz/ui";
import { Link } from "@/src/i18n/routing";
import { useTranslations } from "next-intl";
import { LiquityV2CampaignIcon } from "@/src/assets/liquity-v2-campaign-icon";
import { AmmCampaignIcon } from "@/src/assets/amm-campaign-icon";
import classNames from "classnames";
import { CampaignType } from "@/src/types/campaign";
import { ProtocolType } from "@metrom-xyz/chains";
import { useProtocolsInChain } from "@/src/hooks/useProtocolsInChain";
import { Redirect } from "./redirect";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { CompassIcon } from "@/src/assets/compass-icon";
import { usePartnerActions } from "@/src/hooks/usePartnerActions";
import { useState } from "react";
import { PickPartnerAction } from "./pick-partner-action";

import styles from "./styles.module.css";

const CAMPAIGN_TYPES = [
    {
        path: `/campaigns/create/${CampaignType.AmmPoolLiquidity}`,
        title: "amm.title",
        description: "amm.description",
        type: CampaignType.AmmPoolLiquidity,
        protocol: ProtocolType.Dex,
        icon: <AmmCampaignIcon className={styles.ammIcon} />,
    },
    {
        path: `/campaigns/create/${CampaignType.LiquityV2}`,
        title: "liquityV2.title",
        description: "liquityV2.description",
        type: CampaignType.LiquityV2,
        protocol: ProtocolType.LiquityV2,
        icon: <LiquityV2CampaignIcon className={styles.liquidityV2Icon} />,
    },
    {
        path: `/campaigns/create/${CampaignType.AaveV3}`,
        title: "aaveV3.title",
        description: "aaveV3.description",
        type: CampaignType.AaveV3,
        protocol: ProtocolType.AaveV3,
        icon: <LiquityV2CampaignIcon className={styles.liquidityV2Icon} />,
    },
];

export function CreateCampaign() {
    const t = useTranslations("newCampaign.pickType");

    const [showPartnerActions, setShowPartnerActions] = useState(false);

    const { id: chainId } = useChainWithType();
    const dexProtocols = useProtocolsInChain({
        chainId,
        type: ProtocolType.Dex,
        active: true,
    });
    const liquityV2Protocols = useProtocolsInChain({
        chainId,
        type: ProtocolType.LiquityV2,
        active: true,
    });
    const aaveV3Protocols = useProtocolsInChain({
        chainId,
        type: ProtocolType.AaveV3,
        active: true,
    });
    const partnerActions = usePartnerActions({ chainId });

    function handleShowPartnerAction() {
        setShowPartnerActions(true);
    }

    function handleHidePartnerActions() {
        setShowPartnerActions(false);
    }

    const supported = [
        ...dexProtocols,
        ...liquityV2Protocols,
        ...aaveV3Protocols,
        ...partnerActions,
    ];

    if (supported.length === 0)
        return (
            <div className={styles.emptyWrapper}>
                <Typography weight="medium" size="lg">
                    {t("empty.message1")}
                </Typography>
                <Typography weight="medium" size="lg">
                    {t("empty.message2")}
                </Typography>
            </div>
        );

    if (supported.length === 1) return <Redirect supported={supported} />;

    if (showPartnerActions)
        return <PickPartnerAction onBack={handleHidePartnerActions} />;

    return (
        <div className={styles.root}>
            <Typography weight="medium" size="lg" uppercase>
                {t("title")}
            </Typography>
            <Typography weight="medium" light className={styles.description}>
                {t("description")}
            </Typography>
            <div className={styles.campaignCardsWrapper}>
                {CAMPAIGN_TYPES.map(
                    ({ path, title, description, protocol, icon }) => {
                        const disabled =
                            supported.filter(
                                (supported) => supported.type === protocol,
                            ).length === 0;
                        if (disabled) return null;

                        return (
                            <Link key={path} href={path}>
                                <Card className={styles.campaignLinkCard}>
                                    <div className={styles.campaignCardBody}>
                                        <div
                                            className={classNames(
                                                styles.iconWrapper,
                                            )}
                                        >
                                            {icon}
                                        </div>
                                        <div className={styles.rightContent}>
                                            <Typography
                                                weight="medium"
                                                size="lg"
                                            >
                                                {t<any>(title)}
                                            </Typography>
                                            <Typography weight="medium" light>
                                                {t<any>(description)}
                                            </Typography>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        );
                    },
                )}
                {partnerActions.length > 0 && (
                    <div onClick={handleShowPartnerAction}>
                        <Card className={styles.campaignCard}>
                            <div className={styles.campaignCardBody}>
                                <div className={classNames(styles.iconWrapper)}>
                                    <CompassIcon
                                        className={styles.partnerActionsIcon}
                                    />
                                </div>
                                <div className={styles.rightContent}>
                                    <Typography weight="medium" size="lg">
                                        {t("partnerAction.title")}
                                    </Typography>
                                    <Typography weight="medium" light>
                                        {t("partnerAction.description")}
                                    </Typography>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
