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
import { NavigationCard, SkeletonNavigationCard } from "../navigation-card";
import { PARTNER_FORM_INFO } from "../pick-partner-action";
import { useForms } from "@/src/hooks/useForms";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { FormNotSupported } from "../form-not-supported";
import { useFeeTokens } from "@/src/hooks/useFeeTokens";

import styles from "./styles.module.css";
import commonStyles from "../styles.module.css";

interface DistributableTypeConfig {
    type: DistributablesType;
    title: TranslationsKeys<"newCampaign.pickDistributablesType">;
    description: TranslationsKeys<"newCampaign.pickDistributablesType">;
    icon: ReactNode;
}

const DISTRIBUTABLE_TYPES: DistributableTypeConfig[] = [
    {
        type: DistributablesType.Tokens,
        title: "rewards.title",
        description: "rewards.description",
        icon: <TokensIcon />,
    },
    {
        type: DistributablesType.FixedPoints,
        title: "points.title",
        description: "points.description",
        icon: <PointsIcon />,
    },
];

const CAMPAIGN_TYPE_TITLE: Record<
    CampaignType,
    TranslationsKeys<"newCampaign.formHeader.type">
> = {
    "amm-pool-liquidity": "amm",
    "liquity-v2": "liquityV2",
    "aave-v3": "aaveV3",
    "hold-fungible-asset": "holdFungibleAsset",
    odyssey: "odyssey",
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
    const { id: chainId } = useChainWithType();
    const { tokens: feeTokens, loading: loadingFeeTokens } = useFeeTokens({
        // FIXME: enable this once the API works
        enabled: false,
    });

    const formsByType = useForms({
        chainId,
        type: campaignType,
        partner: false,
    });
    const partnerFormsByType = useForms({
        chainId,
        type: campaignType,
        partner: true,
    });

    const formsByChain = useForms({ chainId, partner: false });
    const partnerFormsByChain = useForms({
        chainId,
        partner: true,
    });

    const supportedByType = [...formsByType, ...partnerFormsByType];
    const supportedByChain = [...formsByChain, ...partnerFormsByChain];

    const { icon } =
        FORM_INFO[campaignType as BaseCampaignType] ||
        PARTNER_FORM_INFO[campaignType as PartnerCampaignType];

    const title = CAMPAIGN_TYPE_TITLE[campaignType];

    // TODO: not all campaign types support points rewards; only show the one enabled (redirect if there's only one?)

    function handleBackOnClick() {
        router.push("/campaigns/create");
    }

    if (supportedByType.length === 0)
        return <FormNotSupported type={campaignType} chainId={chainId} />;

    return (
        <div className={styles.root}>
            <div className={styles.navigation}>
                {supportedByChain.length > 1 && (
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
                )}
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
                {loadingFeeTokens
                    ? Array.from({ length: DISTRIBUTABLE_TYPES.length }).map(
                          (_, index) => <SkeletonNavigationCard key={index} />,
                      )
                    : DISTRIBUTABLE_TYPES.map(
                          ({ type, title, description, icon }) => {
                              if (
                                  type === DistributablesType.FixedPoints &&
                                  feeTokens?.length === 0
                              )
                                  return null;

                              return (
                                  <NavigationCard
                                      key={type}
                                      href={`/campaigns/create/${campaignType}/${type}`}
                                      title={t(title)}
                                      description={t(description)}
                                      icon={icon}
                                  />
                              );
                          },
                      )}
            </div>
        </div>
    );
}
