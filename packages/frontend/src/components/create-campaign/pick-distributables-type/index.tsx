"use client";

import { useRouter } from "@/src/i18n/routing";
import {
    BaseCampaignType,
    DistributablesType,
    PartnerCampaignType,
    type CampaignType,
} from "@metrom-xyz/sdk";
import { Button, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { TokensIcon } from "@/src/assets/tokens-icon";
import { PointsIcon } from "@/src/assets/points-icon";
import { ArrowLeftIcon } from "@/src/assets/arrow-left-icon";
import type { TranslationsKeys } from "@/src/types/utils";
import type { ReactNode } from "react";
import { FORM_INFO } from "..";
import { NavigationCard } from "../navigation-card";
import { PARTNER_FORM_INFO } from "../pick-partner-action";
import { FormNotSupported } from "../form-not-supported";
import { useForms } from "@/src/hooks/useForms";
import { useFormDistributables } from "@/src/hooks/useFormDistributables";

import styles from "./styles.module.css";
import commonStyles from "../styles.module.css";

interface DistributableTypeConfig {
    type: DistributablesType;
    title: TranslationsKeys<"newCampaign.pickDistributablesType">;
    description: TranslationsKeys<"newCampaign.pickDistributablesType">;
    icon: ReactNode;
}

const DISTRIBUTABLE_TYPES: Record<
    DistributablesType,
    DistributableTypeConfig | null
> = {
    [DistributablesType.Tokens]: {
        type: DistributablesType.Tokens,
        title: "rewards.title",
        description: "rewards.description",
        icon: <TokensIcon />,
    },
    [DistributablesType.FixedPoints]: {
        type: DistributablesType.FixedPoints,
        title: "points.title",
        description: "points.description",
        icon: <PointsIcon />,
    },
    [DistributablesType.DynamicPoints]: null,
    [DistributablesType.NoDistributables]: null,
};

const CAMPAIGN_TYPE_TITLE: Record<
    CampaignType,
    TranslationsKeys<"newCampaign.formHeader.type">
> = {
    "amm-pool-liquidity": "amm",
    "liquity-v2": "liquityV2",
    "aave-v3": "aaveV3",
    "hold-fungible-asset": "holdFungibleAsset",
    odyssey: "odyssey",
    "erc-4626-vault": "erc4626Vault",
    "aave-v3-bridge-and-supply": "aaveV3BridgeAndSupply",
    "jumper-whitelisted-amm-pool-liquidity":
        "jumperWhitelistedAmmPoolLiquidity",
};

interface PickDistributablesTypeProps {
    campaignType: CampaignType;
}

export function PickDistributablesType({
    campaignType,
}: PickDistributablesTypeProps) {
    const t = useTranslations("newCampaign.pickDistributablesType");
    const campaignTypeT = useTranslations("newCampaign.formHeader.type");

    const router = useRouter();
    const { forms, partners } = useForms({ type: campaignType });
    const distributables = useFormDistributables({ type: campaignType });

    const { icon } =
        FORM_INFO[campaignType as BaseCampaignType] ||
        PARTNER_FORM_INFO[campaignType as PartnerCampaignType];

    const title = CAMPAIGN_TYPE_TITLE[campaignType];

    function handleBackOnClick() {
        router.push("/campaigns/create");
    }

    if (forms.length === 0 && partners.length === 0)
        return <FormNotSupported type={campaignType} />;

    return (
        <div className={styles.root}>
            <div className={styles.navigation}>
                <Button
                    size="sm"
                    variant="secondary"
                    border={false}
                    icon={ArrowLeftIcon}
                    onClick={handleBackOnClick}
                    className={{ root: styles.button }}
                >
                    {t("navigation.back")}
                </Button>
                <div className={styles.campaignTypeChip}>
                    <Typography
                        weight="medium"
                        variant="tertiary"
                        className={styles.padded}
                    >
                        {t("navigation.campaignType")}
                    </Typography>
                    <div className={styles.padded}>
                        <div className={styles.campaignTypeIcon}>{icon}</div>
                        <Typography weight="medium" uppercase>
                            {campaignTypeT(title)}
                        </Typography>
                    </div>
                </div>
            </div>
            <div className={commonStyles.header}>
                <Typography weight="semibold" size="xl2">
                    {t("title")}
                </Typography>
                <Typography size="lg" variant="tertiary">
                    {t("description")}
                </Typography>
            </div>
            <div className={commonStyles.cardsWrapper}>
                {distributables.map((distributable) => {
                    if (!DISTRIBUTABLE_TYPES[distributable]) return;

                    const { type, title, description, icon } =
                        DISTRIBUTABLE_TYPES[distributable];

                    return (
                        <NavigationCard
                            key={type}
                            href={`/campaigns/create/${campaignType}/${type}`}
                            title={t(title)}
                            description={t(description)}
                            icon={icon}
                        />
                    );
                })}
            </div>
        </div>
    );
}
