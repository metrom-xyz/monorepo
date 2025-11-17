import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useAccount } from "@/src/hooks/useAccount";
import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";

import styles from "./styles.module.css";

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

interface TurtleClubProps {
    campaignId?: string;
}

export function TurtleClub({ campaignId }: TurtleClubProps) {
    const t = useTranslations("liquidityProviderDeals");
    const { address } = useAccount();
    const { resolvedTheme } = useTheme();

    return (
        <div className={styles.dealsWrapper}>
            <Typography size="lg" weight="medium" uppercase>
                {t("exploreDeals")}
            </Typography>
            <TurtleProvider
                themeConfig={{
                    light: {
                        ...defaultThemeConfig.light,
                        bgPrimary: "oklch(92.8% 0.006 264.531)",
                        bgAccent: "#f1f3f5",
                        textPrimary: "oklch(21% 0.034 264.665)",
                        textSecondary: "oklch(37.3% 0.034 259.733)",
                        borderColor: "transparent",
                    },
                    dark: {
                        ...defaultThemeConfig.dark,
                        bgPrimary: "oklch(14.5% 0 0)",
                        bgAccent: "oklch(26.9% 0 0)",
                        textPrimary: "oklch(97% 0 0)",
                        textSecondary: "oklch(87% 0 0)",
                        borderColor: "transparent",
                    },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                <Earn campaignId={campaignId} address={address} />
            </TurtleProvider>
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
