"use client";

import { useCallback, useMemo, useState } from "react";
import { AccountMenu, type Balance } from "../account-menu";
import {
    useDAppKit,
    useCurrentNetwork,
    useCurrentAccount,
    useCurrentClient,
} from "@mysten/dapp-kit-react";
import { Avatar } from "../../avatar/avatar";
import { Account } from "../../account";
import { trackUmamiEvent } from "@/src/utils/umami";
import { useQuery } from "@tanstack/react-query";
import { suiNetworkToId } from "@/src/utils/chain";
import { ChainType } from "@metrom-xyz/sdk";
import { useChainType } from "@/src/context/chain-type";

import commonStyles from "../styles.module.css";

const SUI_UNIT = 1_000_000_000;

export function ConnectButtonSui() {
    const [accountMenu, setAccountMenu] = useState(false);

    const dAppKit = useDAppKit();
    const { clearLastWallet } = useChainType();
    const account = useCurrentAccount();
    const network = useCurrentNetwork();
    const client = useCurrentClient();

    const address = account?.address;

    const { data: rawBalance } = useQuery({
        queryKey: ["sui-balance", address],
        queryFn: async () => {
            if (!address) return null;

            const response = await client.getBalance({ owner: address });
            return response.balance.balance;
        },
        enabled: !!address,
    });

    const balance: Balance | undefined = useMemo(() => {
        if (rawBalance === undefined || rawBalance === null) return undefined;
        return {
            symbol: "SUI",
            amount: Number(rawBalance) / SUI_UNIT,
        };
    }, [rawBalance]);

    const handleDisconnect = useCallback(async () => {
        try {
            clearLastWallet(ChainType.Sui);
            await dAppKit.disconnectWallet();
        } catch (error) {
            console.error(`Could not disconnect: ${error}`);
        }
    }, [dAppKit, clearLastWallet]);

    function handleAccountMenuOpen() {
        setAccountMenu(true);
        trackUmamiEvent("open-sidebar");
    }

    function handleAccountMenuClose() {
        setAccountMenu(false);
    }

    if (!account || !address) return null;

    return (
        <div className={commonStyles.root}>
            <div className={commonStyles.wrapper}>
                <AccountMenu
                    account={address}
                    chainId={suiNetworkToId(network)}
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
