"use client";

import { Card, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/routing";
import { AaveThemeLogo, JumperLogo, type Form } from "@metrom-xyz/chains";
import type { ReactNode } from "react";
import type { TranslationsKeys } from "@/src/types/utils";
import { ChevronLeftIcon } from "@/src/assets/chevron-left-icon";
import { PartnerCampaignType } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

interface ActionCard {
    title: TranslationsKeys<"newCampaign.partnerAction.pickAction">;
    description: TranslationsKeys<"newCampaign.partnerAction.pickAction">;
    icon: ReactNode;
}

const FORM_INFO: Record<PartnerCampaignType, ActionCard> = {
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

interface PickPartnerActionProps {
    forms: Form[];
    onBack: () => void;
}

export function PickPartnerAction({ forms, onBack }: PickPartnerActionProps) {
    const t = useTranslations("newCampaign.partnerAction.pickAction");

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <div onClick={onBack} className={styles.back}>
                    <ChevronLeftIcon />
                </div>
                <Typography weight="medium" size="lg" uppercase>
                    {t("title")}
                </Typography>
            </div>
            <Typography
                weight="medium"
                variant="tertiary"
                className={styles.description}
            >
                {t("description")}
            </Typography>
            <div className={styles.actions}>
                {forms.map(({ active, partner, type }) => {
                    const info = FORM_INFO[type as PartnerCampaignType];
                    if (!info || !partner || !active) return null;

                    const { title, icon, description } = info;

                    return (
                        <Link key={type} href={`/campaigns/create/${type}`}>
                            <Card className={styles.action}>
                                <div className={styles.actionBody}>
                                    <div className={styles.actionWrapper}>
                                        {icon}
                                    </div>
                                    <div className={styles.rightContent}>
                                        <Typography
                                            uppercase
                                            weight="medium"
                                            size="lg"
                                        >
                                            {t(title)}
                                        </Typography>
                                        <Typography
                                            weight="medium"
                                            variant="tertiary"
                                        >
                                            {t(description)}
                                        </Typography>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
