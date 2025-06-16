"use client";

import { useTurtleDeals } from "@/src/hooks/useTurtleDeals";
import {
    defaultThemeConfig,
    EarnPage,
    TurtleProvider,
    useWagmiAdapter,
} from "@turtledev/react";
import { useTheme } from "next-themes";
import { useAccount } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { TextField, Typography } from "@metrom-xyz/ui";
import { TURTLE_CAMPAIGNS } from "@/src/commons/turtle-campaigns";
import { Header } from "./header";
import { formatUsdAmount } from "@/src/utils/format";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

import styles from "./styles.module.css";

interface TurtleCampaignDetailsProps {
    campaignId: string;
}

export function TurtleCampaignDetails({
    campaignId,
}: TurtleCampaignDetailsProps) {
    const t = useTranslations("turtleCampaignPage");

    const { address } = useAccount();
    const { open } = useAppKit();
    const { deals, loading } = useTurtleDeals({ campaignId });
    const { resolvedTheme } = useTheme();
    const adapter = useWagmiAdapter();

    const totalDealsTvl = useMemo(() => {
        if (!deals) return null;

        return deals.reduce((prev, deal) => prev + deal.data.tvl, 0);
    }, [deals]);

    const campaign = TURTLE_CAMPAIGNS.find(({ id }) => id === campaignId);

    if (!campaign) return null;

    const { name, owner, description, brand, url, ownerLogo } = campaign;

    return (
        <div className={styles.root}>
            <Header
                name={name}
                owner={owner}
                description={description}
                url={url}
                brand={brand}
                icon={ownerLogo}
            />
            <div className={styles.contentWrapper}>
                <div className={styles.details}>
                    <TextField
                        boxed
                        size="xl"
                        label={t("tvl")}
                        loading={loading}
                        value={formatUsdAmount({
                            amount: totalDealsTvl,
                            cutoff: false,
                        })}
                    />
                    <TextField
                        boxed
                        size="xl"
                        label={t("status")}
                        loading={loading}
                        value={
                            <div className={styles.statusWrapper}>
                                <div className={styles.statusDot}>
                                    <div className={styles.live}></div>
                                </div>
                                <Typography weight="medium" size="xl">
                                    {/* TODO: other states? We don't have date for Turtle campaigns */}
                                    {t("live")}
                                </Typography>
                            </div>
                        }
                    />
                </div>
            </div>
            <TurtleProvider
                themeConfig={{
                    ...defaultThemeConfig,
                    light: {
                        ...defaultThemeConfig.light,
                        bgPrimary: "#ffffff",
                        bgAccent: "#f4f4f5",
                        textPrimary: "#000000",
                        textSecondary: "#9ca3af",
                        borderColor: "transparent",
                    },
                    dark: {
                        ...defaultThemeConfig.dark,
                        bgPrimary: "#202024",
                        bgAccent: "#3f3f46",
                        textPrimary: "#d4d4d8",
                        textSecondary: "#9ca3af",
                        borderColor: "transparent",
                    },
                    theme: resolvedTheme as any,
                    shared: {
                        borderRadius: "0.5rem",
                        gap: "1rem",
                        padding: "1rem",
                        fontFamily: "IBM Plex Sans, ui-sans-serif, sans-serif",
                        fontSize: "1rem",
                        fontWeight: "400",
                    },
                }}
            >
                <div className={styles.dealsWrapper}>
                    <Typography size="lg" weight="medium" uppercase>
                        {t("exploreDeals")}
                    </Typography>
                    <EarnPage
                        // TODO: add referral code
                        referral="YOUR_REFERRAL_CODE"
                        campaignId={campaignId}
                        user={address}
                        openConnectionModal={open}
                        {...adapter}
                    />
                </div>
            </TurtleProvider>
        </div>
    );
}
