"use client";

import { useEffect, type FunctionComponent, type ReactNode } from "react";
import { TopNav } from "./top-nav";
import { Footer } from "./footer";
import { useAccount, useDisconnect } from "wagmi";
import { APTOS } from "@/src/commons/env";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { SideNav } from "./side-nav";
import type { TranslationsKeys } from "@/src/types/utils";
import type { SVGIcon } from "@/src/types/common";
import { AllCampaignsIcon } from "@/src/assets/all-campaigns-icon";
import { NewCampaignIcon } from "@/src/assets/new-campaign-icon";
import { ClaimsIcon } from "@/src/assets/claims-icon";

import styles from "./styles.module.css";

interface LayoutProps {
    children: ReactNode;
}

export const ROUTES: {
    path: string;
    label: TranslationsKeys<"navigation">;
    icon: FunctionComponent<SVGIcon>;
}[] = [
    { path: "/", label: "discover", icon: AllCampaignsIcon },
    { path: "/campaigns/create", label: "newCampaign", icon: NewCampaignIcon },
    { path: "/claims", label: "claim", icon: ClaimsIcon },
];

export function Layout({ children }: LayoutProps) {
    const { isConnected: connectedEvm } = useAccount();
    const { connected: connectedMvm, disconnect: disconnectMvm } = useWallet();
    const { disconnect: disconnectEvm } = useDisconnect();

    // Needed to make sure the unnecessary wallet provider gets disconnected.
    useEffect(() => {
        if (APTOS && connectedEvm) disconnectEvm();
        if (!APTOS && connectedMvm) disconnectMvm();
    }, [connectedEvm, connectedMvm, disconnectMvm, disconnectEvm]);

    return (
        <div className={styles.layout}>
            <SideNav />
            <div className={styles.content}>
                <div className={styles.top}>
                    <TopNav />
                </div>
                <div className={styles.main}>{children}</div>
                <div className={styles.footer}>
                    <Footer />
                </div>
            </div>
        </div>
    );
}
