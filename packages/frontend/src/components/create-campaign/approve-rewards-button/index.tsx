import { useTranslations } from "next-intl";
import { usePrevious } from "react-use";
import { useAccount, useChainId } from "wagmi";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { Button } from "@/src/ui/button";
import { WalletIcon } from "@/src/assets/wallet-icon";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useCallback, useEffect, useState } from "react";
import { ApproveRewards } from "./approve-rewards";
import type { CampaignPayload } from "@/src/types";
import { CHAIN_DATA } from "@/src/commons";
import type { SupportedChain } from "@metrom-xyz/contracts";

import styles from "./styles.module.css";

interface SubmitButtonProps {
    malformedPayload: boolean;
    payload: CampaignPayload;
    onPreviewClick: () => void;
}

export function ApproveRewardsButton({
    malformedPayload,
    payload,
    onPreviewClick,
}: SubmitButtonProps) {
    const t = useTranslations("newCampaign.submit");
    const [approved, setApproved] = useState(false);

    const previousRewards = usePrevious(payload.rewards);

    const { openConnectModal } = useConnectModal();
    const chain: SupportedChain = useChainId();
    const { address: connectedAddress } = useAccount();

    useEffect(() => {
        if (
            previousRewards &&
            previousRewards.length !== payload.rewards?.length
        )
            setApproved(false);
    }, [payload.rewards?.length, previousRewards]);

    const handleOnApprove = useCallback(() => {
        setApproved(true);
    }, []);

    if (!connectedAddress)
        return (
            <Button
                icon={WalletIcon}
                iconPlacement="right"
                disabled={malformedPayload}
                className={{ root: styles.button }}
                onClick={openConnectModal}
            >
                {t("connectWallet")}
            </Button>
        );

    if (!approved && payload?.rewards && payload.rewards.length > 0)
        return (
            <ApproveRewards
                onApprove={handleOnApprove}
                disabled={malformedPayload}
                rewards={payload?.rewards}
                spender={CHAIN_DATA[chain].contract.address}
            />
        );

    return (
        <Button
            icon={ArrowRightIcon}
            iconPlacement="right"
            disabled={malformedPayload}
            className={{ root: styles.button }}
            onClick={onPreviewClick}
        >
            {t("preview")}
        </Button>
    );
}
