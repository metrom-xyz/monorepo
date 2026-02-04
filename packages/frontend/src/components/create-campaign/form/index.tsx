"use client";

import { type CampaignPreviewPayload } from "@/src/types/campaign";
import {
    BaseCampaignType,
    CampaignKind,
    DistributablesType,
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
import { HoldFungibleAssetForm } from "./hold-fungible-asset-form";

import styles from "./styles.module.css";

enum View {
    Form = "form",
    Preview = "preview",
}

export interface CreateCampaignFormProps<T> {
    campaignType: T;
    distributablesType: DistributablesType;
}

export function CreateCampaignForm<T extends CampaignType>({
    campaignType,
    distributablesType,
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
        type: campaignType,
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
        return <FormNotSupported type={campaignType} chainId={selectedChain} />;

    return (
        <div className={styles.root}>
            {forms.length > 1 && <FormHeader type={campaignType} />}
            {campaignType === BaseCampaignType.AmmPoolLiquidity && (
                <AmmPoolLiquidityForm
                    kind={CampaignKind.AmmPoolLiquidity}
                    unsupportedChain={unsupportedChain}
                    onPreviewClick={handlePreviewOnClick}
                />
            )}
            {campaignType === BaseCampaignType.LiquityV2 && (
                <LiquityV2ForksForm
                    unsupportedChain={unsupportedChain}
                    onPreviewClick={handlePreviewOnClick}
                />
            )}
            {campaignType === BaseCampaignType.AaveV3 && (
                <AaveV3Form
                    unsupportedChain={unsupportedChain}
                    onPreviewClick={handlePreviewOnClick}
                />
            )}
            {campaignType === BaseCampaignType.HoldFungibleAsset && (
                <HoldFungibleAssetForm
                    unsupportedChain={unsupportedChain}
                    onPreviewClick={handlePreviewOnClick}
                />
            )}
            {campaignType === PartnerCampaignType.AaveV3BridgeAndSupply && (
                <AaveV3BridgeAndSupplyForm
                    unsupportedChain={unsupportedChain}
                    onPreviewClick={handlePreviewOnClick}
                />
            )}
            {campaignType ===
                PartnerCampaignType.JumperWhitelistedAmmPoolLiquidity && (
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
