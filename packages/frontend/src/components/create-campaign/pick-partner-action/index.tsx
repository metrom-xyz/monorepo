"use client";

import { Card, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { usePartnerActions } from "@/src/hooks/usePartnerActions";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { Link } from "@/src/i18n/routing";
import { AaveThemeLogo, JumperLogo } from "@metrom-xyz/chains";
import type { ReactNode } from "react";
import type { LocalizedMessage } from "@/src/types/utils";
import { ChevronLeftIcon } from "@/src/assets/chevron-left-icon";
import type { PartnerActionTargetType } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

interface ActionCard {
    type: string;
    title: LocalizedMessage<"newCampaign.partnerAction.pickAction">;
    description: LocalizedMessage<"newCampaign.partnerAction.pickAction">;
    icon: ReactNode;
}

const ACTIONS: Record<PartnerActionTargetType, ActionCard> = {
    "aave-v3-bridge-and-supply": {
        type: "aave-v3-bridge-and-supply",
        title: "list.aaveV3BridgeAndSupply.title",
        description: "list.aaveV3BridgeAndSupply.description",
        icon: <AaveThemeLogo className={styles.actionIcon} />,
    },
    "jumper-whitelisted-amm-pool-liquidity": {
        type: "jumper-whitelisted-amm-pool-liquidity",
        title: "list.jumperWhitelistedAmmPoolLiquidity.title",
        description: "list.jumperWhitelistedAmmPoolLiquidity.description",
        icon: <JumperLogo className={styles.actionIcon} />,
    },
};

interface PickPartnerActionProps {
    onBack: () => void;
}

export function PickPartnerAction({ onBack }: PickPartnerActionProps) {
    const t = useTranslations("newCampaign.partnerAction.pickAction");

    const { id: chainId } = useChainWithType();
    const partnerActions = usePartnerActions({ chainId });

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
            <Typography weight="medium" light className={styles.description}>
                {t("description")}
            </Typography>
            <div className={styles.actions}>
                {Object.values(partnerActions || {})
                    .flat()
                    .map((partnerAction) => {
                        const action = ACTIONS[partnerAction.type];
                        if (!action) return;

                        const { type, title, description, icon } = action;

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
                                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                {t<any>(title)}
                                            </Typography>
                                            <Typography weight="medium" light>
                                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                {t<any>(description)}
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
