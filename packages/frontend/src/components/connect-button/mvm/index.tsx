import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useMemo, useState } from "react";
import { AccountMenu, type Balance } from "../account-menu";
import type { Address } from "viem";
import { trackUmamiEvent } from "@/src/utils/umami";
import { Avatar } from "../../avatar/avatar";
import { Account } from "../../account";
import { useAptBalance } from "@aptos-labs/react";
import { formatApt } from "@aptos-labs/js-pro";
import { ChainType } from "@metrom-xyz/sdk";
import { useChainType } from "@/src/context/chain-type";

import commonStyles from "../styles.module.css";

export function ConnectButtonMvm() {
    const [accountMenu, setAccountMenu] = useState(false);

    const { connected, disconnect, account, network } = useWallet();
    const { clearLastWallet } = useChainType();

    const { data: aptBalance } = useAptBalance({
        address: account?.address.toString(),
    });

    const balance: Balance | undefined = useMemo(() => {
        if (aptBalance === undefined) return undefined;

        return {
            symbol: "APT",
            amount: Number(formatApt(aptBalance)),
        };
    }, [aptBalance]);

    function handleDisconnect() {
        clearLastWallet(ChainType.Aptos);
        disconnect();
    }

    function handleAccountMenuOpen() {
        setAccountMenu(true);
        trackUmamiEvent("open-sidebar");
    }

    function handleAccountMenuClose() {
        setAccountMenu(false);
    }

    const address = account?.address.toString() as Address | undefined;

    if (!connected || !network || !address) return null;

    return (
        <div className={commonStyles.root}>
            <div className={commonStyles.wrapper}>
                <AccountMenu
                    account={address}
                    chainId={network.chainId}
                    open={accountMenu}
                    balance={balance}
                    onClose={handleAccountMenuClose}
                    onDisconnect={handleDisconnect}
                />
                <div
                    onClick={handleAccountMenuOpen}
                    className={commonStyles.walletWrapper}
                >
                    <div className={commonStyles.account}>
                        <Avatar address={address} height={20} width={20} />
                        <Account
                            address={address}
                            className={commonStyles.displayName}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
