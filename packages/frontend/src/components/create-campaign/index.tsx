"use client";

import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { LiquityV2CampaignIcon } from "@/src/assets/liquity-v2-campaign-icon";
import { AmmCampaignIcon } from "@/src/assets/amm-campaign-icon";
import { AaveThemeLogo } from "@metrom-xyz/chains";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { CompassIcon } from "@/src/assets/compass-icon";
import { type ReactNode } from "react";
import type { TranslationsKeys } from "@/src/types/utils";
import { useForms } from "@/src/hooks/useForms";
import { BaseCampaignType } from "@metrom-xyz/sdk";
import { FormNotSupported } from "./form-not-supported";
import { Redirect } from "./redirect";
import { NavigationCard } from "./navigation-card";

import styles from "./styles.module.css";

interface CampaignTypeConfig {
    title: TranslationsKeys<"newCampaign.pickType">;
    description: TranslationsKeys<"newCampaign.pickType">;
    icon: ReactNode;
    tags?: TranslationsKeys<"newCampaign.pickType">[];
}

export const FORM_INFO: Record<BaseCampaignType, CampaignTypeConfig> = {
    [BaseCampaignType.AmmPoolLiquidity]: {
        title: "amm.title",
        description: "amm.description",
        icon: <AmmCampaignIcon />,
        tags: ["tags.popular"],
    },
    [BaseCampaignType.LiquityV2]: {
        title: "liquityV2.title",
        description: "liquityV2.description",
        icon: <LiquityV2CampaignIcon className={styles.liquidityV2Icon} />,
    },
    [BaseCampaignType.AaveV3]: {
        title: "aaveV3.title",
        description: "aaveV3.description",
        icon: <AaveThemeLogo />,
    },
    [BaseCampaignType.HoldFungibleAsset]: {
        title: "holdFungibleAsset.title",
        description: "holdFungibleAsset.description",
        icon: <AaveThemeLogo />,
    },
    [BaseCampaignType.Odyssey]: {
        title: "odyssey.title",
        description: "odyssey.description",
        icon: <AaveThemeLogo className={styles.aaveIcon} />,
    },
};

export function CreateCampaign() {
    const t = useTranslations("newCampaign.pickType");

    const { id: chainId } = useChainWithType();
    const forms = useForms({ chainId, partner: false });
    const partnerForms = useForms({
        chainId,
        partner: true,
    });

    const supported = [...forms, ...partnerForms];

    if (supported.length === 0) return <FormNotSupported chainId={chainId} />;
    if (supported.length === 1) return <Redirect supported={supported} />;

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <Typography weight="semibold" size="xl2">
                    {t("title")}
                </Typography>
                <Typography size="lg" variant="tertiary">
                    {t("description")}
                </Typography>
            </div>
            <div className={styles.cardsWrapper}>
                {forms.map(({ active, partner, type }) => {
                    const info = FORM_INFO[type as BaseCampaignType];
                    if (!info || partner || !active) return null;

                    const { title, icon, description, tags } = info;

                    return (
                        <NavigationCard
                            key={type}
                            href={`/campaigns/create/${type}`}
                            title={t(title)}
                            description={t(description)}
                            icon={icon}
                            tags={tags?.map((tag) => t(tag))}
                        />
                    );
                })}
                {partnerForms.length > 0 && (
                    <NavigationCard
                        href={`/campaigns/create/partner`}
                        title={t("partnerAction.title")}
                        description={t("partnerAction.description")}
                        icon={
                            <CompassIcon
                                className={styles.partnerActionsIcon}
                            />
                        }
                    />
                )}
            </div>
        </div>
    );
}
