"use client";

import { type CampaignPreviewPayload } from "@/src/types/campaign";
import {
    BaseCampaignType,
    CampaignKind,
    PartnerCampaignType,
    type CampaignType,
} from "@metrom-xyz/sdk";
import { useAccount } from "@/src/hooks/useAccount";
import { useMemo, useState } from "react";
import { trackFathomEvent } from "@/src/utils/fathom";
import { Modal } from "@metrom-xyz/ui";
import { CampaignPreview } from "../preview";
import { FormHeader } from "./header";
import { AmmPoolLiquidityForm } from "./amm-pool-liquidity-form";
import { LiquityV2ForksForm } from "./liquity-v2-forks-form";
import { useRouter } from "@/src/i18n/routing";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { useActiveChains } from "@/src/hooks/useActiveChains";
import { AaveV3Form } from "./aave-v3-form";
import { AaveV3BridgeAndSupplyForm } from "./aave-v3-bridge-and-supply-form";
import { useForms } from "@/src/hooks/useForms";
import { FormNotSupported } from "../form-not-supported";

import styles from "./styles.module.css";

enum View {
    Form = "form",
    Preview = "preview",
}

export interface CreateCampaignFormProps<T> {
    type: T;
}

export function CreateCampaignForm<T extends CampaignType>({
    type,
}: CreateCampaignFormProps<T>) {
    const { chainId: connectedChainId, connected } = useAccount();
    const { id: selectedChain } = useChainWithType();
    const activeChains = useActiveChains();
    const router = useRouter();
    const forms = useForms({
        chainId: selectedChain,
    });
    const formsForType = useForms({
        chainId: selectedChain,
        type,
    });

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
            connected &&
            (!connectedChainId ||
                !activeChains.some(({ id }) => id === selectedChain))
        );
    }, [activeChains, connectedChainId, connected, selectedChain]);

    if (formsForType.length === 0)
        return <FormNotSupported type={type} chainId={selectedChain} />;

    return (
        <div className={styles.root}>
            {forms.length > 1 && <FormHeader type={type} />}
            {type === BaseCampaignType.AmmPoolLiquidity && (
                <AmmPoolLiquidityForm
                    kind={CampaignKind.AmmPoolLiquidity}
                    unsupportedChain={unsupportedChain}
                    onPreviewClick={handlePreviewOnClick}
                />
            )}
            {type === BaseCampaignType.LiquityV2 && (
                <LiquityV2ForksForm
                    unsupportedChain={unsupportedChain}
                    onPreviewClick={handlePreviewOnClick}
                />
            )}
            {type === BaseCampaignType.AaveV3 && (
                <AaveV3Form
                    unsupportedChain={unsupportedChain}
                    onPreviewClick={handlePreviewOnClick}
                />
            )}
            {type === PartnerCampaignType.AaveV3BridgeAndSupply && (
                <AaveV3BridgeAndSupplyForm
                    unsupportedChain={unsupportedChain}
                    onPreviewClick={handlePreviewOnClick}
                />
            )}
            {type === PartnerCampaignType.JumperWhitelistedAmmPoolLiquidity && (
                <AmmPoolLiquidityForm
                    kind={CampaignKind.JumperWhitelistedAmmPoolLiquidity}
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
