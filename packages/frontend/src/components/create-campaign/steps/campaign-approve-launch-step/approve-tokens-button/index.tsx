import { useTranslations } from "next-intl";
import { useChainId } from "wagmi";
import { useAccount } from "@/src/hooks/useAccount";
import { Button } from "@metrom-xyz/ui";
import { WalletIcon } from "@/src/assets/wallet-icon";
import { ApproveTokens } from "./approve-tokens";
import type { Erc20TokenAmountWithAllowance } from "@/src/types/campaign/common";
import type { BaseTransaction } from "@safe-global/safe-apps-sdk";
import { useChainData } from "@/src/hooks/useChainData";
import { useAppKit } from "@reown/appkit/react";
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
    const t = useTranslations("campaignPreview");
    const chainId = useChainId();
    const { open } = useAppKit();
    const chainData = useChainData({ chainId });
    const { address: connectedAddress } = useAccount();

    async function handleOnConnect() {
        await open();
    }

    if (!connectedAddress)
        return (
            <Button
                icon={WalletIcon}
                iconPlacement="right"
                onClick={handleOnConnect}
                className={{ root: styles.button }}
            >
                {t("connectWallet")}
            </Button>
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
