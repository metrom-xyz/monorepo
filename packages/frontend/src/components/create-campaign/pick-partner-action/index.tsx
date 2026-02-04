"use client";

import { Button, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { AaveThemeLogo, JumperLogo } from "@metrom-xyz/chains";
import type { ReactNode } from "react";
import type { TranslationsKeys } from "@/src/types/utils";
import { PartnerCampaignType } from "@metrom-xyz/sdk";
import { NavigationCard } from "../navigation-card";
import { ArrowLeftIcon } from "@/src/assets/arrow-left-icon";
import { useForms } from "@/src/hooks/useForms";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { useRouter } from "@/src/i18n/routing";

import styles from "./styles.module.css";
import commonStyles from "../styles.module.css";

interface ActionCard {
    title: TranslationsKeys<"newCampaign.partnerAction.pickAction">;
    description: TranslationsKeys<"newCampaign.partnerAction.pickAction">;
    icon: ReactNode;
}

export const PARTNER_FORM_INFO: Record<PartnerCampaignType, ActionCard> = {
    [PartnerCampaignType.AaveV3BridgeAndSupply]: {
        title: "list.aaveV3BridgeAndSupply.title",
        description: "list.aaveV3BridgeAndSupply.description",
        icon: <AaveThemeLogo className={styles.actionIcon} />,
    },
    [PartnerCampaignType.JumperWhitelistedAmmPoolLiquidity]: {
        title: "list.jumperWhitelistedAmmPoolLiquidity.title",
        description: "list.jumperWhitelistedAmmPoolLiquidity.description",
        icon: <JumperLogo className={styles.actionIcon} />,
    },
};

export function PickPartnerAction() {
    const t = useTranslations("newCampaign.partnerAction.pickAction");
    const router = useRouter();
    const { id: chainId } = useChainWithType();
    const forms = useForms({
        chainId,
        partner: true,
    });

    return (
        <div className={styles.root}>
            <div className={commonStyles.navigation}>
                <Button
                    size="sm"
                    variant="secondary"
                    border={false}
                    icon={ArrowLeftIcon}
                    onClick={router.back}
                    className={{ root: styles.button }}
                >
                    {t("back")}
                </Button>
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
                {forms.map(({ active, partner, type }) => {
                    const info = PARTNER_FORM_INFO[type as PartnerCampaignType];
                    if (!info || !partner || !active) return null;

                    const { title, icon, description } = info;

                    return (
                        <NavigationCard
                            key={type}
                            href={`/campaigns/create/${type}`}
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
