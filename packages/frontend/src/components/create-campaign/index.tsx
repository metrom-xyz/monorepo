"use client";

import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { LiquityV2CampaignIcon } from "@/src/assets/liquity-v2-campaign-icon";
import { AmmCampaignIcon } from "@/src/assets/amm-campaign-icon";
import { AaveThemeLogo } from "@metrom-xyz/chains";
import { CompassIcon } from "@/src/assets/compass-icon";
import { type ReactNode } from "react";
import type { TranslationsKeys } from "@/src/types/utils";
import { BaseCampaignType, DistributablesType } from "@metrom-xyz/sdk";
import { NavigationCard } from "./navigation-card";
import { useForms } from "@/src/hooks/useForms";
import { VaultIcon } from "@/src/assets/vault-icon";

import styles from "./styles.module.css";
import { TokensIcon } from "@/src/assets/tokens-icon";

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
        icon: <TokensIcon />,
    },
    [BaseCampaignType.Odyssey]: {
        title: "odyssey.title",
        description: "odyssey.description",
        icon: <AaveThemeLogo />,
    },
    [BaseCampaignType.Erc4626Vault]: {
        title: "erc4626Vault.title",
        description: "erc4626Vault.description",
        icon: <VaultIcon />,
    },
};

export function CreateCampaign() {
    const t = useTranslations("newCampaign.pickType");

    const { forms, partners } = useForms();

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
                            href={`/campaigns/create/${type}/${DistributablesType.Tokens}`}
                            title={t(title)}
                            description={t(description)}
                            icon={icon}
                            tags={tags?.map((tag) => t(tag))}
                        />
                    );
                })}
                {partners.length > 0 && (
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
