"use client";

import { TURTLE_REFERRAL_CODE } from "@/src/commons";
import { useEarnWagmiAdapter } from "@/src/hooks/useEarnWagmiAdapter";
import dynamic from "next/dynamic";
import classNames from "classnames";

import styles from "./styles.module.css";

const EarnWidgetDynamic = dynamic(
    () => import("@turtleclub/earn-widget").then((mod) => mod.EarnWidget),
    {
        loading: () => <SkeletonEarn />,
        ssr: false,
    },
);

export function Earn() {
    const adapter = useEarnWagmiAdapter();

    return (
        <div className={styles.earn}>
            <EarnWidgetDynamic
                config={{
                    theme: "dark",
                    styles: {
                        background: "#f9fafb",
                        background_dark: "#171717",
                        primary: "#0ea400",
                        primary_dark: "#6cff95",
                        foreground: "#101828",
                        foreground_dark: "#f5f5f5",
                    },
                }}
                adapter={adapter}
                distributorId={TURTLE_REFERRAL_CODE}
            />
        </div>
    );
}

export function SkeletonEarn() {
    return <div className={classNames(styles.earn, styles.loading)}></div>;
}
