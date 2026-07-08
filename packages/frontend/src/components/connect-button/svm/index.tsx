"use client";

import { useMemo, useState } from "react";
import { AccountMenu, type Balance } from "../account-menu";
import {
    useBalance,
    useSolanaClient,
    useWalletConnection,
} from "@solana/react-hooks";
import { Avatar } from "../../avatar/avatar";
import { Account } from "../../account";
import { lamportsToSolString } from "@solana/client";
import { trackUmamiEvent } from "@/src/utils/umami";
import { solanaNetworkToId } from "@/src/utils/chain";
import { useAccount } from "@/src/hooks/useAccount";
import { ChainType } from "@metrom-xyz/sdk";
import { useChainType } from "@/src/context/chain-type";

import commonStyles from "../styles.module.css";

export function ConnectButtonSvm() {
    const [accountMenu, setAccountMenu] = useState(false);

    const { connected, disconnect } = useWalletConnection();
    const { clearLastWallet } = useChainType();
    const { address } = useAccount();
    const rawBalance = useBalance(address);
    const solanaClient = useSolanaClient();

    const balance: Balance | undefined = useMemo(() => {
        if (rawBalance.lamports === null)
            return {
                symbol: "SOL",
                amount: "0",
            };

        return {
            symbol: "SOL",
            amount: lamportsToSolString(rawBalance.lamports),
        };
    }, [rawBalance.lamports]);

    async function handleDisconnect() {
        try {
            clearLastWallet(ChainType.Svm);
            await disconnect();
        } catch (error) {
            console.error(`Could not disconnect: ${error}`);
        }
    }

    function handleAccountMenuOpen() {
        setAccountMenu(true);
        trackUmamiEvent("open-sidebar");
    }

    function handleAccountMenuClose() {
        setAccountMenu(false);
    }

    if (!connected || !address) return null;

    return (
        <div className={commonStyles.root}>
            <div className={commonStyles.wrapper}>
                <AccountMenu
                    account={address}
                    chainId={solanaNetworkToId(solanaClient.config.cluster)}
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
