"use client";

import { Card, Typography } from "@metrom-xyz/ui";
import { Link } from "@/src/i18n/routing";
import { useTranslations } from "next-intl";
import { LiquityV2CampaignIcon } from "@/src/assets/liquity-v2-campaign-icon";
import { AmmCampaignIcon } from "@/src/assets/amm-campaign-icon";
import classNames from "classnames";
import { AaveThemeLogo } from "@metrom-xyz/chains";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { CompassIcon } from "@/src/assets/compass-icon";
import { useState, type ReactNode } from "react";
import { PickPartnerAction } from "./pick-partner-action";
import type { TranslationsKeys } from "@/src/types/utils";
import { useForms } from "@/src/hooks/useForms";
import { BaseCampaignType } from "@metrom-xyz/sdk";
import { FormNotSupported } from "./form-not-supported";
import { Redirect } from "./redirect";

import styles from "./styles.module.css";

interface CampaignTypeConfig {
    title: TranslationsKeys<"newCampaign.pickType">;
    description: TranslationsKeys<"newCampaign.pickType">;
    icon: ReactNode;
}

const FORM_INFO: Record<BaseCampaignType, CampaignTypeConfig> = {
    [BaseCampaignType.AmmPoolLiquidity]: {
        title: "amm.title",
        description: "amm.description",
        icon: <AmmCampaignIcon className={styles.ammIcon} />,
    },
    [BaseCampaignType.LiquityV2]: {
        title: "liquityV2.title",
        description: "liquityV2.description",
        icon: <LiquityV2CampaignIcon className={styles.liquidityV2Icon} />,
    },
    [BaseCampaignType.AaveV3]: {
        title: "aaveV3.title",
        description: "aaveV3.description",
        icon: <AaveThemeLogo className={styles.aaveIcon} />,
    },
    [BaseCampaignType.HoldFungibleAsset]: {
        title: "holdFungibleAsset.title",
        description: "holdFungibleAsset.description",
        icon: <AaveThemeLogo className={styles.aaveIcon} />,
    },
};

export function CreateCampaign() {
    const t = useTranslations("newCampaign.pickType");

    const [showPartnerActions, setShowPartnerActions] = useState(false);

    const { id: chainId } = useChainWithType();

    const forms = useForms({ chainId, partner: false });
    const partnerForms = useForms({
        chainId,
        partner: true,
    });

    function handleShowPartnerAction() {
        setShowPartnerActions(true);
    }

    function handleHidePartnerActions() {
        setShowPartnerActions(false);
    }

    const supported = [...forms, ...partnerForms];

    if (supported.length === 0) return <FormNotSupported chainId={chainId} />;
    if (supported.length === 1) return <Redirect supported={supported} />;

    if (showPartnerActions)
        return (
            <PickPartnerAction
                forms={partnerForms}
                onBack={handleHidePartnerActions}
            />
        );

    return (
        <div className={styles.root}>
            <Typography weight="medium" size="lg" uppercase>
                {t("title")}
            </Typography>
            <Typography weight="medium" light className={styles.description}>
                {t("description")}
            </Typography>
            <div className={styles.campaignCardsWrapper}>
                {forms.map(({ active, partner, type }) => {
                    const info = FORM_INFO[type as BaseCampaignType];
                    if (!info || partner || !active) return null;

                    const { title, icon, description } = info;

                    return (
                        <Link
                            key={type}
                            href={`/campaigns/create/${type}`}
                            className={styles.link}
                        >
                            <Card className={styles.campaignLinkCard}>
                                <div className={styles.campaignCardBody}>
                                    <div className={styles.iconWrapper}>
                                        {icon}
                                    </div>
                                    <div className={styles.rightContent}>
                                        <Typography weight="medium" size="lg">
                                            {t(title)}
                                        </Typography>
                                        <Typography weight="medium" light>
                                            {t(description)}
                                        </Typography>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    );
                })}
                {partnerForms.length > 0 && (
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
