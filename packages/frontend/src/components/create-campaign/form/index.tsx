import type {
    CampaignPayload,
    CampaignPayloadPart,
    CampaignPayloadErrors,
} from "@/src/types";
import { useAccount, useChainId, useChains } from "wagmi";
import { useMemo } from "react";
import { AmmStep } from "./amm-step";
import { PoolStep } from "./pool-step";
import { StartDateStep } from "./start-date-step";
import { EndDateStep } from "./end-date-step";
import { RewardsStep } from "./rewards-step";

import styles from "./styles.module.css";

export interface CreateCampaignFormProps {
    payload?: CampaignPayload;
    onPayloadChange: (part: CampaignPayloadPart) => void;
    onPayloadError: (errors: CampaignPayloadErrors) => void;
}

export function CreateCampaignForm({
    payload,
    onPayloadChange,
    onPayloadError,
}: CreateCampaignFormProps) {
    const { chain: connectedChain, isConnected } = useAccount();
    const selectedChain = useChainId();
    const chains = useChains();

    const unsupportedChain = useMemo(() => {
        return (
            isConnected &&
            (!connectedChain ||
                !chains.some((chain) => chain.id === selectedChain))
        );
    }, [chains, connectedChain, isConnected, selectedChain]);

    return (
        <div className={styles.root}>
            <AmmStep
                disabled={unsupportedChain}
                amm={payload?.amm}
                onAmmChange={onPayloadChange}
            />
            <PoolStep
                disabled={!payload?.amm || unsupportedChain}
                amm={payload?.amm}
                pool={payload?.pool}
                onPoolChange={onPayloadChange}
            />
            <StartDateStep
                disabled={!payload?.pool || unsupportedChain}
                startDate={payload?.startDate}
                endDate={payload?.endDate}
                onStartDateChange={onPayloadChange}
                onError={onPayloadError}
            />
            <EndDateStep
                disabled={!payload?.startDate || unsupportedChain}
                startDate={payload?.startDate}
                endDate={payload?.endDate}
                onEndDateChange={onPayloadChange}
                onError={onPayloadError}
            />
            <RewardsStep
                disabled={!payload?.endDate || unsupportedChain}
                rewards={payload?.rewards}
                startDate={payload?.startDate}
                endDate={payload?.endDate}
                onRewardsChange={onPayloadChange}
                onError={onPayloadError}
            />
        </div>
    );
}
