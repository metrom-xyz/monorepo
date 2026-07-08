import { useTranslations } from "next-intl";
import { useChainId } from "wagmi";
import { useAccount } from "@/src/hooks/useAccount";
import { Button } from "@metrom-xyz/ui";
import { WalletIcon } from "@/src/assets/wallet-icon";
import { ApproveTokens } from "./approve-tokens";
import type { Erc20TokenAmountWithAllowance } from "@/src/types/campaign/common";
import type { BaseTransaction } from "@safe-global/safe-apps-sdk";
import { useChainData } from "@/src/hooks/useChainData";
import { ConnectModal } from "@/src/components/connect-button/connect-modal";
import { useState } from "react";
import type { Address } from "viem";
import type { UsdPricedErc20TokenAmount } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

interface ApproveTokensButtonProps {
    tokensToApprove: Erc20TokenAmountWithAllowance[];
    onApproved: (token: UsdPricedErc20TokenAmount) => void;
    onApproving: (address: Address | null) => void;
    onSafeTx: (tx: BaseTransaction) => void;
}

export function ApproveTokensButton({
    tokensToApprove,
    onApproved,
    onApproving,
    onSafeTx,
}: ApproveTokensButtonProps) {
    const t = useTranslations("newCampaign.form.approveLaunch");
    const chainId = useChainId();
    const chainData = useChainData({ chainId });
    const { address: connectedAddress } = useAccount();

    const [connectModalOpen, setConnectModalOpen] = useState(false);

    function handleConnectModalOpen() {
        setConnectModalOpen(true);
    }

    function handleConnectModalClose() {
        setConnectModalOpen(false);
    }

    if (!connectedAddress)
        return (
            <>
                <Button
                    icon={WalletIcon}
                    iconPlacement="right"
                    onClick={handleConnectModalOpen}
                    className={{ root: styles.button }}
                >
                    {t("connectWallet")}
                </Button>
                <ConnectModal
                    open={connectModalOpen}
                    onDismiss={handleConnectModalClose}
                />
            </>
        );

    return (
        <ApproveTokens
            tokensToApprove={tokensToApprove}
            spender={chainData?.metromContract.address}
            onApproved={onApproved}
            onApproving={onApproving}
            onSafeTx={onSafeTx}
        />
    );
}
