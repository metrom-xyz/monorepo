"use client";

import { type CampaignPreviewPayload } from "@/src/types";
import { useAccount, useChainId, useChains } from "wagmi";
import { useMemo, useState } from "react";
import { TargetType } from "@metrom-xyz/sdk";
import { useTranslations } from "next-intl";
import { trackFathomEvent } from "@/src/utils/fathom";
import { Modal } from "@metrom-xyz/ui";
import { CampaignPreview } from "../preview";
import { FormHeader } from "./header";
import { AmmPoolLiquidityForm } from "./amm-pool-liquidity-form";
import { LiquityV2ForksForm } from "./liquity-v2-forks-form";
import { useRouter } from "@/src/i18n/routing";

import styles from "./styles.module.css";

export enum View {
    Form = "form",
    Preview = "preview",
}

export interface CreateCampaignFormProps<T> {
    target: T;
}

export function CreateCampaignForm<T extends TargetType>({
    target,
}: CreateCampaignFormProps<T>) {
    const t = useTranslations("newCampaign");
    const { chain: connectedChain, isConnected } = useAccount();
    const selectedChain = useChainId();
    const chains = useChains();
    const router = useRouter();

    const [view, setView] = useState(View.Form);
    const [payload, setPayload] = useState<CampaignPreviewPayload | null>(null);

    function handlePreviewOnClick(payload: CampaignPreviewPayload | null) {
        setPayload(payload);
        setView(View.Preview);
        trackFathomEvent("CLICK_CAMPAIGN_PREVIEW");
    }

    function handleBackOnClick() {
        setView(View.Form);
    }

    function handleCreateNewOnClick() {
        router.push("/campaigns/create");
    }

    const unsupportedChain = useMemo(() => {
        return (
            isConnected &&
            (!connectedChain ||
                !chains.some((chain) => chain.id === selectedChain))
        );
    }, [chains, connectedChain, isConnected, selectedChain]);

    return (
        <div className={styles.root}>
            <FormHeader target={target} />
            {target === TargetType.AmmPoolLiquidity && (
                <AmmPoolLiquidityForm
                    unsupportedChain={unsupportedChain}
                    onPreviewClick={handlePreviewOnClick}
                />
            )}
            {target === TargetType.LiquityV2Debt && (
                <LiquityV2ForksForm
                    unsupportedChain={unsupportedChain}
                    onPreviewClick={handlePreviewOnClick}
                />
            )}
            {!!payload && (
                <Modal open={view === View.Preview}>
                    <CampaignPreview
                        onBack={handleBackOnClick}
                        onCreateNew={handleCreateNewOnClick}
                        payload={payload}
                    />
                </Modal>
            )}
        </div>
    );
}
