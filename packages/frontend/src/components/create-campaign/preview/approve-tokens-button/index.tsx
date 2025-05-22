import { useTranslations } from "next-intl";
import { usePrevious } from "react-use";
import { useAccount, useChainId } from "wagmi";
import { Button } from "@metrom-xyz/ui";
import { WalletIcon } from "@/src/assets/wallet-icon";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useCallback, useEffect, useState } from "react";
import { ApproveTokens } from "./approve-tokens";
import type { UsdPricedErc20TokenAmount } from "@metrom-xyz/sdk";
import type { BaseTransaction } from "@safe-global/safe-apps-sdk";
import { useChainData } from "@/src/hooks/useChainData";

import styles from "./styles.module.css";

interface ApproveTokensButtonProps {
    tokenAmounts: [UsdPricedErc20TokenAmount, ...UsdPricedErc20TokenAmount[]];
    onApproved: () => void;
    onSafeTx: (tx: BaseTransaction) => void;
}

export function ApproveTokensButton({
    tokenAmounts,
    onApproved,
    onSafeTx,
}: ApproveTokensButtonProps) {
    const t = useTranslations("campaignPreview");
    const [approved, setApproved] = useState(false);

    const previousRewards = usePrevious(tokenAmounts);

    const chainId = useChainId();
    const { openConnectModal } = useConnectModal();
    const chainData = useChainData(chainId);
    const { address: connectedAddress } = useAccount();

    useEffect(() => {
        if (previousRewards && previousRewards.length !== tokenAmounts.length)
            setApproved(false);
    }, [tokenAmounts.length, previousRewards]);

    const handleOnApprove = useCallback(() => {
        setApproved(true);
        onApproved();
    }, [onApproved]);

    if (!connectedAddress)
        return (
            <Button
                icon={WalletIcon}
                iconPlacement="right"
                className={{ root: styles.button }}
                onClick={openConnectModal}
            >
                {t("connectWallet")}
            </Button>
        );

    if (!approved)
        return (
            <ApproveTokens
                tokenAmounts={tokenAmounts}
                spender={chainData?.metromContract.address}
                onApprove={handleOnApprove}
                onSafeTx={onSafeTx}
            />
        );

    return null;
}
