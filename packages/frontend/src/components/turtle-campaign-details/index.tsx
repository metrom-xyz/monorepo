"use client";

import { useTurtleDeals } from "@/src/hooks/useTurtleDeals";
import { useAccount } from "@/src/hooks/useAccount";
import { TextField, Typography } from "@metrom-xyz/ui";
import { TURTLE_CAMPAIGNS } from "@/src/commons/turtle-campaigns";
import { Header } from "./header";
import { formatUsdAmount } from "@/src/utils/format";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { ENVIRONMENT } from "@/src/commons/env";

const TurtleProvider = dynamic(
    () => import("@turtledev/react").then((mod) => mod.TurtleProvider),
    {
        loading: () => <SkeletonDeals />,
        ssr: false,
    },
);

const Earn = dynamic(() => import("./earn").then((mod) => mod.Earn), {
    loading: () => <SkeletonDeals />,
    ssr: false,
});

import styles from "./styles.module.css";

const defaultThemeConfig = {
    theme: "dark",
    shared: {
        borderRadius: "0.5rem",
        gap: "0.75rem",
        padding: "1rem",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        fontSize: "1rem",
        fontWeight: "400",
    },
    light: {
        bgPrimary: "rgba(230, 230, 230)",
        bgSecondary: "rgb(245, 245, 245)",
        bgAccent: "rgba(245, 245, 245)",
        bgTranslucent: "hsl(0 0% 10% / 0.25)",
        borderColor: "rgb(210, 210, 210)",
        textPrimary: "rgba(10, 10, 10)",
        textSecondary: "rgba(30, 30, 30)",
        buttonBgColor: "hsl(117, 85%, 69%)",
        buttonTextColor: "rgb(10, 10, 10)",
        errorColor: "rgb(247, 23, 53)",
    },
    dark: {
        bgPrimary: "rgb(32, 32, 34)",
        bgSecondary: "rgba(20, 20, 20)",
        bgAccent: "rgba(60, 60, 60)",
        bgTranslucent: "hsl(0 0% 90% / 0.25)",
        borderColor: "rgb(53, 53, 59)",
        textPrimary: "rgba(255, 255, 255)",
        textSecondary: "rgba(225, 225, 225)",
        buttonBgColor: "hsl(117, 85%, 69%)",
        buttonTextColor: "rgb(10, 10, 10)",
        errorColor: "rgb(246, 56, 85)",
    },
};

interface TurtleCampaignDetailsProps {
    campaignId: string;
}

export function TurtleCampaignDetails({
    campaignId,
}: TurtleCampaignDetailsProps) {
    const t = useTranslations("turtleCampaignPage");

    const { address } = useAccount();
    const { deals, loading } = useTurtleDeals({ campaignId });
    const { resolvedTheme } = useTheme();

    const totalDealsTvl = useMemo(() => {
        if (!deals) return null;

        return deals.reduce((prev, deal) => prev + deal.data.tvl, 0);
    }, [deals]);

    const campaign = TURTLE_CAMPAIGNS[ENVIRONMENT].find(
        ({ id }) => id === campaignId,
    );

    if (!campaign) return null;

    return (
        <div className={styles.root}>
            <Header {...campaign} />
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
            <div className={styles.dealsWrapper}>
                <Typography size="lg" weight="medium" uppercase>
                    {t("exploreDeals")}
                </Typography>
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
                            fontFamily:
                                "IBM Plex Sans, ui-sans-serif, sans-serif",
                            fontSize: "1rem",
                            fontWeight: "400",
                        },
                    }}
                >
                    <Earn campaignId={campaignId} address={address} />
                </TurtleProvider>
            </div>
        </div>
    );
}

export function SkeletonDeals() {
    return (
        <div className={styles.skeletonDeals}>
            <div className={styles.skeletonDealHeader}></div>
            <div className={styles.skeletonDealsWrapper}>
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className={styles.skeletonDeal}></div>
                ))}
            </div>
        </div>
    );
}
