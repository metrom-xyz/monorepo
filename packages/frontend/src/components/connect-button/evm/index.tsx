"use client";

import { useState } from "react";
import { AccountMenu, type Balance } from "../account-menu";
import { trackUmamiEvent } from "@/src/utils/umami";
import { useAccount, useBalance, useDisconnect } from "wagmi";
import { type Address } from "viem";
import { SAFE } from "@/src/commons/env";
import { SafeLogo } from "@/src/assets/logos/safe";
import { Avatar } from "../../avatar/avatar";
import { Account } from "../../account";
import { ChainType } from "@metrom-xyz/sdk";
import { useChainType } from "@/src/context/chain-type";

import styles from "./styles.module.css";
import commonStyles from "../styles.module.css";

export function ConnectButtonEvm() {
    const { disconnect } = useDisconnect();
    const { clearLastWallet } = useChainType();

    const { address, isConnected: connected, chainId } = useAccount();
    const { data: balanceData } = useBalance({ address });

    const [accountMenu, setAccountMenu] = useState(false);

    const balance: Balance | undefined = balanceData
        ? {
              symbol: balanceData.symbol,
              amount: Number(balanceData.formatted),
          }
        : undefined;

    function handleDisconnect() {
        clearLastWallet(ChainType.Evm);
        disconnect();
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
                    account={address as Address}
                    chainId={Number(chainId)}
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
                        {SAFE ? (
                            <div className={styles.safeAvatar}>
                                <SafeLogo className={styles.safeLogo} />
                            </div>
                        ) : (
                            <Avatar
                                address={address as Address}
                                height={20}
                                width={20}
                            />
                        )}
                        <Account
                            address={address as Address}
                            className={commonStyles.displayName}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
