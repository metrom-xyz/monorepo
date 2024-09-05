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
import { useChainData } from "@/src/hooks/useChainData";

import styles from "./styles.module.css";

interface SubmitButtonProps {
    malformedPayload: boolean;
    payload: CampaignPayload;
    deploying: boolean;
    disabled: boolean;
    onDeploy: () => void;
}

export function ApproveRewardsButton({
    malformedPayload,
    payload,
    deploying,
    disabled,
    onDeploy,
}: SubmitButtonProps) {
    const t = useTranslations("campaignPreview");
    const [approved, setApproved] = useState(false);

    const previousRewards = usePrevious(payload.rewards);

    const chainId = useChainId();
    const { openConnectModal } = useConnectModal();
    const chainData = useChainData(chainId);
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
                spender={chainData?.metromContract.address}
            />
        );

    return (
        <Button
            icon={ArrowRightIcon}
            iconPlacement="right"
            disabled={disabled}
            loading={deploying}
            className={{ root: styles.button }}
            onClick={onDeploy}
        >
            {t("deploy")}
        </Button>
    );
}
