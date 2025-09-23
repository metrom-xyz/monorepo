"use client";

import {
    CampaignKind,
    CampaignType,
    type CampaignPreviewPayload,
} from "@/src/types/campaign";
import { useAccount } from "@/src/hooks/useAccount";
import { useEffect, useMemo, useState } from "react";
import { trackFathomEvent } from "@/src/utils/fathom";
import { Modal, Typography } from "@metrom-xyz/ui";
import { CampaignPreview } from "../preview";
import { FormHeader } from "./header";
import { AmmPoolLiquidityForm } from "./amm-pool-liquidity-form";
import { LiquityV2ForksForm } from "./liquity-v2-forks-form";
import { useRouter } from "@/src/i18n/routing";
import { ProtocolType } from "@metrom-xyz/chains";
import { useProtocolsInChain } from "@/src/hooks/useProtocolsInChain";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { useActiveChains } from "@/src/hooks/useActiveChains";
import { AaveV3Form } from "./aave-v3-form";
import { usePartnerActions } from "@/src/hooks/usePartnerActions";
import { PARTNER_ACTION_CAMPAIGNS } from "@/src/commons";
import { useTranslations } from "next-intl";

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
    const t = useTranslations("newCampaign.form");

    const { chainId: connectedChainId, connected } = useAccount();
    const { id: selectedChain } = useChainWithType();
    const activeChains = useActiveChains();
    const router = useRouter();
    const dexesProtocols = useProtocolsInChain({
        chainId: selectedChain,
        type: ProtocolType.Dex,
        active: true,
    });
    const liquityV2Protocols = useProtocolsInChain({
        chainId: selectedChain,
        type: ProtocolType.LiquityV2,
        active: true,
    });
    const aaveV3Protocols = useProtocolsInChain({
        chainId: selectedChain,
        type: ProtocolType.AaveV3,
        active: true,
    });
    const partnerActions = usePartnerActions({ chainId: selectedChain });

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

    const unsupportedPartnerAction = useMemo(
        () =>
            partnerActions.length === 0 &&
            PARTNER_ACTION_CAMPAIGNS.includes(type),
        [partnerActions, type],
    );

    const supported = [
        dexesProtocols,
        liquityV2Protocols,
        aaveV3Protocols,
        partnerActions,
    ]
        .filter((protocols) => protocols.length > 0)
        .flat();

    const ammPoolLiquidity =
        type === CampaignType.AmmPoolLiquidity ||
        type === CampaignType.JumperWhitelistedAmmPoolLiquidity;
    const ammPoolLiquidityCampaignKind =
        type === CampaignType.AmmPoolLiquidity
            ? CampaignKind.AmmPoolLiquidity
            : CampaignKind.JumperWhitelistedAmmPoolLiquidity;

    if (unsupportedPartnerAction)
        return (
            <div className={styles.emptyWrapper}>
                <Typography weight="medium" size="lg">
                    {t("empty.message1")}
                </Typography>
                <Typography weight="medium" size="lg">
                    {t("empty.message2")}
                </Typography>
            </div>
        );

    return (
        <div className={styles.root}>
            {supported.length > 1 && <FormHeader type={type} />}
            {ammPoolLiquidity && (
                <AmmPoolLiquidityForm
                    campaignKind={ammPoolLiquidityCampaignKind}
                    unsupportedChain={unsupportedChain}
                    onPreviewClick={handlePreviewOnClick}
                />
            )}
            {type === CampaignType.LiquityV2 && (
                <LiquityV2ForksForm
                    unsupportedChain={unsupportedChain}
                    onPreviewClick={handlePreviewOnClick}
                />
            )}
            {/* TODO: disable form if not for aptos? Or more generic if not for that chain  */}
            {type === CampaignType.AaveV3 && (
                <AaveV3Form
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
